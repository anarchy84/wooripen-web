"""
우리편 이미지 파이프라인 — 로컬 → Supabase Storage 자동 업로드

흐름:
  1. mapping.csv 읽기 (원본 파일명 → 벤더/용도/주제 매핑)
  2. 로컬 staging 폴더 스캔
  3. 원본 포맷 리사이즈 (긴 변 2400px)
  4. WebP 변환본 동시 생성 (품질 85)
  5. Supabase Storage media 버킷 업로드
  6. 공개 URL을 output_urls.csv로 저장 → 어드민에서 수동 복붙

사용법:
  # 기본 디렉토리 구조
  #   scripts/image_pipeline/
  #     ├── mapping.csv
  #     ├── staging/           ← 여기에 구글드라이브에서 다운받은 원본 넣기
  #     └── output_urls.csv    ← 실행 후 생성됨

  # 1. 의존성 설치
  pip install -r requirements.txt

  # 2. 환경변수 설정 (.env.local 생성)
  #    SUPABASE_URL=https://xxx.supabase.co
  #    SUPABASE_SERVICE_ROLE_KEY=eyJhb...

  # 3. Dry-run (실제 업로드 없이 검증만)
  python upload_media.py --dry-run

  # 4. 실제 업로드
  python upload_media.py

  # 5. 특정 벤더만 실행
  python upload_media.py --vendor tossplace

절대 원칙:
  - 자동 DB INSERT 없음. URL만 출력, 어드민에서 수동 검수.
  - 기존 파일 있으면 기본값은 스킵. --overwrite 플래그 명시해야 덮어씀.
  - 원본 파일은 절대 삭제 안 함.
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

from PIL import Image
from dotenv import load_dotenv
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.table import Table
from supabase import create_client, Client

# ---------- 상수 ----------

SCRIPT_DIR = Path(__file__).parent
STAGING_DIR = SCRIPT_DIR / "staging"              # 원본 이미지 넣는 곳
MAPPING_CSV = SCRIPT_DIR / "mapping.csv"          # 매핑표
OUTPUT_CSV = SCRIPT_DIR / "output_urls.csv"       # 결과 URL 출력
BUCKET_NAME = "media"                              # Supabase Storage 버킷
LONG_EDGE_LIMIT = 2400                             # 긴 변 상한 (px)
WEBP_QUALITY = 85                                  # WebP 품질
JPEG_QUALITY = 88                                  # JPEG 리사이즈 품질
ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

console = Console()


# ---------- 데이터 클래스 ----------

@dataclass
class MappingRow:
    """mapping.csv 한 줄"""
    original_filename: str
    vendor: str         # tossplace, torder 등
    usage: str          # logo, product, scene, case, docs (5개로 통합 — 파일명 생성용)
    subject: str        # android-pos, kiosk, cafe 등
    variant: str        # 01, 02, mono, primary 등 (빈 값 허용)
    note: str           # 메모 (빈 값 허용)

    def new_basename(self) -> str:
        """새 파일명 생성 — 확장자 제외한 base name"""
        # 토큰: vendor, usage, subject, variant (빈 값 무시)
        tokens = [self.vendor, self.usage]
        if self.subject:
            tokens.append(self.subject)
        if self.variant:
            tokens.append(self.variant)
        # 하이픈 · 언더스코어 통일 (소문자, 공백 제거)
        return "-".join(
            t.strip().lower().replace("_", "-").replace(" ", "-")
            for t in tokens if t.strip()
        )

    def storage_dir(self) -> str:
        """Supabase Storage 안에서의 디렉토리 경로 — 벤더 1단만 사용 (용도는 파일명에 이미 들어감)"""
        return f"{self.vendor}"


# ---------- 유틸 함수 ----------

def load_mapping(csv_path: Path) -> list[MappingRow]:
    """mapping.csv를 읽어서 MappingRow 리스트로 반환 (주석 # 라인 스킵)"""
    rows: list[MappingRow] = []
    with open(csv_path, encoding="utf-8") as f:
        # csv.DictReader는 첫 줄을 헤더로 사용
        reader = csv.DictReader(f)
        for r in reader:
            # 주석 라인 (original_filename이 # 로 시작) 스킵
            if not r.get("original_filename") or r["original_filename"].startswith("#"):
                continue
            rows.append(MappingRow(
                original_filename=r["original_filename"].strip(),
                vendor=r["vendor"].strip(),
                usage=r["usage"].strip(),
                subject=(r.get("subject") or "").strip(),
                variant=(r.get("variant") or "").strip(),
                note=(r.get("note") or "").strip(),
            ))
    return rows


def resize_image(src_path: Path, long_edge: int = LONG_EDGE_LIMIT) -> Image.Image:
    """이미지 열고 긴 변을 long_edge 이하로 리사이즈"""
    img = Image.open(src_path)
    # RGBA/P 모드를 WebP에 안전한 형태로 유지
    if img.mode == "P":
        img = img.convert("RGBA")
    w, h = img.size
    m = max(w, h)
    if m <= long_edge:
        return img  # 이미 충분히 작음 — 원본 그대로
    ratio = long_edge / m
    new_size = (int(w * ratio), int(h * ratio))
    return img.resize(new_size, Image.LANCZOS)


def image_to_bytes(img: Image.Image, ext: str) -> bytes:
    """PIL 이미지를 지정 확장자 바이트로 직렬화"""
    buf = BytesIO()
    ext_lower = ext.lower().lstrip(".")
    if ext_lower in ("jpg", "jpeg"):
        # JPEG는 투명도 지원 X → RGB로 변환
        if img.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
            img = bg
        img.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    elif ext_lower == "png":
        img.save(buf, format="PNG", optimize=True)
    elif ext_lower == "webp":
        img.save(buf, format="WEBP", quality=WEBP_QUALITY, method=6)
    else:
        raise ValueError(f"지원하지 않는 포맷: {ext}")
    return buf.getvalue()


def upload_to_supabase(
    supabase: Client,
    storage_path: str,
    data: bytes,
    content_type: str,
    overwrite: bool,
) -> str:
    """
    Supabase Storage에 업로드 후 공개 URL 반환.
    overwrite=True면 기존 파일 덮어쓰기.
    """
    storage = supabase.storage.from_(BUCKET_NAME)
    try:
        storage.upload(
            path=storage_path,
            file=data,
            file_options={
                "content-type": content_type,
                "upsert": "true" if overwrite else "false",
            },
        )
    except Exception as e:
        # 이미 존재 & overwrite=False → 정보성 메시지 (스킵)
        msg = str(e)
        if "already exists" in msg.lower() or "duplicate" in msg.lower():
            console.log(f"[yellow]⊘ 이미 존재 (스킵): {storage_path}[/yellow]")
        else:
            raise
    # 공개 URL 반환 (media 버킷이 public이어야 함)
    return storage.get_public_url(storage_path)


# ---------- 메인 ----------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="우리편 이미지 Supabase 업로드 파이프라인",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--dry-run", action="store_true", help="실제 업로드 없이 검증만")
    parser.add_argument("--overwrite", action="store_true", help="기존 파일 덮어쓰기")
    parser.add_argument("--vendor", type=str, default=None, help="특정 벤더만 실행 (예: tossplace)")
    args = parser.parse_args()

    # ----- 환경변수 로드 -----
    # wooripen-web/.env.local 우선, 없으면 .env
    load_dotenv(SCRIPT_DIR.parent.parent / ".env.local")
    load_dotenv(SCRIPT_DIR.parent.parent / ".env")  # fallback
    # URL은 SUPABASE_URL 우선, 없으면 Next.js 공용 변수 사용
    url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not args.dry_run:
        if not url:
            console.print("[red]❌ SUPABASE_URL 환경변수 필요[/red]")
            console.print("  → .env.local에 SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_URL 있는지 확인")
            return 1
        if not service_key:
            console.print("[red]❌ SUPABASE_SERVICE_ROLE_KEY 환경변수 필요[/red]")
            console.print("  → Supabase 대시보드 → Project Settings → API → service_role 키 복사")
            console.print("  → wooripen-web/.env.local 맨 아래에 추가:")
            console.print("     [yellow]SUPABASE_SERVICE_ROLE_KEY=eyJhb...[/yellow]")
            return 1

    # ----- 매핑 로드 -----
    if not MAPPING_CSV.exists():
        console.print(f"[red]❌ mapping.csv 없음: {MAPPING_CSV}[/red]")
        return 1

    mapping = load_mapping(MAPPING_CSV)
    if args.vendor:
        mapping = [m for m in mapping if m.vendor == args.vendor]
    console.print(f"[cyan]📋 매핑 {len(mapping)}건 로드됨[/cyan]")

    # ----- staging 폴더 체크 -----
    if not STAGING_DIR.exists():
        STAGING_DIR.mkdir(parents=True, exist_ok=True)
        console.print(f"[yellow]⚠ staging 폴더 생성: {STAGING_DIR}[/yellow]")
        console.print("  → 여기에 구글드라이브 원본 이미지 넣고 다시 실행")
        return 0

    # ----- staging 파일 목록 (대소문자 무시 매칭) -----
    staging_files = {
        f.name.lower(): f
        for f in STAGING_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in ALLOWED_IMAGE_EXTS
    }

    # ----- 매핑 vs staging 대조 -----
    results: list[dict] = []
    missing: list[str] = []

    # Supabase 클라이언트 (dry-run이면 None)
    supabase: Client | None = None
    if not args.dry_run:
        supabase = create_client(url, service_key)

    with Progress(
        SpinnerColumn(),
        TextColumn("[bold cyan]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        console=console,
    ) as progress:
        task = progress.add_task("이미지 처리 중", total=len(mapping))

        for row in mapping:
            progress.update(task, description=f"처리: {row.original_filename}")
            progress.advance(task)

            # PDF는 이 스크립트에서 처리 X (브로셔 등은 수동 업로드)
            if row.original_filename.lower().endswith(".pdf"):
                results.append({
                    "original": row.original_filename,
                    "status": "skip_pdf",
                    "note": "PDF는 수동 업로드 (어드민 자료실)",
                    "storage_path": "",
                    "public_url": "",
                    "webp_url": "",
                })
                continue

            # staging 파일 찾기 (대소문자 무시)
            src_path = staging_files.get(row.original_filename.lower())
            if not src_path:
                missing.append(row.original_filename)
                results.append({
                    "original": row.original_filename,
                    "status": "missing",
                    "note": "staging 폴더에 파일 없음",
                    "storage_path": "",
                    "public_url": "",
                    "webp_url": "",
                })
                continue

            # 새 파일명 (원본 확장자 유지 + WebP 생성)
            base = row.new_basename()
            ext = src_path.suffix.lower()
            storage_dir = row.storage_dir()
            original_path = f"{storage_dir}/{base}{ext}"
            webp_path = f"{storage_dir}/{base}.webp"

            # 이미지 리사이즈
            try:
                img = resize_image(src_path)
            except Exception as e:
                results.append({
                    "original": row.original_filename,
                    "status": "resize_error",
                    "note": str(e),
                    "storage_path": "",
                    "public_url": "",
                    "webp_url": "",
                })
                continue

            # 원본 포맷 바이트
            try:
                original_bytes = image_to_bytes(img, ext)
                webp_bytes = image_to_bytes(img, ".webp")
            except Exception as e:
                results.append({
                    "original": row.original_filename,
                    "status": "convert_error",
                    "note": str(e),
                    "storage_path": "",
                    "public_url": "",
                    "webp_url": "",
                })
                continue

            # Dry-run이면 업로드 스킵
            if args.dry_run:
                results.append({
                    "original": row.original_filename,
                    "status": "dry_run_ok",
                    "note": f"원본 {len(original_bytes)//1024}KB + WebP {len(webp_bytes)//1024}KB",
                    "storage_path": original_path,
                    "public_url": f"[dry-run] {original_path}",
                    "webp_url": f"[dry-run] {webp_path}",
                })
                continue

            # 실제 업로드
            try:
                content_type = {
                    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                    ".png": "image/png", ".webp": "image/webp",
                }[ext]
                orig_url = upload_to_supabase(
                    supabase, original_path, original_bytes, content_type, args.overwrite
                )
                webp_url = upload_to_supabase(
                    supabase, webp_path, webp_bytes, "image/webp", args.overwrite
                )
                results.append({
                    "original": row.original_filename,
                    "status": "uploaded",
                    "note": row.note,
                    "storage_path": original_path,
                    "public_url": orig_url,
                    "webp_url": webp_url,
                })
            except Exception as e:
                results.append({
                    "original": row.original_filename,
                    "status": "upload_error",
                    "note": str(e),
                    "storage_path": original_path,
                    "public_url": "",
                    "webp_url": "",
                })

    # ----- output_urls.csv 저장 -----
    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["original", "status", "note", "storage_path", "public_url", "webp_url"],
        )
        writer.writeheader()
        writer.writerows(results)

    # ----- 요약 출력 -----
    table = Table(title="📊 업로드 결과 요약")
    table.add_column("상태", style="cyan")
    table.add_column("개수", style="magenta", justify="right")
    from collections import Counter
    status_counts = Counter(r["status"] for r in results)
    for status, count in sorted(status_counts.items()):
        table.add_row(status, str(count))
    console.print(table)

    if missing:
        console.print(f"\n[yellow]⚠ staging에 없는 파일 {len(missing)}개:[/yellow]")
        for m in missing[:10]:
            console.print(f"  - {m}")
        if len(missing) > 10:
            console.print(f"  ... 외 {len(missing)-10}개")

    console.print(f"\n[green]✅ 결과 저장: {OUTPUT_CSV}[/green]")
    if args.dry_run:
        console.print("[blue]ℹ Dry-run 모드 — 실제 업로드는 --dry-run 빼고 다시 실행[/blue]")

    # ----- 매니페스트 빌드 (프론트엔드 MediaSlot 용) -----
    # dry-run 이 아닐 때만 실행 — 실제로 업로드된 파일 기준으로 JSON 생성
    if not args.dry_run:
        try:
            from build_manifest import build_manifest, MANIFEST_PATH
            manifest = build_manifest()
            console.print(
                f"[green]✅ 매니페스트 빌드: {len(manifest['items'])}개 이미지 → {MANIFEST_PATH}[/green]"
            )
        except Exception as e:
            # 매니페스트 빌드 실패가 업로드 자체를 실패시키지 않도록 소프트 처리
            console.print(f"[yellow]⚠ 매니페스트 빌드 실패 (업로드는 성공): {e}[/yellow]")
            console.print("[yellow]  → 수동 실행: python scripts/image_pipeline/build_manifest.py[/yellow]")

    return 0


if __name__ == "__main__":
    sys.exit(main())

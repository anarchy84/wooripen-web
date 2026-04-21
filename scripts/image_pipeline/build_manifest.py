"""
미디어 매니페스트 빌더
=====================

output_urls.csv  →  lib/media-manifest.json 변환 스크립트.

언제 실행되나:
    - upload_media.py 가 업로드 끝낸 뒤 자동 호출
    - 또는 수동 실행:  python scripts/image_pipeline/build_manifest.py

왜 필요하나:
    - 웹(Next.js)의 MediaSlot 컴포넌트가 "이 이미지가 실제로 업로드됐는지"
      알려면 런타임에 Supabase 를 조회하지 않고 빌드 타임 JSON 으로
      한 번에 확인해야 빠르다.
    - output_urls.csv 는 업로드 스크립트의 출력, media-manifest.json 은
      프론트엔드의 입력. 둘을 1:1 매핑해 주는 얇은 브리지.
"""

from __future__ import annotations

import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# ─── 경로 정의 ───────────────────────────────
# 이 파일 기준: wooripen-web/scripts/image_pipeline/build_manifest.py
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent  # wooripen-web/
CSV_PATH = SCRIPT_DIR / "output_urls.csv"
MANIFEST_PATH = PROJECT_ROOT / "lib" / "media-manifest.json"


# ─── 유틸 ───────────────────────────────────
def _basename_key(storage_path: str) -> str | None:
    """
    storage_path 에서 확장자 뺀 파일명(= manifest key) 추출.
    예: "torder/torder-logo-primary-01.png" → "torder-logo-primary-01"
    실패 시 None.
    """
    if not storage_path:
        return None
    filename = Path(storage_path).name           # "torder-logo-primary-01.png"
    stem = Path(filename).stem                   # "torder-logo-primary-01"
    return stem or None


def _extension(storage_path: str) -> str:
    """확장자 (점 없이, 소문자). 예: "png" """
    if not storage_path:
        return ""
    return Path(storage_path).suffix.lstrip(".").lower()


# ─── 메인 ───────────────────────────────────
def build_manifest(
    csv_path: Path = CSV_PATH,
    manifest_path: Path = MANIFEST_PATH,
) -> dict[str, Any]:
    """
    output_urls.csv 를 읽고 media-manifest.json 을 생성/덮어쓰기.
    반환: 생성된 manifest dict (로깅·테스트용).
    """
    if not csv_path.exists():
        raise FileNotFoundError(f"output_urls.csv 를 찾을 수 없음: {csv_path}")

    items: dict[str, dict[str, Any]] = {}

    with csv_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            status = (row.get("status") or "").strip()
            # "uploaded" 가 아닌 행(missing, skip_pdf, error 등)은 매니페스트에 넣지 않음
            if status != "uploaded":
                continue

            storage_path = (row.get("storage_path") or "").strip()
            public_url = (row.get("public_url") or "").strip()
            webp_url = (row.get("webp_url") or "").strip() or None

            key = _basename_key(storage_path)
            if not key:
                # storage_path 비어있으면 매니페스트 항목으로 쓸 수 없음
                continue

            items[key] = {
                "ext": _extension(storage_path),
                "storage_path": storage_path,
                "public_url": public_url,
                "webp_url": webp_url,
                "webp_available": bool(webp_url),
            }

    manifest = {
        "version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "note": (
            "이 파일은 scripts/image_pipeline/build_manifest.py 가 "
            "output_urls.csv 로부터 자동 생성한다. 수동 편집 금지."
        ),
        "items": items,
    }

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return manifest


def main() -> None:
    """CLI 진입점."""
    manifest = build_manifest()
    total = len(manifest["items"])
    print(f"✅ 매니페스트 빌드 완료: {total}개 이미지 등록")
    print(f"   → {MANIFEST_PATH}")


if __name__ == "__main__":
    main()

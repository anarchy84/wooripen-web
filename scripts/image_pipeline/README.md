# 우리편 이미지 파이프라인

로컬 → Supabase Storage → 어드민 복붙까지 3단계로 돌아가는 자동화 스크립트.

## 핵심 원칙

- **자동 DB INSERT 없음**. URL만 출력, 어드민에서 대웅이 수동 복붙
- **원본 파일 절대 삭제 X**. 원본은 구글드라이브에 그대로 둠
- **기본값은 `--dry-run`으로 먼저 검증**하고 실제 업로드

## 디렉토리 구조

```
scripts/image_pipeline/
├── upload_media.py        # 메인 스크립트
├── mapping.csv            # 원본파일명 → 벤더/용도 매핑
├── requirements.txt       # 파이썬 의존성
├── README.md              # 이 파일
├── staging/               # 원본 이미지 넣는 곳 (gitignore 권장)
└── output_urls.csv        # 실행 후 생성됨 (공개 URL 목록)
```

## 사전 준비 (1회만)

### 1. 파이썬 의존성 설치

```bash
cd scripts/image_pipeline
```

```bash
python3 -m venv .venv
```

```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
```

### 2. 환경변수 설정

`wooripen-web/.env.local`에 아래 2줄 있는지 확인 (없으면 추가):

```
SUPABASE_URL=https://llnzuczikgvbxxujztao.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
```

> ⚠ `SERVICE_ROLE_KEY`는 절대 커밋하지 말 것. `.env.local`은 이미 gitignore에 있음.

### 3. Supabase `media` 버킷 공개 설정

- Supabase 대시보드 → Storage → `media` 버킷 → Public으로 설정
- RLS 정책: 이 스크립트는 service_role 키로 쓰니까 RLS 우회됨 (걱정 X)

## 실행 흐름 (매번 돌릴 때)

### Step 1. 구글드라이브에서 원본 다운로드

- 구글드라이브 → 필요한 이미지 다운로드
- 다운로드한 파일을 `staging/` 폴더에 넣기
- 파일명은 **그대로** 두기 (mapping.csv가 원본 파일명 기준으로 매칭)

### Step 2. mapping.csv 확인/수정

- `mapping.csv` 열어서 새로 추가된 이미지가 있으면 한 줄 추가
- 기존에 없던 벤더나 새 용도가 생기면 행 추가

컬럼:
| 컬럼 | 설명 | 예시 |
|---|---|---|
| `original_filename` | staging 폴더에 넣은 원본 파일명 | `torder_BBQ-0.png` |
| `vendor` | 벤더 코드 (소문자) | `torder`, `tossplace` |
| `usage` | 용도 코드 | `logo`, `product`, `lifestyle`, `bg`, `mockup`, `icon`, `case`, `brochure` |
| `subject` | 주제 (선택) | `bbq`, `android-pos`, `cafe` |
| `variant` | 변형 번호 (선택) | `01`, `mono`, `primary` |
| `note` | 메모 (선택) | `BBQ 프랜차이즈` |

> `#` 으로 시작하는 라인은 주석으로 무시됨.

### Step 3. Dry-run (검증)

```bash
python upload_media.py --dry-run
```

출력 보고:
- `dry_run_ok` → 정상
- `missing` → staging 폴더에 해당 파일 없음 (파일명 오타 확인)
- `resize_error` / `convert_error` → 파일 손상 등

### Step 4. 실제 업로드

```bash
python upload_media.py
```

또는 특정 벤더만:

```bash
python upload_media.py --vendor tossplace
```

이미 올린 파일 덮어쓰기:

```bash
python upload_media.py --overwrite
```

### Step 5. output_urls.csv 확인 및 어드민 복붙

- `output_urls.csv` 열기
- `public_url`, `webp_url` 컬럼에서 URL 복사
- 어드민 → 해당 제품/섹션 편집 → 이미지 URL 붙여넣기

## 무엇이 자동으로 처리되나

자동 처리:
- 긴 변 2400px 이하로 리사이즈
- WebP 변환본 동시 생성 (품질 85)
- Supabase Storage `media/{vendor}/{usage}/` 경로로 업로드
- 중복 파일 기본 스킵 (덮어쓰려면 `--overwrite`)

수동 확인 필요:
- PDF (브로셔)는 스크립트가 스킵함 → 수동 업로드
- 어드민에서 각 제품/섹션에 URL 꽂기
- OG 이미지나 대표 이미지 선정

## 트러블슈팅

**"SUPABASE_URL 환경변수 필요"**
→ `.env.local` 파일에 `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY` 추가.

**"staging 폴더에 파일 없음"**
→ mapping.csv의 `original_filename`과 실제 파일명이 정확히 일치해야 함. 공백·특수문자까지.

**"already exists" 에러**
→ 이미 올린 파일. 덮어쓰려면 `--overwrite` 플래그 추가.

**대용량 파일 업로드 느림**
→ 정상. 토스플레이스 배경 이미지 16~34MB짜리는 업로드에 수 초 걸림. 리사이즈된 WebP는 훨씬 작음.

## 다음 단계 (2차 개선)

- 업로드 후 자동으로 Supabase `media_library` 테이블에 메타데이터 저장 (어드민에서 검색 가능하게)
- 어드민에 이미지 갤러리 UI 만들어서 URL 복붙 대신 드롭다운 선택
- 썸네일 자동 생성 (400x400)

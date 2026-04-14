# 우리편 어드민 시스템 기획서 v1.0
> 작성일: 2026-04-14 | 상태: 기획 검토 중 (대웅 승인 대기)

---

## 현황 진단

현재 우리편 웹사이트는 9개 페이지에 걸쳐 **모든 상품 데이터가 JSX에 하드코딩**되어 있다.
Supabase에 `products`, `tips`, `consultations` 테이블이 존재하지만 전부 0건이며,
실제 DB 조회 코드는 한 줄도 없다. 상품 변경이나 콘텐츠 발행을 하려면 코드를 직접 수정하고
커밋/배포해야 하는 구조라서, 비개발자 관리자가 운영할 수 없는 상태다.

### 하드코딩된 데이터 현황

| 페이지 | 하드코딩 항목 | 데이터 수 |
|--------|-------------|----------|
| 홈 (`/`) | 카테고리 카드, 가격 카드, 통계, 후기, FAQ | ~30개 |
| 인터넷 (`/internet`) | 통신사별 요금제 (SKT/KT/LG U+) | 9개 플랜 |
| 단말기 (`/business/terminal`) | 단말기 종류, 수수료, 기능 | 4개 제품 |
| CCTV (`/business/cctv`) | 카메라 타입, 채널 패키지 | 4개 제품 |
| 키오스크 (`/business/torder`) | 키오스크 종류, ROI 수치 | 4개 제품 |
| 렌탈 (`/rental`) | 정수기/공기청정기/복합기/제빙기 | 9개 제품 |
| 맞춤추천 (`/recommend`) | 업종별 추천 조합 | 6개 업종 |
| 꿀팁 (`/tips`) | 블로그 게시글 | 6개 글 |
| 회사소개 (`/about`) | 연혁, 통계, 소개 | 정적 텍스트 |

---

## 1. 마케팅팀 요구사항

### 1-1. 상품 관리 — "모델이 바뀌면 즉시 반영"

우리 사업 특성상 통신사 프로모션, 단말기 단종/신모델, 렌탈 가격 변동이 **월 단위**로 발생한다.
현재처럼 개발자한테 요청해서 코드 수정 → 커밋 → 배포하는 프로세스는 최소 반나절이 걸리고,
프로모션 시작일에 맞추지 못하면 매출 손실로 직결된다.

**핵심 요구:**

- 상품별 가격/스펙/이미지를 **어드민에서 즉시 수정** 가능해야 함
- **프로모션 배지** (예: "4월 한정", "설치비 무료") 토글 on/off
- 상품 **노출 순서** 드래그 또는 숫자로 조정
- 상품 **활성/비활성** 처리 (단종 모델은 숨기되 데이터는 보존)
- 카테고리별 관리: 인터넷 / 단말기 / CCTV / 키오스크 / 렌탈

**추가 희망:**

- 상품 수정 시 **변경 이력** 남기기 (누가 언제 뭘 바꿨는지)
- 상품 이미지 교체 시 자동으로 **WebP 변환 + 리사이즈**

### 1-2. SEO & 메타태그 관리 — "페이지별 메타 직접 수정"

검색엔진 상위노출이 리드젠의 핵심이다. 현재 전체 사이트에 하나의 메타 디스크립션만 설정되어 있고,
페이지별 최적화가 안 되어 있다.

**핵심 요구:**

- **페이지별** title, description, OG 이미지, canonical URL 수정
- 대상 페이지: 홈, 인터넷, 단말기, CCTV, 키오스크, 렌탈, 맞춤추천, 꿀팁, 회사소개 (9개)
- 꿀팁 게시글은 **글별로** 별도 메타태그 설정
- 수정 즉시 반영 (배포 없이)

### 1-3. 스크립트 삽입 — "GTM + 기타 트래킹"

**핵심 요구:**

- **구글 태그매니저(GTM)** 컨테이너 ID를 어드민에서 입력하면 `<head>`에 자동 삽입
- GTM 외 추가 스크립트 슬롯 2~3개 (네이버 프리미엄 로그분석, 카카오 픽셀 등)
- 스크립트별 **활성/비활성** 토글
- 페이지별 적용 or 전체 적용 선택 가능

---

## 2. 콘텐츠팀 요구사항

### 2-1. 꿀팁 에디터 — "워드프레스급 글쓰기 경험"

블로그 콘텐츠는 SEO 상위노출의 핵심 무기이자 브랜딩 장치다.
현재 6개 더미 글이 하드코딩되어 있고, 새 글을 추가하려면 코드를 건드려야 한다.

**핵심 요구:**

- **리치 텍스트 에디터** (WYSIWYG): 제목, 본문, 이미지 삽입, 링크, 인용, 코드 블록
- 에디터 후보: TipTap (추천) — 헤드리스 + 확장성, Lexical, Quill 등
- 이미지 업로드 시 **자동 WebP 변환** (서버 사이드 sharp 라이브러리)
- 이미지 최대 너비 자동 리사이즈 (1200px 이하)
- **카테고리** 선택 (인터넷, 단말기, CCTV, 키오스크, 가이드, 프로모션)
- **태그** 자유 입력 (콤마 구분)
- **발행 상태** 관리: 임시저장(draft) → 발행(published) → 비공개(hidden)
- **발행 예약** 기능 (선택, 우선순위 낮음)

### 2-2. SEO 어시스턴트 — "Yoast/RankMath 같은 실시간 가이드"

콘텐츠 에디터가 SEO에 최적화된 글을 쓸 수 있도록 실시간 피드백을 제공해야 한다.

**핵심 요구:**

- **SEO 미리보기**: 구글 검색결과에 어떻게 보이는지 실시간 프리뷰
  - title 길이 (30~60자 권장, 초과 시 경고)
  - description 길이 (120~160자 권장)
  - URL slug 편집 가능
- **키워드 분석 패널**:
  - 포커스 키워드 입력
  - 본문 내 키워드 출현 횟수 / 밀도 표시
  - 제목(H1)에 키워드 포함 여부 체크
  - 첫 문단에 키워드 포함 여부 체크
  - 이미지 alt 태그에 키워드 포함 여부 체크
- **가독성 분석**:
  - 문단 길이 (300자 이하 권장)
  - 소제목(H2/H3) 사용 여부
  - 내부 링크 / 외부 링크 포함 여부
- **SEO 점수**: 위 항목을 종합해서 🔴🟡🟢 신호등 점수 표시
- **OG 이미지 미리보기**: 카카오톡/페이스북 공유 시 미리보기

### 2-3. 이미지 관리

**핵심 요구:**

- 업로드 시 자동 WebP 변환 (원본도 보존)
- Supabase Storage 사용
- 이미지 목록 갤러리 (재사용 가능)
- alt 텍스트 입력 필드 (SEO 필수)
- 파일명 자동 정리 (한글 → 영문 slug, 공백 → 하이픈)

---

## 3. 개발팀 설계안

마케팅팀과 콘텐츠팀 요구를 종합해서 아래와 같이 설계한다.

### 3-1. 전체 아키텍처

```
[어드민 SPA]  ←→  [Next.js API Routes]  ←→  [Supabase]
  /admin/*          /api/admin/*              products, tips,
  (클라이언트)        (서버 사이드)               site_settings,
                                              page_meta,
                                              scripts,
                                              media
                         ↕
                  [Supabase Storage]
                  (이미지 WebP 변환)

[프론트엔드 페이지]  ←→  [Supabase Direct Query]
  /internet 등           products, tips 등
  (SSR/ISR)              (서버 컴포넌트에서 직접 조회)
```

### 3-2. DB 스키마 확장

현재 Supabase에 `products`, `tips`, `consultations` 3개 테이블이 있다.
추가로 필요한 테이블:

```sql
-- ① 페이지별 메타태그 관리
CREATE TABLE page_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT UNIQUE NOT NULL,        -- 'home', 'internet', 'terminal', ...
  page_name TEXT NOT NULL,               -- '홈', '인터넷', '결제단말기', ...
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  structured_data JSONB,                 -- JSON-LD 스키마
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ② 외부 스크립트 관리 (GTM 등)
CREATE TABLE scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                    -- 'GTM', '네이버 프리미엄 로그분석', ...
  code TEXT NOT NULL,                    -- 스크립트 코드 전문
  position TEXT DEFAULT 'head',          -- 'head' | 'body_start' | 'body_end'
  scope TEXT DEFAULT 'global',           -- 'global' | 'page'
  target_pages TEXT[],                   -- scope='page'일 때 대상 slug 배열
  is_active BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ③ 미디어 라이브러리
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,               -- 원본 파일명
  storage_path TEXT NOT NULL,            -- Supabase Storage 경로
  webp_path TEXT,                        -- WebP 변환본 경로
  mime_type TEXT,
  file_size INTEGER,                     -- bytes
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ④ products 테이블 확장 (기존 스키마에 컬럼 추가)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_category TEXT;
  -- 'internet_100m', 'internet_500m', 'terminal_wireless', 'cctv_dome', 
  -- 'rental_water', 'rental_air' 등 세부 분류

ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSONB;
  -- { "speed": "1Gbps", "channels": "4ch", "monthly": 29900 } 등 유연한 스펙

ALTER TABLE products ADD COLUMN IF NOT EXISTS promo_badge TEXT;
  -- '4월 한정', '설치비 무료', null이면 미표시

ALTER TABLE products ADD COLUMN IF NOT EXISTS promo_active BOOLEAN DEFAULT false;

ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
  -- 상품 상세 설명

-- ⑤ 사이트 전역 설정 (Key-Value)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,                  -- 'site_name', 'gtm_id', 'phone', ...
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3-3. products 테이블 카테고리 체계

현재 하드코딩된 상품들을 DB로 옮길 때의 카테고리 구조:

```
category (대분류)     sub_category (소분류)        현재 페이지
─────────────────────────────────────────────────────────
internet              internet_100m               /internet
                      internet_500m
                      internet_1g

terminal              terminal_wireless           /business/terminal
                      terminal_wired
                      terminal_keyin
                      terminal_pos

cctv                  cctv_dome                   /business/cctv
                      cctv_bullet
                      cctv_ptz
                      cctv_wireless

torder                torder_stand                /business/torder
                      torder_table
                      torder_wall
                      torder_mobile

rental                rental_water                /rental
                      rental_air
                      rental_multi
                      rental_ice
```

`specs` JSONB 컬럼을 쓰는 이유: 인터넷은 속도/통신사가, 단말기는 결제방식이, CCTV는 채널수가
각각 다른 스펙을 갖기 때문에 고정 컬럼 대신 유연한 JSON으로 처리한다.

### 3-4. 어드민 페이지 구조

```
/admin
├── /admin/login                    ← Supabase Auth (이메일/비밀번호)
├── /admin                          ← 대시보드 (상담 현황, 최근 글, 빠른 링크)
│
├── /admin/products                 ← 상품 목록 (카테고리 탭 필터)
│   ├── /admin/products/new         ← 상품 등록
│   └── /admin/products/[id]        ← 상품 수정
│
├── /admin/tips                     ← 꿀팁 글 목록
│   ├── /admin/tips/new             ← 새 글 작성 (리치 에디터 + SEO 패널)
│   └── /admin/tips/[id]            ← 글 수정
│
├── /admin/media                    ← 미디어 라이브러리 (이미지 갤러리)
│
├── /admin/seo                      ← 페이지별 메타태그 관리
│   └── /admin/seo/[slug]           ← 개별 페이지 메타 수정
│
├── /admin/scripts                  ← 외부 스크립트 관리 (GTM 등)
│
├── /admin/consultations            ← 상담 신청 목록 (조회/상태 변경)
│
└── /admin/settings                 ← 사이트 설정 (전화번호, 회사 정보 등)
```

### 3-5. 프론트엔드 마이그레이션 전략

하드코딩 → DB 전환은 **점진적으로** 진행한다.

```
Phase 1: 어드민 + API 기반 구축
  ├── Supabase Auth 세팅 (어드민 전용 유저)
  ├── API Routes 생성 (/api/admin/products, /api/admin/tips, ...)
  ├── 어드민 UI 구축 (상품 CRUD, 꿀팁 에디터, SEO 관리)
  └── 미디어 업로드 + WebP 변환 파이프라인

Phase 2: 프론트엔드 DB 연동
  ├── 기존 하드코딩 데이터를 DB에 시드(seed)
  ├── 각 페이지를 SSR로 전환 (Supabase 서버 쿼리)
  ├── 하드코딩 코드 제거
  └── ISR(Incremental Static Regeneration) 적용 — revalidate 60초

Phase 3: 고도화
  ├── 상품 변경 이력 로그
  ├── 꿀팁 발행 예약
  ├── SEO 점수 자동 계산
  └── 이미지 CDN 최적화
```

### 3-6. 기술 스택 선정

| 영역 | 선택 | 사유 |
|------|------|------|
| 에디터 | **TipTap** (ProseMirror 기반) | 헤드리스, 커스텀 확장 용이, React 네이티브 지원 |
| 이미지 변환 | **sharp** (Node.js) | 서버 사이드 WebP 변환, Next.js API Route에서 실행 |
| 이미지 저장 | **Supabase Storage** | 이미 프로젝트에 포함, 무료 1GB |
| 인증 | **Supabase Auth** | 이메일/비밀번호, RLS와 연동 |
| 상태 관리 | **React Hook Form** + **SWR** | 폼 관리 + API 캐싱 |
| UI 컴포넌트 | **Tailwind** 기반 자체 구축 | 기존 디자인 시스템과 일관성 유지 |
| SEO 분석 | **자체 구현** (클라이언트 JS) | 키워드 밀도, 길이 체크는 외부 라이브러리 불필요 |

### 3-7. 어드민 인증 & 보안

```
접근 제어:
├── /admin/* 전체에 미들웨어 적용
├── Supabase Auth 세션 체크
├── RLS(Row Level Security) — 어드민 role만 write 허용
└── 일반 사용자는 read-only (프론트엔드 페이지용)

보안 체크리스트:
├── API Route에서 세션 검증 필수
├── 이미지 업로드 — 파일 타입/사이즈 검증 (최대 5MB)
├── XSS 방지 — TipTap 출력 sanitize
├── CSRF — Next.js 기본 보호 + Supabase token
└── Rate limiting — 상담 폼 제출 제한
```

### 3-8. 주요 화면 와이어프레임 (텍스트)

**상품 관리 화면 (`/admin/products`)**
```
┌──────────────────────────────────────────────┐
│ [인터넷] [단말기] [CCTV] [키오스크] [렌탈]      │  ← 카테고리 탭
├──────────────────────────────────────────────┤
│                                    [+ 새 상품] │
│ ┌────┬────────┬────────┬──────┬──────┬─────┐ │
│ │ 순서│ 상품명  │ 가격    │ 상태  │ 프로모 │ 수정 │ │
│ ├────┼────────┼────────┼──────┼──────┼─────┤ │
│ │ ≡ 1│ SKT 1G │ 33,000 │ 🟢   │ 4월  │ ✏️  │ │
│ │ ≡ 2│ KT 1G  │ 33,000 │ 🟢   │  —   │ ✏️  │ │
│ │ ≡ 3│ LG 1G  │ 33,000 │ ⚫   │  —   │ ✏️  │ │
│ └────┴────────┴────────┴──────┴──────┴─────┘ │
└──────────────────────────────────────────────┘
```

**꿀팁 에디터 화면 (`/admin/tips/new`)**
```
┌──────────────────────────┬─────────────────┐
│                          │ SEO 분석 패널     │
│  제목: [____________]    │                  │
│  슬러그: [__________]    │ 포커스 키워드:     │
│  카테고리: [드롭다운]     │ [____________]   │
│                          │                  │
│  ┌────────────────────┐  │ SEO 점수: 🟢 85  │
│  │                    │  │                  │
│  │   TipTap 에디터     │  │ ✅ 제목에 키워드   │
│  │                    │  │ ✅ 첫 문단 키워드  │
│  │   (리치 텍스트)      │  │ ⚠️ 이미지 alt 없음│
│  │                    │  │ ✅ 내부 링크 있음  │
│  │                    │  │ ✅ description OK │
│  └────────────────────┘  │                  │
│                          │ ── 검색 미리보기 ──│
│  태그: [인터넷, 비용절감]  │ 우리편 | 꿀팁 제목 │
│                          │ wooripen.co.kr/… │
│  ┌──────────────────┐   │ 메타 설명 텍스트가 │
│  │ 발행 설정          │   │ 여기에 표시됩니다  │
│  │ ○ 임시저장         │   │                  │
│  │ ● 발행            │   │ ── OG 미리보기 ── │
│  │ ○ 비공개          │   │ ┌──────────────┐ │
│  │                   │   │ │  OG 이미지     │ │
│  │ [저장] [미리보기]   │   │ │  미리보기      │ │
│  └──────────────────┘   │ └──────────────┘ │
└──────────────────────────┴─────────────────┘
```

**SEO 관리 화면 (`/admin/seo`)**
```
┌──────────────────────────────────────────────┐
│ 페이지별 SEO 메타태그 관리                       │
├──────────────────────────────────────────────┤
│ ┌────────┬─────────────────┬──────────┬────┐ │
│ │ 페이지  │ SEO Title        │ 상태     │수정│ │
│ ├────────┼─────────────────┼──────────┼────┤ │
│ │ 홈     │ 우리편 - 사업자... │ 🟢 설정됨│ ✏️ │ │
│ │ 인터넷  │ (미설정)          │ 🔴 없음  │ ✏️ │ │
│ │ 단말기  │ (미설정)          │ 🔴 없음  │ ✏️ │ │
│ │ CCTV   │ (미설정)          │ 🔴 없음  │ ✏️ │ │
│ │ …      │                  │          │    │ │
│ └────────┴─────────────────┴──────────┴────┘ │
└──────────────────────────────────────────────┘
```

---

## 4. 구현 우선순위 (제안)

마케팅 임팩트와 개발 난이도를 고려한 우선순위:

```
Sprint 1 (1주) — 기반 구축
  ├── Supabase Auth + 어드민 로그인
  ├── 어드민 레이아웃 (사이드바 + 헤더)
  ├── products API CRUD + 시드 데이터 마이그레이션
  └── 상품 관리 UI (목록 + 수정)

Sprint 2 (1주) — 콘텐츠 엔진
  ├── 꿀팁 에디터 (TipTap + CRUD)
  ├── 이미지 업로드 + WebP 변환
  ├── 미디어 라이브러리
  └── 꿀팁 개별 페이지 (/tips/[slug])

Sprint 3 (1주) — SEO & 트래킹
  ├── 페이지별 메타태그 관리
  ├── 꿀팁 SEO 어시스턴트 패널
  ├── GTM/스크립트 삽입 관리
  └── 프론트엔드 DB 연동 전환

Sprint 4 (1주) — 마무리
  ├── 상담 신청 관리 (목록/상태/필터)
  ├── 대시보드 (KPI 카드)
  ├── 프로모션 배지 시스템
  └── QA + 성능 최적화
```

---

## 5. 리스크 & 결정 필요 사항

| # | 항목 | 설명 | 결정 필요 |
|---|------|------|----------|
| 1 | **에디터 선택** | TipTap (추천) vs Lexical vs Quill — TipTap이 커스텀 확장/SEO 연동에 가장 적합 | 승인 필요 |
| 2 | **ISR vs SSR** | 상품 페이지를 ISR(60초 캐시)로 할지, 완전 SSR로 할지. ISR 추천 (속도 + 실시간성 균형) | 승인 필요 |
| 3 | **이미지 저장** | Supabase Storage (무료 1GB) vs Cloudflare R2 (10GB 무료). 초기엔 Supabase로 시작, 용량 부족 시 R2 전환 | 승인 필요 |
| 4 | **어드민 접근자** | 대웅 본인만? 팀원 추가 가능성? → 역할(role) 시스템 복잡도에 영향 | 확인 필요 |
| 5 | **도메인 연결** | wooripen.co.kr 도메인이 Vercel에 연결되어 있는지, SSL 상태 | 확인 필요 |
| 6 | **하드코딩 전환 범위** | recommend, about 페이지도 DB화할지, 정적으로 유지할지 | 확인 필요 |

---

## 6. 기대 효과

| Before (현재) | After (어드민 도입 후) |
|--------------|---------------------|
| 상품 변경 시 개발자 필요 (반나절) | 관리자가 직접 수정 (5분) |
| 블로그 추가 불가 | 에디터에서 즉시 발행 |
| SEO 메타 변경 = 코드 수정 | 어드민에서 실시간 수정 |
| GTM 추가 = 코드 배포 | 스크립트 관리 패널에서 붙여넣기 |
| 프로모션 반영 지연 | 프로모션 배지 즉시 on/off |

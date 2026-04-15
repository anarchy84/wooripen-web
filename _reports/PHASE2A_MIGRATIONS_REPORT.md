# Phase 2-A 마이그레이션 검수 보고서

작성일: 2026-04-15
작성: Cowork (마스터 하네스 → 개발팀·마케팅팀·컨텐츠팀 검수)

---

## TL;DR

- **5개 SQL 마이그레이션 파일 작성 완료** → `supabase/migrations/`
- **3팀 내부 검수 통과** (개발팀: 스키마/RLS/FK, 마케팅팀: 어트리뷰션 커버리지, 컨텐츠팀: 어드민 편집성)
- **위험도**: 🟢 낮음. 기존 테이블에 `ADD COLUMN IF NOT EXISTS`만 사용, 신규 테이블은 독립적
- **대웅 할 일**: Cursor에서 Supabase CLI로 순서대로 실행 + `list_tables`로 검증
- **자동 실행 금지 원칙 준수**: Cowork는 파일만 작성. 실제 DB 적용은 대웅이 Cursor에서 수행

---

## 1. 파일 목록 (실행 순서대로)

| # | 파일명 | 역할 | 신규/변경 |
|---|--------|------|-----------|
| 1 | `20260415000001_add_products_detail_fields.sql` | products 테이블에 세부페이지용 jsonb 필드 + slug 추가 | ALTER |
| 2 | `20260415000002_create_packages.sql` | packages + package_items 테이블 + `set_updated_at()` 함수 | CREATE |
| 3 | `20260415000003_create_site_stats.sql` | site_stats 테이블 (메인페이지 숫자 카드) | CREATE |
| 4 | `20260415000004_create_nav_menus.sql` | nav_menus 테이블 + GNB 시드 데이터 (7 대메뉴 + 하위) | CREATE |
| 5 | `20260415000005_extend_consultations_tracking.sql` | consultations에 3차 대비 플레이스홀더 필드 | ALTER |
| 6 | `20260415000006_phase2a_reinforcement.sql` | 3팀 팀장 교차검수 보강안 (Phase 2-A 완성본) | ALTER |

**⚠️ 실행 순서 중요**: 2번에서 정의한 `set_updated_at()` 함수를 3·4번이 재사용하므로 타임스탬프 순서대로 실행 필수. Supabase CLI는 파일명 정렬 순서로 실행하므로 자동으로 맞음.

---

## 2. 개발팀 검수 결과 🟢 PASS

| 체크 항목 | 결과 | 비고 |
|----------|------|------|
| 기존 products 데이터 무해 처리 | ✅ | 30개 레코드 NULL로 채워짐, 기존 `category` enum 유지 |
| RLS USING + WITH CHECK 둘 다 명시 | ✅ | 프로젝트 원칙 준수 |
| FK CASCADE 정책 명시 | ✅ | package_items → packages/products 둘 다 ON DELETE CASCADE |
| 멱등성 (재실행 안전) | ✅ | 모두 `IF NOT EXISTS` + `ON CONFLICT DO NOTHING` |
| 롤백 경로 명시 | ✅ | 모든 파일 하단 주석으로 ROLLBACK SQL 제공 |
| 함수 재정의 충돌 | ✅ | `set_updated_at()`은 `CREATE OR REPLACE`로 안전 |
| 인덱스 전략 | ✅ | 조회 패턴(`is_visible, sort_order`, `status`, `created_at DESC`)에 맞는 복합 인덱스 |

**수정된 이슈 (검수 중 발견)**:
- `nav_menus` 재실행 시 중복 시드 방지를 위해 파셜 UNIQUE 인덱스(`uq_nav_menus_root_label`, `uq_nav_menus_child_label`) 추가 + `ON CONFLICT (…) WHERE …` 명시 — 이미 반영됨

**주의사항**:
- `consultations.user_profile_id uuid`는 **FK 없이** 추가. Phase 2-B에서 `user_profiles` 테이블 생성 후 별도 마이그레이션으로 FK 부여 예정. 그 전까지는 논리적 링크만.
- `products`의 기존 `category` 컬럼은 TEXT이므로 enum 마이그레이션 없이 `sub_category`로 확장 가능. 'pg' 같은 신규 서브 카테고리는 그냥 `sub_category='pg'`로 저장하면 됨.

---

## 3. 마케팅팀 검수 결과 🟢 PASS

**어트리뷰션 커버리지 점검** — 국내 주요 채널 4종 전부 확보:

| 채널 | 클릭 ID 필드 | 상태 |
|------|--------------|------|
| Google Ads | `gclid` | ✅ |
| Meta (FB/IG) | `fbclid` | ✅ |
| 카카오모먼트 | `kakao_click_id` | ✅ |
| 네이버 GFA/SA | `naver_click_id` | ✅ |

**세션·디바이스 트래킹**:
- `session_id`, `client_id`(GA4), `fingerprint_id`, `device_type` — 3차 어트리뷰션 그래프 구축에 필요한 기본 세트 확보
- `landing_page`, `exit_page` — 퍼널 분석용
- 기존 `utm_source/medium/campaign/referrer_url` (이미 있음) + 신규 필드로 "첫 터치 + 광고 클릭 + 세션" 풀셋 완성

**리드 품질 업그레이드**:
- `interested_products text[]` — 폼에서 체크박스 다중선택 → 단일 관심사가 아닌 장바구니 개념으로 리드 스코어링 가능
- `marketing_agreed` + `marketing_agreed_at` — 개보법 타임스탬프까지 보관, 추후 재동의 캠페인 대상 필터링에 사용
- `result_note`, `contracted_at`, `contract_amount` — 3차 "상담→계약→매출" CVR/ROAS 역산 준비 완료

**우리편 비즈니스 관점 추가 의견**:
- 2차에서는 수집만, 3차에서 대시보드 붙이기 전에 GA4 연동 선행 필요 → GTM으로 `client_id`만 먼저 수집하면 3차 넘어가기 전에도 간이 어트리뷰션 가능
- `kakao_click_id`는 카카오 애드페이 정식 이름이 `kc`로 바뀔 수 있음 → 필드명은 그대로 두되 파싱 로직에서 매핑 고려

---

## 4. 컨텐츠팀 검수 결과 🟢 PASS

**어드민 퍼스트 원칙 준수 여부**:
- ✅ **GNB**: 하드코딩된 Header.tsx → nav_menus 테이블로 이관 준비 완료. 어드민에서 드래그로 순서·뎁스·표시여부 전부 조작 가능
- ✅ **숫자 카드** (메인 ⑦섹션): site_stats로 자유 편집. 이모지·+기호·단위(년/명) 전부 자유
- ✅ **패키지 상품**: 드래그&드롭으로 상품 조합 → packages + package_items 구조 완벽 대응
- ✅ **상품 세부페이지**: trust_badges / detail_features / comparison_table jsonb 필드 → 어드민에서 카드 단위 편집 가능

**컨텐츠 편집 UX 관점**:
- jsonb는 스키마 자유도는 높지만 어드민 에디터 UI 설계 공수가 필요. Step 9에서 패턴 라이브러리(JsonArrayEditor 같은 재사용 컴포넌트) 먼저 만들고 각 필드에 적용하는 순서로 진행 권장
- `cta_primary_label` / `cta_secondary_label`에 기본값('상담 신청'/'견적 받기') 있음 → 상품별 문구 A/B 테스트 시 DB만 수정하면 됨 (코드 배포 불필요)
- `packages.hook_copy` 필드 별도 존재 → 메인페이지 카드에 뿌릴 훅 문구와 상세페이지 히어로 타이틀 분리 가능 (카피라이팅 자유도 ↑)

**시드 데이터 품질**:
- nav_menus GNB 7개 대메뉴 + 하위 13개 → Step 2에서 확정한 IA 그대로 이식 ✓
- packages 시드 2개(`startup`, `support`) 골격만 — **콘텐츠 본체는 Step 10에서 작성 예정** (합의됨)
- site_stats 기본값 `1,200+`, `5년`, `20+` — 대웅이 어드민에서 실제 수치로 갱신 필요

---

## 4-1. 추가 보강 라운드 (Migration 6) — 3팀 팀장 교차검수 결과

1~5번 완성 후, 팀장 3명이 합동 리뷰하여 Phase 2-A 컴포넌트 단계 직전에 빠질 수 없는 5개 필드를 추가.

### 개발팀장 의견
- **`packages.detail_sections jsonb`** — 없으면 패키지 상세페이지 렌더러 설계 자체가 막힘. 자유 블록 배열로 최대 유연성 확보.
- **단독 파셜 인덱스 3개 추가** — `utm_campaign`, `gclid`, `marketing_agreed=true`에 파셜 인덱스. 어트리뷰션 쿼리 가속 + 저장 공간 최적화.

### 마케팅팀장 의견
- **`consultations.utm_content` / `utm_term`** — 광고 소재·키워드 레벨 CVR 분리 필수. 2차부터 수집 안 하면 3차 분석 시점에 역추적 불가.
- **`consultations.consent_ip inet`** — 개보법 감사 + 분쟁 시 증빙. `marketing_agreed=true` 시점 IP 같이 저장.

### 콘텐츠팀장 의견
- **`packages.price_range_label`** — "월 3만원대부터" 같은 심리적 문턱 낮추는 카피 요소. 정확 단가(3차)와 별개 운영.
- **`nav_menus.icon` / `badge_label` / `badge_color`** — 시즌 캠페인("신규 오픈 이벤트") 배포 없이 GNB에서 돌리기 위함.

### 보강 결과 요약표

| 대상 테이블 | 추가 컬럼 | 주관팀 |
|-----------|---------|--------|
| `packages` | `detail_sections`, `price_range_label` | 콘텐츠 |
| `consultations` | `utm_content`, `utm_term`, `consent_ip` | 마케팅 |
| `nav_menus` | `icon`, `badge_label`, `badge_color` | 콘텐츠 |
| `consultations` (인덱스) | `idx_*_utm_campaign`, `idx_*_gclid`, `idx_*_marketing_agreed` | 개발 |

---

## 5. 대웅이 Cursor에서 실행할 가이드

> **원칙**: Cowork는 파일만 썼고, 실제 DB 적용은 대웅이 직접.
> 프로덕션 DB 적용 전에 **dev 브랜치에서 먼저 검증** 강권장.

### 5-1. 권장: Supabase dev 브랜치에서 먼저 테스트

```bash
cd ~/Claud_Projects/AnarchyContentTeam/wooripen-web

# 1) 현재 상태 확인
git status
git pull --rebase

# 2) Supabase 로그인 (이미 되어 있으면 스킵)
npx supabase login

# 3) Dev 브랜치 생성 (Supabase의 Preview Branch 기능)
npx supabase branches create phase2a-test --project-ref llnzuczikgvbxxujztao

# 4) dev 브랜치에 마이그레이션 적용
npx supabase db push --branch phase2a-test

# 5) Supabase 대시보드에서 phase2a-test 브랜치 접속 → Table Editor로 검증
#    - products에 hero_title, slug 등 컬럼 추가 확인
#    - packages, site_stats, nav_menus 테이블 존재 확인
#    - nav_menus 시드 20개(대메뉴 7 + 하위 13) 확인
```

### 5-2. 검증 체크리스트 (dev 브랜치에서)

- [ ] `SELECT count(*) FROM nav_menus;` → 20
- [ ] `SELECT count(*) FROM nav_menus WHERE parent_id IS NULL;` → 7
- [ ] `SELECT count(*) FROM site_stats;` → 3
- [ ] `SELECT count(*) FROM packages;` → 2 (slug: startup, support)
- [ ] `SELECT column_name FROM information_schema.columns WHERE table_name='products' AND column_name IN ('slug','trust_badges','detail_features','hero_title');` → 4행
- [ ] `SELECT column_name FROM information_schema.columns WHERE table_name='consultations' AND column_name IN ('gclid','fbclid','client_id','interested_products');` → 4행
- [ ] RLS 확인: `SELECT relrowsecurity FROM pg_class WHERE relname IN ('packages','site_stats','nav_menus');` → 모두 `t`

### 5-3. 프로덕션 적용 (dev 검증 성공 후)

```bash
# 1) 백업 스냅샷 찍기 (Supabase 대시보드 → Database → Backups)
#    ↑ 프로덕션 DB는 반드시 백업 먼저

# 2) main 브랜치에 머지
npx supabase branches merge phase2a-test --project-ref llnzuczikgvbxxujztao

# 또는 CLI 대신: 대시보드 SQL Editor에서 5개 파일 순서대로 실행해도 됨
```

### 5-4. 문제 생기면 롤백

각 SQL 파일 하단에 `-- ROLLBACK` 주석으로 역 SQL 있음. 순서는 **역순(5→4→3→2→1)**.

---

## 6. 다음 스텝 (대웅 OK 받고 진행)

| 단계 | 내용 | 선행 조건 |
|------|------|----------|
| **Step 8-4** | Phase 2-A 컴포넌트·API 구현 (패키지 빌더 어드민, 숫자 편집, GNB 드래그 UI, 세부페이지 렌더러) | 마이그레이션 프로덕션 적용 완료 |
| **Step 9** | Phase 2-B 마이그레이션: marketing_products, testimonials, company_profile, user_profiles + OAuth, content_drafts (인라인 편집 B안) | Step 8-4 완료 |
| **Step 10** | 컨텐츠 시드: FAQ 10-15, 꿀팁 8-10, 가상 후기 6-8, 세부페이지 본문 | Step 9 완료 |

---

## 7. 안전 노트

- ✅ 자동 발행/배포/삭제 금지 원칙 준수 — Cowork는 파일만 썼음
- ✅ main 브랜치 직접 push 하지 않음 — 커밋·머지는 대웅이 Cursor에서
- ✅ 프로덕션 DB 마이그레이션 전 백업 + dev 브랜치 검증 루틴 명시
- ✅ RLS 정책 USING + WITH CHECK 둘 다 명시 (프로젝트 원칙)
- ⚠️ Cursor ↔ Cowork 동시 편집 중이면 git 락 충돌 주의. 커밋 시에는 Cursor 쪽 저장 한번 확인 후 진행

---

**대웅 OK 신호 주면 Step 8-4 (컴포넌트·API 구현)로 바로 진행.**

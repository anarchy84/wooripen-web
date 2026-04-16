# 우리편 Phase 2 — 통합 컨텍스트 문서

**작성일**: 2026-04-15
**목적**: 다른 채팅/세션에서 Phase 2 맥락을 이어받아 사이트 구성 개선 작업을 할 수 있도록 지금까지의 작업 내역·결정사항·규칙·스킬 사용 내역을 한 파일에 정리.
**다음 세션 첫 행동**: 이 문서 + `_HANDOVER.md` 두 개 먼저 읽고 요약 보고.

---

## 🎯 TL;DR

- **우리편(wooripen-web)** — 중소사업자 대상 인터넷·결제단말기·CCTV·키오스크·렌탈 통합 상담 리드 제너레이션 사이트.
- **Phase 1 완료 (2026-04-14)**: Sprint 3 Vercel 빌드 실패 → `tsconfig.json target: "es2017"` 추가로 해결. 현재 배포 정상.
- **Phase 2 진행 중 (2026-04-15)**: 상담 신청 파이프라인 전면 재구축. 현재 하드코딩 alert 7개 → Supabase DB + 완료페이지 + 광고 전환 추적 + 어트리뷰션 + 실시간 신청자 티커.
- **C0 커밋 완료** (법적 고지 + /privacy 페이지). C1~C5 대기.
- **워크플로우**: Claude가 파일 저장 → Cursor 터미널에서 대웅이 커밋·푸시 → Claude가 MCP로 검증.

---

## 🏢 프로젝트 정체

### 서비스 개요

중소사업자 대상 통합 인프라 솔루션 **리드 제너레이션 사이트**.

- **취급 상품**: 인터넷·결제단말기·CCTV·키오스크/티오더·렌탈
- **비즈니스 모델**: 웹사이트 → 상담 신청 → 영업팀 연결 → 계약
- **운영**: Anarchy(김대웅) 우리편 CMO로서 직접 개발 + 마케팅 + 영업 총괄
- **리드 관리**: 현재 CRM Pro 별도 사용 (Phase 3에서 연동 예정)

### 사용자 여정

```
랜딩 → 제품 탐색 → 맞춤 추천 → 상담 신청 → 완료 페이지 (전환 픽셀) → 영업팀 연락
```

---

## 🛠 기술 스택

| 영역 | 스택 |
|---|---|
| 프론트엔드 | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| 백엔드 | Supabase (PostgreSQL + Auth + Storage + RLS) |
| 배포 | Vercel (main 브랜치 auto-deploy) |
| 에디터 | TipTap (블로그/꿀팁용) |
| 아이콘 | Iconify (Solar 컬렉션) |
| 이미지 | sharp |
| 코드 작업 | Cursor + Claude Cowork (git 락 충돌 주의) |
| 트랜스크립트 | Whisper (로컬) |
| 영상 편집 | Final Cut Pro (FCPXML) |
| 외부 리서치 | Gemini + NotebookLM |

### 자격 증명 (참고)

- **Supabase 프로젝트 ID**: `llnzuczikgvbxxujztao`
- **Vercel 프로젝트 ID**: `prj_pdrd6xEaTq3ajr9PQvd2hBnhVhfe`
- **Vercel 팀 ID**: `team_RLvSNvCKFPar1hqGQ6GF1e9I`
- **GitHub**: `anarchy84/wooripen-web`
- **브랜치**: `main` (직접 push 자제, PR 권장)
- **Admin 계정**: `admin@ourteam.kr` (UUID: `b8420fbc-f9d3-485d-9e26-a98e79b1a0bf`)

실제 secret은 `.env.local` (커밋 X).

---

## 📏 작업 원칙 (반드시 준수)

메모리에 저장된 규칙들이다. 모든 작업에 적용된다.

### 1. 계획 → 대웅 OK → 진행
다단계 작업은 절대 예외 없이 이 순서. 추측하지 말고 물어볼 것.

### 2. 자동 배포·발행·삭제 금지
Vercel 배포 전 빌드 성공 확인. 검수 단계 반드시 거침.

### 3. 파일 저장은 Claude, 커밋은 대웅이 Cursor 터미널에서
- Claude가 로컬(마운트된 폴더) 에 Write/Edit로 파일 저장
- Claude는 직접 `git commit` / `git push` 하지 않음
- Claude가 커밋·푸시 명령어 한 세트를 제시하며 "이대로 커밋푸시해줘" 요청
- 대웅은 **Cursor 내장 터미널**에서 실행 (외부 Terminal 앱 사용 X)
- Claude가 결과(해시, Vercel 빌드 상태)를 MCP로 확인·검증
- 읽기 전용 명령 (`git status`, `git log`, `git diff`) 만 Claude가 직접 실행 OK

**이유**: 샌드박스/Mac 파일시스템 동기화 불일치 경험, Cursor git worker와 외부 터미널 락 충돌 경험, 대웅의 수동 검수 포인트 확보.

### 4. 커맨드는 스텝바이스텝으로
터미널 명령어는 한 번에 한 줄씩. 커밋 메시지에 `()`, `[]`, `...` 같은 특수문자 지양. zsh 파싱 에러 방지.

### 5. 어드민 퍼스트 원칙
자주 바꿀 영역은 하드코딩 금지. 전부 어드민 CRUD로 관리.

### 6. 한국어 우선
- 코드 주석 한국어 필수. 영어 기술 용어 나열 금지.
- UI 톤: Anarchy 브랜드 보이스 (친근+전문, 숫자로 말하기, 공감 후 솔루션)
- 금지어: 무조건, 100%, 대박, 미쳤다, 난리났다

### 7. RLS 정책
`USING` + `WITH CHECK` 둘 다 명시 (INSERT/UPDATE 모두에 걸리게)

### 8. Cursor와 동시 작업 시 git 락 주의
충돌 시 해결:
```bash
ps aux | grep -i cursor | grep "git\|Helper"
kill <PID>
rm -f .git/index.lock
```

### 9. MCP 커넥터 적극 활용
Supabase·Vercel·GitHub 등 연결된 MCP는 Cowork가 직접 호출해서 대웅 수작업 최소화.

### 10. 하네스 + 3팀 스킬 실제 발동
대웅 관련 작업은 반드시 Skill 툴로 호출해서 에이전트 페르소나 활성화.

---

## 🎭 사용 중인 스킬 / 하네스

### Anarchy 콘텐츠 본부 플러그인 (자체 제작)

| 스킬 | 역할 | 사용 타이밍 |
|---|---|---|
| `anarchy-master-harness` | 마스터 오케스트레이터 | 대웅 요청 진입점. 적절한 팀에 라우팅. |
| `anarchy-marketing-team` | 마케팅팀 (PM + 데이터분석가 + 전략기획자 + 시장조사자 + 크리에이티브기획자 + 어카운트매니저) | KPI·광고·ROAS·전환 추적 |
| `anarchy-content-team` | 컨텐츠팀 (PM + 기획자 + 시장조사자 + 제작매니저 + 영상편집가 + 대본작성가) | 영상·블로그·카피·UX |
| `anarchy-dev-team` | 개발팀 (PM + 프론트 + 백엔드 + 풀스택 + 웹기획자 + 디자이너) | Python·웹·자동화·API |

### 빌트인 스킬 (Phase 2에서 실제 호출한 것)

- `anarchy-content-team:anarchy-marketing-team` — 완료페이지 광고 전환 관점 검수
- `anarchy-content-team:anarchy-content-team` — 완료페이지 카피·UX 검수

### Phase 2에서 체이닝 가능한 빌트인 스킬

- `engineering:system-design` — DB·API 설계
- `engineering:code-review` — 커밋 전 자체 검토
- `engineering:deploy-checklist` — Vercel 배포 전 체크
- `design:ux-copy` — 마이크로카피 리뷰
- `design:accessibility-review` — WCAG 체크
- `product-management:write-spec` — PRD 작성
- `marketing:brand-review` — 톤·법적 리스크 검토
- `data:analyze` — 전환 데이터 분석

---

## 🔗 연결된 MCP 커넥터

| MCP | 용도 |
|---|---|
| Supabase | DB 쿼리·마이그레이션·RLS·Edge Function |
| Vercel | 배포 상태 확인·빌드 로그·런타임 로그 |
| GitHub (gh CLI) | PR·커밋·이슈 관리 |
| Apify | 외부 데이터 크롤링 |
| Notion | 문서 관리 |
| Asana | 태스크 관리 |
| Slack | 팀 커뮤니케이션 |
| Apple Notes | 빠른 메모 |
| Ahrefs (`ed148070...`) | SEO·키워드·백링크·사이트 감사·Web Analytics |
| Gamma | 프레젠테이션 |
| Control Chrome / Claude in Chrome | 브라우저 자동화 |
| Computer Use | 데스크톱 제어 |

---

## ✅ Phase 1 완료 내역 (2026-04-14)

### 이슈
Sprint 3 커밋 `b6308cd` 배포 후 Vercel 빌드 실패.

```
Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
```

에러 위치: `app/admin/(dashboard)/settings/page.tsx:62`
```tsx
const groups = [...new Set(SETTING_FIELDS.map(f => f.group))]
```

### 해결
`tsconfig.json`에 `"target": "es2017"` 추가.

**커밋**: `8e12192` — Vercel 빌드 성공 (READY).

---

## 🚀 Phase 2 진행 상태 (2026-04-15)

### 목표

현재 7개 상담 폼이 모두 `alert('상담 신청 완료')` 만 띄움. DB 연동 0%. 광고 전환 측정 0%. 어트리뷰션 0%.

→ **상담 신청 파이프라인 풀스택 재구축 + 광고 전환 허브 + 실시간 신청자 티커**

### 3팀 교차 검수 결과 (마케팅팀 + 컨텐츠팀)

#### 마케팅팀 요청사항

1. **완료페이지 URL 구조**: `/consultation/complete?id={id}&source={home|internet|...}`
2. **전환 이벤트 3종 세트**: GA4 `generate_lead` + Google Ads `conversion` + Meta Pixel `Lead`
   - sessionStorage dedupe (`lead_fired_{id}`) 필수
3. **UTM 캡처 확장**: first-touch + last-touch 양쪽 저장
   - `utm_term`, `utm_content`, `gclid`, `fbclid`, `first_referrer`, `landing_page` 추가
4. **개인정보 동의 분리**: 필수(개인정보 + 제3자) / 선택(마케팅)
5. **리마케팅 모수 확보**: `marketing_consent` 컬럼 신설

#### 컨텐츠팀 요청사항

1. **완료페이지 카피 확정**
   ```
   ✓ 상담 신청이 접수됐습니다
   접수번호 #20260414-0037
   영업일 기준 24시간 이내에 담당자가 직접 연락드립니다.
   (주말·공휴일 제외)

   💡 급하신 경우 대표번호 ☎ 1600-6116로 바로 연락주세요.

   [홈으로]  [꿀팁 보러가기 →]
   ```
2. **대표번호 동적 주입**: `site_settings.phone` SSR fetch
3. **개인정보 동의 UX**: 2~3개 체크박스 분리, 동의문은 [자세히 보기] → `/privacy#personal` 등
4. **에러/로딩 UX**: '오류가 발생했습니다' 금지 → '잠시 후 다시 시도해주세요. 문제가 계속되면 ☎ 1600-6116으로 연락주세요.'
5. **시각 요소**: Iconify `solar:check-circle-bold` + fade-in 애니메이션

### 대웅의 결정사항 (확정)

| # | 결정 |
|---|---|
| 1 | GA4/Google Ads/Meta Pixel 전환 ID 모두 **GTM으로 통합 관리**. 코드는 `dataLayer.push`만. GTM 컨테이너 연동은 어드민 스크립트 관리 기능 활용. |
| 2 | 대표번호 **1600-6116** — `site_settings.phone`에 Claude가 SQL seed 박음. |
| 3 | '영업일 기준 24시간 이내' 문구 OK. |
| 4 | 개인정보처리방침·제3자 동의·마케팅 동의 **어드민에서 편집 가능**. `site_settings`에 키 3개 추가. |
| 5 | 폼 필드는 **이름 / 전화 / 관심 상품** 3개만 필수. 매장명·주소는 선택. 광고 매체 추적이 더 중요. |
| 6 | **어트리뷰션 분석 고려** 구조 설계. first-touch + last-touch 모두 저장. |
| 7 | 동의 체크박스 **기본 체크**. |
| 8 | 실시간 신청자 롤링 티커 CTA 옆 배치. 마스킹 `김**` + `010-****-****` + 상태 랜덤. |
| 9 | 티커는 **가상 데이터 50건**으로 먼저 기능 구현. 런칭 시 실데이터 전환 플래그. |
| 10 | CRM Pro 연동 (기존 리드 import)은 **Phase 3로 분리**. |

---

## 📦 커밋 분할 및 진행 상태

| # | 내용 | 상태 |
|---|---|---|
| C0 | site_settings 법적 고지 3키 + phone seed + /privacy 페이지 + 어드민 '법적 고지' 그룹 | ✅ 작업 완료, 대웅 커밋 대기 |
| C1 | consultations 어트리뷰션 확장 마이그레이션 + anon INSERT RLS + consultations_public view | ⏳ 대기 |
| C2 | useAttribution 훅 + POST /api/consultations + /consultation/complete 페이지 + GTM dataLayer push | ⏳ 대기 |
| C3 | 홈 폼 파일럿 (동의 체크박스 + 필드 간소화 + 어트리뷰션 캡처) | ⏳ 대기 |
| C4 | 나머지 6개 폼 일괄 마이그레이션 (internet/rental/recommend/cctv/terminal/torder) | ⏳ 대기 |
| C5 | Live Feed 티커 컴포넌트 + 가상 데이터 50건 + 런칭 전환 플래그 | ⏳ 대기 |
| ~~C6~~ | ~~엑셀 import~~ → **Phase 3로 이동** | — |

---

## 🗃 DB 변경 계획

### site_settings (기존 테이블, 키 추가)

```sql
-- Phase 2 C0에서 INSERT 완료
INSERT INTO site_settings (key, value) VALUES
  ('phone', '1600-6116'),
  ('privacy_policy', '...전문...'),
  ('third_party_consent_text', '...전문...'),
  ('marketing_consent_text', '...전문...')
ON CONFLICT (key) DO NOTHING;
```

### consultations (기존 테이블, 컬럼 대거 추가) — C1에서 진행 예정

```sql
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS
  -- First-touch (최초 방문)
  first_utm_source text,
  first_utm_medium text,
  first_utm_campaign text,
  first_utm_term text,
  first_utm_content text,
  first_landing_page text,
  first_referrer text,
  first_visited_at timestamptz,

  -- Last-touch (제출 직전)
  last_utm_source text,
  last_utm_medium text,
  last_utm_campaign text,
  last_utm_term text,
  last_utm_content text,
  last_landing_page text,
  last_referrer text,

  -- 광고 클릭 ID
  gclid text,
  fbclid text,
  yclid text,
  ttclid text,

  -- 세션 정보
  session_count integer DEFAULT 1,
  device_type text,
  browser text,

  -- 동의
  privacy_consent boolean NOT NULL DEFAULT true,
  third_party_consent boolean NOT NULL DEFAULT true,
  marketing_consent boolean NOT NULL DEFAULT true,

  -- 출처 (CRM Pro 등 외부 import용)
  imported_from text;
```

### RLS 정책 — C1에서 추가

```sql
-- anon 사용자 INSERT 허용 (상담 신청 제출)
CREATE POLICY "consultations_anon_insert" ON consultations
  FOR INSERT TO anon
  WITH CHECK (true);

-- 기존 admin SELECT/UPDATE 정책은 유지
```

### consultations_public view — C1에서 신설

```sql
CREATE OR REPLACE VIEW consultations_public AS
SELECT
  id,
  -- 이름 마스킹: 성 + ** (한글 1글자만 남기고 마스킹)
  SUBSTRING(name, 1, 1) || '**' AS masked_name,
  -- 전화 마스킹: 앞자리만 노출
  SUBSTRING(phone, 1, 3) || '-****-****' AS masked_phone,
  product_category,
  status,
  created_at
FROM consultations
WHERE created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC
LIMIT 50;

-- anon SELECT 허용
GRANT SELECT ON consultations_public TO anon;
```

---

## 🎨 신규 파일 목록 (Phase 2 종료 시)

```
app/
├── privacy/page.tsx                       ← C0 ✅ 완료
├── consultation/
│   └── complete/page.tsx                  ← C2
├── api/
│   └── consultations/
│       ├── route.ts                       ← C2 (POST)
│       └── recent/route.ts                ← C5 (GET, 티커용)
└── admin/(dashboard)/settings/page.tsx    ← C0 ✅ 수정 완료

lib/
├── attribution.ts                         ← C2 (useAttribution 훅)
├── gtm.ts                                 ← C2 (dataLayer push 래퍼)
└── fake-consultations.ts                  ← C5 (가상 데이터 50건)

components/
└── LiveTicker.tsx                         ← C5 (실시간 신청자 롤링)
```

---

## 📝 Phase 2 C0 커밋 명령어 (아직 대웅 실행 전)

```bash
git status

git add "app/admin/(dashboard)/settings/page.tsx" "app/privacy/page.tsx"

git commit -m "C0: add legal notice admin group and privacy public page"

git push origin main
```

**주의**: 파일 경로에 `(dashboard)` 괄호가 있어 큰따옴표 필수. zsh 파싱 에러 방지.

---

## 🔮 Phase 3 후보 (별도 스프린트)

### CRM Pro 양방향 연동

- CRM Pro 정체 확인 필요 (비즈폼 CRMPRO? 자체 구축?)
- API/Webhook 제공 여부 확인
- 방향 옵션:
  - API 있음 → 우리편 폼 제출 시 자동 푸시
  - Webhook 있음 → CRM Pro 상태 변경 시 역동기화
  - 없으면 → CSV 정기 export/import (cron)

### 그 외

- [ ] 홈페이지 FAQ 섹션 DB 기반 전환 (현재 하드코딩)
- [ ] `/terms` 이용약관 페이지 (Footer 링크 있음, 페이지 없음 → 404)
- [ ] `sitemap.xml` 자동 생성
- [ ] `robots.txt`
- [ ] 상담 신청 대시보드 통계 (일간/주간/월간)
- [ ] Q&A 알림 (이메일/카카오)
- [ ] 사이트 설정값을 실제 공개 페이지에 반영 (Footer phone 등)
- [ ] 이미지 일괄 업로드
- [ ] 상품 순서 드래그앤드롭
- [ ] 네이버 웹마스터 도구 등록
- [ ] Core Web Vitals 측정
- [ ] Supabase 쿼리 N+1 체크
- [ ] 백업 정책 수립

---

## ⚠️ 알려진 이슈

### 1. Cursor vs Cowork git 락 충돌
Cursor의 git worker(Helper Plugin)가 `.git/index.lock` 을 계속 만들어서 외부 commit 실패하는 경우 있음.

증상: `unable to create '.git/index.lock'`
해결: `ps aux | grep -i cursor` → `kill <PID>` → `rm -f .git/index.lock`

예방: 한 시점에 한 도구만 git 작업. 동시 편집 OK, commit은 한 쪽만.

### 2. Next.js 14 Suspense 요구사항
`useSearchParams()` 쓰는 클라이언트 컴포넌트는 반드시 `<Suspense>` 경계 안에 있어야 함. `/consultation/complete` 구현 시 주의 (C2).

### 3. Supabase Storage RLS
`media` 버킷은 public read + auth-only write. 새 버킷 만들 때 RLS 정책 누락하면 업로드 실패.

### 4. Footer 하드코딩 전화번호
`components/layout/Footer.tsx` 에 `1234-5678` 하드코딩. `site_settings.phone` SSR fetch로 바꿔야 함 (Phase 3 후보).

### 5. 샌드박스 vs Mac 파일시스템 동기화
`/sessions/.../mnt/wooripen-web` 와 Mac `~/Claud_Projects/...`가 상황에 따라 동기화 안 되는 경우 있음. 때문에 커밋은 반드시 Mac Cursor 터미널에서.

---

## 📚 참고 자료

- `_HANDOVER.md` — 2026-04-14 작성 핸드오버 (이전 컨텍스트)
- Sprint 기록: GitHub 커밋 히스토리
- 본부 스킬 플러그인: `anarchy-content-team.plugin` (설치됨)
- 사전설정 가이드: `../_PRESETS_v2.md`

---

## 🎬 다른 채팅창에서 이 문서를 이어받을 때

1. 이 문서 전체 + `_HANDOVER.md` 읽기
2. `git log --oneline -10` 으로 최신 상태 확인
3. Vercel 최근 배포 상태 MCP로 확인
4. Supabase `consultations` 테이블 스키마 현재 상태 확인 (C1 진행 여부 체크)
5. 대웅에게 "현재 상태 파악 완료. 사이트 구성 개선 작업 어디부터 갈까?" 짧게 보고

### 사이트 구성 개선 작업 시 우선 점검할 것

1. **홈페이지 히어로** — 현재 토스.tech 스타일, CTA 배치 + 티커 삽입 공간 확보
2. **공개 페이지 레이아웃 일관성** — internet/business/rental/recommend 각 페이지 스타일 편차 점검
3. **상담 폼 UX** — 7개 폼의 필드 구조 통일 (C3~C4 기획 참고)
4. **디자인 토큰** — Tailwind config, primary color, typography scale 일관성
5. **반응형** — mobile-first 점검 (break-keep, 폰트 크기)

---

**문서 끝. 질문 있으면 대웅에게 바로 확인할 것.**

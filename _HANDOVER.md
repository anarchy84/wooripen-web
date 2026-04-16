# 우리편 (Wooripen) 개발 — 프로젝트 핸드오버

**작성일**: 2026-04-14
**목적**: AnarchyContentTeam 프로젝트에서 우리편 전용 프로젝트로 개발 이전
**다음 세션 첫 행동**: 이 문서 전부 읽고 요약 + 다음 스텝 제안

---

## 프로젝트 정체

중소사업자 대상 통합 솔루션 **리드 제너레이션 사이트**.
취급: 인터넷·결제단말기·CCTV·키오스크/티오더·렌탈.
운영: Anarchy(김대웅) 우리편 CMO로서 직접 개발.

**사용자 여정**: 랜딩 → 제품 탐색 → 맞춤 추천 → 상담 신청 → 영업팀 접촉

---

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **백엔드**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **배포**: Vercel
- **에디터**: TipTap (블로그/꿀팁용 리치 텍스트)
- **아이콘**: Iconify (Solar 컬렉션)
- **이미지 최적화**: sharp
- **코드 작업 도구**: Cursor + Claude Cowork (동시 사용 시 git 락 충돌 주의)

```
deps: @iconify/react, @supabase/ssr, @supabase/supabase-js,
      @tiptap/*, lucide-react, next, react, sharp, tailwind-merge
```

---

## 환경 자격증명 (참고용 — 시크릿 X)

- **Supabase 프로젝트 ID**: `llnzuczikgvbxxujztao`
- **Vercel 프로젝트 ID**: `prj_pdrd6xEaTq3ajr9PQvd2hBnhVhfe`
- **Vercel 팀 ID**: `team_RLvSNvCKFPar1hqGQ6GF1e9I`
- **GitHub 레포**: `anarchy84/wooripen-web`
- **브랜치**: `main` (직접 push 자제, PR 권장)
- **Admin 계정**: `admin@ourteam.kr` (UUID: `b8420fbc-f9d3-485d-9e26-a98e79b1a0bf`)

실제 환경 변수·비밀번호는 `.env.local` 참고 (레포에 커밋 안 됨).

---

## 작업 폴더 구조

```
wooripen-web/
├── app/
│   ├── (public routes)
│   │   ├── page.tsx              ← 홈 (토스/네이버페이 스타일)
│   │   ├── about/                ← 회사소개
│   │   ├── internet/             ← 인터넷 상품
│   │   ├── business/             ← 단말기/CCTV/키오스크
│   │   ├── rental/               ← 렌탈 통합
│   │   ├── recommend/            ← 맞춤 추천
│   │   ├── tips/                 ← 꿀팁 (블로그)
│   │   └── qna/                  ← Q&A 공개 게시판
│   ├── admin/
│   │   ├── login/                ← 어드민 로그인
│   │   └── (dashboard)/
│   │       ├── products/         ← 상품 관리
│   │       ├── tips/             ← 꿀팁 관리
│   │       ├── faqs/             ← FAQ 관리
│   │       ├── qna/              ← Q&A 관리
│   │       ├── consultations/    ← 상담 신청 관리
│   │       ├── media/            ← 미디어(이미지) 관리
│   │       ├── seo/              ← SEO 메타 관리
│   │       ├── scripts/          ← 스크립트 관리 (GA, Pixel 등)
│   │       └── settings/         ← 사이트 설정
│   └── api/
│       ├── admin/                ← 어드민 전용 API (auth 필요)
│       └── qna/                  ← 공개 Q&A API
├── components/
│   └── layout/                   ← Header, Footer
├── lib/
│   └── supabase/                 ← client.ts, server.ts
├── types/
│   └── database.ts               ← DB 타입 정의
└── public/                       ← 정적 자산
```

---

## 완료된 기능 (커밋 순서)

### 초기 구축
- `8ec7840` Sprint 1 — Next.js 초기화 + 레이아웃 + 홈페이지
- `fdc007a` toss.tech 스타일 리디자인
- `f07f34e` Supanova 디자인 스킬 적용 + Gemini 영상 히어로
- `9286cd6` 3팀 합의 기반 홈 전면 개편

### 공개 페이지
- `a698e8e` internet/recommend/tips/about/CCTV/torder 페이지 추가
- `724a225` 렌탈 통합 페이지
- `0dfd0a1` 결제단말기 쇼케이스 이미지 + 애니메이션

### 어드민 Sprint 1 (`3c20147`)
- Supabase Auth 인증
- 어드민 레이아웃
- 상품 CRUD

### 어드민 Sprint 2 (`c11a341`)
- 꿀팁 에디터 (TipTap 리치 텍스트)
- 미디어 관리 (Supabase Storage `media` 버킷)
- SEO 메타태그 관리
- 스크립트 관리
- 상담 신청 관리

### 어드민 Sprint 3 (`b6308cd` — **가장 최근**)
- **FAQ 관리**: 카테고리 탭(전체/일반/인터넷/단말기/CCTV/키오스크/렌탈), 정렬, 활성화 토글
- **Q&A 게시판**: 공개/비공개, 비공개는 비밀번호로 열람, 조회수
- **사이트 설정**: 회사정보/연락처/위치/기타 4개 그룹 (14 필드)
- RLS 정책 수정 (USING + WITH CHECK 둘 다)

---

## DB 스키마 (주요 테이블)

- `products` — 상품 카탈로그
- `tips` — 꿀팁 블로그 포스트
- `faqs` — 자주 묻는 질문 (category, sort_order, is_active)
- `qna` — Q&A 게시판 (is_public, password, status, view_count)
- `consultations` — 상담 신청
- `media` — 업로드된 이미지 메타
- `seo_meta` — 페이지별 SEO 태그
- `scripts` — 삽입 스크립트 (GA, Pixel 등)
- `site_settings` — key-value 사이트 설정

**RLS 원칙**: `USING` + `WITH CHECK` 둘 다 명시 (INSERT/UPDATE 둘 다 걸리게).

---

## 알려진 이슈 / 주의사항

### 1. Cursor vs Cowork git 락 충돌
Cursor의 git worker(Helper Plugin)가 `.git/index.lock` 을 계속 만들어서 Cowork에서 commit 실패하는 경우 있음.

**증상**: `unable to create '.git/index.lock'` 에러
**해결**:
```bash
ps aux | grep -i cursor | grep "git\|Helper"
kill <PID>
rm -f .git/index.lock
```

**예방**: 한 시점에 한 도구만 git 작업. 동시 편집 OK, commit은 한 쪽만.

### 2. Next.js 14 Suspense 요구사항
`useSearchParams()` 쓰는 클라이언트 컴포넌트는 반드시 `<Suspense>` 경계 안에 있어야 함 (정적 생성 시 필수).
→ admin/login 페이지에서 한 번 빌드 에러 발생 → LoginForm을 Suspense로 감싸서 해결 (`f5321b1`).

### 3. Supabase Storage RLS
`media` 버킷은 **public read + auth-only write** 정책. 새 버킷 만들 때 RLS 정책 누락하면 업로드 실패.

### 4. 이미지 최적화
`next.config.js`에서 Supabase Storage 도메인을 `images.remotePatterns`에 추가해야 `next/image` 작동.

---

## 현재 상태 (2026-04-14 시점)

- ✅ Sprint 1·2·3 완료, `main` 브랜치에 머지됨
- ✅ Vercel 배포 정상
- ✅ Admin 로그인 · 모든 CRUD 동작 확인
- ⚠️ 커밋 `b6308cd` 배포 결과 **Vercel 빌드 성공 여부 최종 확인 필요** (새 프로젝트 첫 작업으로 점검)

---

## 다음 스텝 후보 (우선순위 없이 나열)

### 공개 페이지 고도화
- [ ] 홈페이지 FAQ 섹션을 DB 기반으로 전환 (현재 하드코딩)
- [ ] `/privacy` (개인정보처리방침) 페이지
- [ ] `/terms` (이용약관) 페이지
- [ ] `sitemap.xml` 자동 생성
- [ ] `robots.txt`
- [ ] 블로그(tips) 상세 페이지 SEO 최적화

### 어드민 고도화
- [ ] 상담 신청 대시보드 통계 (일간/주간/월간)
- [ ] Q&A 알림 (이메일/카카오)
- [ ] 사이트 설정값을 실제 공개 페이지에 반영 (현재 저장만 됨)
- [ ] 이미지 일괄 업로드
- [ ] 상품 순서 드래그앤드롭

### 마케팅 연동
- [ ] GA4 이벤트 세팅 (상담 신청 폼 제출 등)
- [ ] Meta Pixel 연동
- [ ] 네이버 웹마스터 도구 등록

### 성능/인프라
- [ ] Core Web Vitals 측정
- [ ] 이미지 lazy loading 점검
- [ ] Supabase 쿼리 최적화 (N+1 체크)
- [ ] 백업 정책 수립

---

## 작업 원칙 (반드시 준수)

1. **계획 → 대웅 OK → 진행**. 다단계 작업은 절대 예외 없음.
2. **자동 배포 금지**. Vercel 배포 전 빌드 성공 확인.
3. **프로덕션 DB 변경 시** 반드시 확인 받기.
4. **RLS 정책** USING + WITH CHECK 둘 다 명시.
5. **Cursor와 동시 작업** 시 git 락 주의.
6. **한국어 주석** 필수. 영어 기술 용어 나열 금지.

---

## 권장 작업 플로우 (신규 기능)

1. 대웅이 요청 → 요구사항 명확화
2. `product-management:write-spec` 스킬로 PRD 초안
3. `engineering:system-design` 스킬로 DB·API 설계
4. 대웅 OK → 구현
5. 로컬 테스트 → `engineering:code-review` 자체 검토
6. 커밋 (Cursor 락 주의)
7. `engineering:deploy-checklist` → Vercel 빌드 성공 확인
8. 대웅에게 배포 결과 보고

---

## 참고 자료

- 이전 채팅 컨텍스트: AnarchyContentTeam 프로젝트의 2026-04-14 이전 대화
- Sprint 기록: GitHub 커밋 히스토리 (`git log --oneline`)
- 사전설정 가이드: `../_PRESETS_v2.md`
- 본부 스킬 플러그인: `anarchy-content-team.plugin` (설치됨)

---

**새 프로젝트에서 첫 채팅 열면**:
1. 이 문서 전체 읽기
2. `git log --oneline -5`로 최신 상태 확인
3. Vercel 최근 배포 상태 확인
4. 대웅에게 "현재 상태 파악 완료. 다음 작업 뭐로 갈까?" 짧게 보고

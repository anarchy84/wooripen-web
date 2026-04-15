-- =============================================================
-- Migration: 20260415000006
-- Phase 2-A #6 : 3팀 팀장 교차검수 보강안 (Phase 2-A 완성본)
-- =============================================================
-- 목적 :
--   개발팀·마케팅팀·콘텐츠팀 팀장이 1~5번 마이그레이션을 교차 검수한 결과
--   Phase 2-A 컴포넌트 단계로 넘어가기 전에 보강해야 할 필드를 추가.
--
-- 5개 보강 항목 (팀별 근거는 파일 하단 주석 참조)
--   [콘텐츠팀] packages.detail_sections  — 패키지 상세페이지 블록 자유 편집
--   [콘텐츠팀] packages.price_range_label — 카드에 "월 3만원대~" 가격 힌트
--   [마케팅팀] consultations.utm_content, utm_term — 광고 크리에이티브 추적
--   [마케팅팀] consultations.consent_ip — 개보법 대응 (동의 시 IP 기록)
--   [콘텐츠팀] nav_menus.badge_label, badge_color, icon — GNB 뱃지·아이콘
-- =============================================================

-- -------------------------------------------------------------
-- packages 보강 (콘텐츠팀)
-- -------------------------------------------------------------
-- 패키지 상세페이지는 제품 상세와 달리 "히어로 → 패키지 구성 → 왜 이 조합인가
-- → 사장님 사례 → FAQ → CTA" 형태의 자유로운 블록이 필요.
-- detail_features(고정 스키마)보다 detail_sections(블록 배열)로 유연하게.
ALTER TABLE packages ADD COLUMN IF NOT EXISTS detail_sections jsonb DEFAULT '[]'::jsonb;
COMMENT ON COLUMN packages.detail_sections IS
  '패키지 상세페이지 블록 배열: [{"type":"hero|benefits|faq|testimonial|cta","data":{...}}]';

-- 메인페이지 패키지 카드에 가격 힌트 노출용. 정확한 단가가 아니라 "월 3만원대~"
-- 같은 범위 문구로 문턱을 낮춤. 상품별 실제 단가 관리는 3차에서.
ALTER TABLE packages ADD COLUMN IF NOT EXISTS price_range_label text;
COMMENT ON COLUMN packages.price_range_label IS '메인카드 가격 힌트: "월 3만원대부터"';

-- -------------------------------------------------------------
-- consultations 보강 (마케팅팀)
-- -------------------------------------------------------------
-- utm_source/medium/campaign은 기존에 있음. 크리에이티브·키워드 레벨 추적을
-- 위해 content/term 추가. 2차부터 수집해야 3차 분석이 가능.
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS utm_content text;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS utm_term    text;
COMMENT ON COLUMN consultations.utm_content IS '광고 크리에이티브·소재 식별자';
COMMENT ON COLUMN consultations.utm_term    IS '검색 키워드·타겟 식별자';

-- 마케팅 수신 동의 시 IP 저장 (개보법 대응)
-- marketing_agreed, marketing_agreed_at은 5번 마이그레이션에서 추가됨.
-- 감사·분쟁 대응을 위한 IP 주소 컬럼만 여기서 보강.
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS consent_ip inet;
COMMENT ON COLUMN consultations.consent_ip IS '마케팅 동의 시점 접속 IP (개보법 감사용)';

-- -------------------------------------------------------------
-- nav_menus 보강 (콘텐츠팀)
-- -------------------------------------------------------------
-- GNB 마케팅 활용도 ↑ : "NEW" "HOT" "이벤트" 뱃지, 아이콘 지원.
-- 어드민에서 드롭다운으로 뱃지 색상만 바꿔도 시선 끌기 가능.
ALTER TABLE nav_menus ADD COLUMN IF NOT EXISTS icon         text;
ALTER TABLE nav_menus ADD COLUMN IF NOT EXISTS badge_label  text;
ALTER TABLE nav_menus ADD COLUMN IF NOT EXISTS badge_color  text;  -- 'red'|'blue'|'green' 등 토큰
COMMENT ON COLUMN nav_menus.icon        IS 'GNB 메뉴 아이콘 (이모지 또는 아이콘 키)';
COMMENT ON COLUMN nav_menus.badge_label IS '메뉴 옆 뱃지 문구: "NEW", "HOT", "이벤트"';
COMMENT ON COLUMN nav_menus.badge_color IS '뱃지 컬러 토큰: red|blue|green|primary|accent';

-- -------------------------------------------------------------
-- 인덱스 보강 (마케팅팀 — 어트리뷰션 쿼리 가속)
-- -------------------------------------------------------------
-- utm_campaign별 리드 집계가 가장 빈번. 단독 인덱스 추가.
CREATE INDEX IF NOT EXISTS idx_consultations_utm_campaign
  ON consultations(utm_campaign) WHERE utm_campaign IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_consultations_gclid
  ON consultations(gclid) WHERE gclid IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_consultations_marketing_agreed
  ON consultations(marketing_agreed) WHERE marketing_agreed = true;

-- =============================================================
-- 3팀 팀장 교차검수 근거 (의사록 요약)
-- =============================================================
-- [개발팀장]
--   - packages.detail_sections 없으면 Phase 2-A 컴포넌트 단계에서
--     패키지 상세페이지 렌더러 설계가 막힘. jsonb로 유연 스키마 확보.
--   - utm_campaign, gclid, marketing_agreed 단독 인덱스 추가.
--     파셜 인덱스(WHERE NOT NULL)로 저장 공간 최적화.
--
-- [마케팅팀장]
--   - utm_content/term 없으면 광고 소재별 CVR 분리 불가. 2차부터 수집 필수.
--   - consent_ip는 개보법 감사 + 분쟁 시 증빙 자료. type=inet으로 정규화.
--   - marketing_agreed=true 인덱스로 "수신 동의자만 리마케팅" 쿼리 고속화.
--
-- [콘텐츠팀장]
--   - packages.price_range_label은 메인 카드에 심리적 문턱 낮추는 카피 요소.
--     정확 단가(3차)와는 별개로 "월 X만원대"로 감성 포지셔닝.
--   - nav_menus.badge_label/color는 "신규 패키지 오픈 이벤트" 같은 시즌성
--     캠페인을 코드 배포 없이 GNB에서 돌리기 위함.
--   - nav_menus.icon 컬럼은 이미 site_stats에 쓴 이모지 패턴 재사용.
-- =============================================================

-- =============================================================
-- ROLLBACK
-- =============================================================
-- DROP INDEX IF EXISTS idx_consultations_marketing_agreed;
-- DROP INDEX IF EXISTS idx_consultations_gclid;
-- DROP INDEX IF EXISTS idx_consultations_utm_campaign;
-- ALTER TABLE nav_menus
--   DROP COLUMN IF EXISTS badge_color,
--   DROP COLUMN IF EXISTS badge_label,
--   DROP COLUMN IF EXISTS icon;
-- ALTER TABLE consultations
--   DROP COLUMN IF EXISTS consent_ip,
--   DROP COLUMN IF EXISTS utm_term,
--   DROP COLUMN IF EXISTS utm_content;
-- ALTER TABLE packages
--   DROP COLUMN IF EXISTS price_range_label,
--   DROP COLUMN IF EXISTS detail_sections;

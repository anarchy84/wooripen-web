-- =============================================================
-- 시드 데이터: 패키지 샘플 6개 + FAQ 샘플 15개 + GNB 메뉴 3개
-- 실행 방법: Supabase SQL Editor에서 직접 실행
-- 주의: 기존 데이터와 충돌 시 ON CONFLICT로 안전하게 스킵됨
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1) 패키지 샘플 6개 (기존 2개 UPDATE + 신규 4개 INSERT)
-- ─────────────────────────────────────────────────────────────

-- 기존 startup 패키지 보강
UPDATE packages SET
  target_industry = '음식점',
  hero_title = '처음 창업하시나요? 한 번에 세팅하세요',
  hero_subtitle = '인터넷 + 결제단말기 + CCTV를 묶어 월 비용을 확 줄이세요',
  icon = '🚀',
  hook_copy = '창업 첫 달, 필수 3종 한 번에 끝',
  price_range_label = '월 3만원대부터',
  seo_title = '초기창업자 패키지 - 인터넷·단말기·CCTV 한 번에 | 우리편',
  seo_description = '처음 가게를 여는 사장님을 위한 인터넷, 결제단말기, CCTV 통합 패키지. 각각 따로 계약하는 것보다 저렴합니다.'
WHERE slug = 'startup';

-- 기존 support 패키지 보강
UPDATE packages SET
  target_industry = NULL,
  hero_title = '이미 운영 중이시라면, 비용을 줄여드립니다',
  hero_subtitle = '기존 계약 분석 → 더 좋은 조건으로 교체 안내',
  icon = '💪',
  hook_copy = '기존 계약, 더 좋은 조건으로 바꾸세요',
  price_range_label = '절감액 평균 30%',
  seo_title = '사업자 응원 패키지 - 기존 계약 절감 | 우리편',
  seo_description = '이미 운영 중인 사장님의 인터넷·결제시스템 기존 계약을 분석하고 더 좋은 조건으로 교체해드립니다.'
WHERE slug = 'support';

-- 신규 패키지 4개
INSERT INTO packages (slug, name, target_industry, target_description, hero_title, hero_subtitle, icon, hook_copy, price_range_label, sort_order, seo_title, seo_description)
VALUES
  (
    'cafe',
    '카페 전용 패키지',
    '카페',
    '카페·디저트 매장을 운영하시는 사장님',
    '카페 사장님, 매장 운영의 모든 것',
    '테이블오더 + 고속 인터넷 + CCTV로 스마트 카페 완성',
    '☕',
    '스마트 카페 세팅, 우리편이 한 번에',
    '월 5만원대부터',
    3,
    '카페 전용 패키지 - 테이블오더·인터넷·CCTV | 우리편',
    '카페 매장에 딱 맞는 테이블오더, 고속 인터넷, CCTV 패키지. 매장 운영을 한결 편하게.'
  ),
  (
    'restaurant',
    '음식점 올인원 패키지',
    '음식점',
    '배달+홀 음식점을 운영하시는 사장님',
    '음식점에 필요한 건 전부 여기에',
    '결제단말기 + 키오스크 + 인터넷 + CCTV, 따로 알아볼 필요 없어요',
    '🍜',
    '음식점 필수템, 한 번에 상담받으세요',
    '월 4만원대부터',
    4,
    '음식점 올인원 패키지 - 키오스크·단말기·인터넷·CCTV | 우리편',
    '배달+홀 음식점에 필요한 키오스크, 결제단말기, 인터넷, CCTV를 한 번에. 비용 절감은 덤.'
  ),
  (
    'beauty',
    '뷰티샵 패키지',
    '미용실',
    '미용실·네일샵·피부관리실 사장님',
    '뷰티샵 운영, 이것만 있으면 됩니다',
    '예약 안내 + 결제 + 보안까지 한 번에 해결',
    '💇',
    '뷰티샵 맞춤 솔루션, 우리편에서',
    '월 3만원대부터',
    5,
    '뷰티샵 패키지 - 결제·인터넷·CCTV | 우리편',
    '미용실·네일샵에 딱 맞는 결제단말기, 고속 인터넷, CCTV 패키지.'
  ),
  (
    'rental-bundle',
    '렌탈 통합 패키지',
    NULL,
    '정수기·공기청정기·얼음정수기가 필요한 사장님',
    '사무실·매장에 필요한 렌탈, 한 번에',
    '정수기 + 공기청정기 + 얼음정수기를 묶으면 렌탈비가 줄어듭니다',
    '💧',
    '렌탈 묶음 할인, 최대 40% 절감',
    '월 2만원대부터',
    6,
    '렌탈 통합 패키지 - 정수기·공기청정기·얼음정수기 | 우리편',
    '사무실과 매장에 필요한 렌탈 제품을 묶어서 할인받으세요. 정수기, 공기청정기, 얼음정수기.'
  )
ON CONFLICT (slug) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 2) FAQ 샘플 15개 (상품 카테고리별)
-- ─────────────────────────────────────────────────────────────

-- faqs 테이블이 없으면 생성 (Phase 2-A 이전 환경 대비)
CREATE TABLE IF NOT EXISTS faqs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question    text NOT NULL,
  answer      text NOT NULL,
  category    text NOT NULL DEFAULT 'general',
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS (이미 있으면 무시)
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'faqs_public_read') THEN
    EXECUTE 'CREATE POLICY faqs_public_read ON faqs FOR SELECT USING (is_active = true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'faqs_admin_all') THEN
    EXECUTE 'CREATE POLICY faqs_admin_all ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  END IF;
END $$;

INSERT INTO faqs (question, answer, category, sort_order, is_active) VALUES
  -- 일반 (general)
  ('우리편은 어떤 서비스인가요?', '우리편은 소상공인 사장님들을 위한 통합 솔루션 서비스입니다. 사업자 인터넷, 결제단말기, CCTV, 키오스크(테이블오더), 렌탈 등을 한곳에서 비교·상담·설치까지 도와드립니다. 따로따로 알아보실 필요 없이, 전문 상담사가 매장 상황에 맞는 최적 조합을 추천해드려요.', 'general', 1, true),
  ('상담 비용이 있나요?', '아니요, 상담은 100% 무료입니다. 전화 상담이든 방문 상담이든 비용이 발생하지 않아요. 부담 없이 문의해주세요.', 'general', 2, true),
  ('전국 어디서나 서비스를 받을 수 있나요?', '네, 전국 어디서든 서비스 이용이 가능합니다. 설치 지역에 따라 일부 상품의 설치 소요 시간이 다를 수 있으며, 상담 시 정확한 일정을 안내해드립니다.', 'general', 3, true),

  -- 인터넷 (internet)
  ('사업자 인터넷과 가정용 인터넷의 차이가 뭔가요?', '사업자 인터넷은 고정 IP 제공, 업/다운 대칭 속도, 높은 SLA(서비스 수준 보장) 등이 특징입니다. 매장에서 POS, CCTV, 키오스크 등 여러 장비를 안정적으로 사용하려면 사업자 전용 회선을 추천드립니다.', 'internet', 10, true),
  ('인터넷 설치까지 얼마나 걸리나요?', '통신사와 지역에 따라 다르지만, 보통 신청 후 3~5영업일 이내에 설치됩니다. 급한 경우 상담 시 말씀해주시면 빠른 설치 일정을 조율해드려요.', 'internet', 11, true),
  ('기존 인터넷 계약 중인데 변경할 수 있나요?', '네, 가능합니다. 기존 계약 잔여 기간과 위약금을 확인한 후, 전환 시 절감되는 비용과 비교해서 최적의 시점을 안내해드립니다. 대부분의 경우 위약금을 감안해도 전환이 유리합니다.', 'internet', 12, true),

  -- 결제단말기 (terminal)
  ('결제단말기 종류가 여러 가지인데, 어떤 걸 선택해야 하나요?', '매장 형태에 따라 추천이 달라집니다. 배달 위주라면 무선 단말기, 테이블 서비스 매장이라면 유선+테이블오더 연동형을 추천드려요. 상담 시 매장 환경을 말씀해주시면 딱 맞는 단말기를 안내해드립니다.', 'terminal', 20, true),
  ('단말기 고장 시 어떻게 하나요?', 'A/S 전담 센터에서 빠르게 대응합니다. 보증 기간 내 무상 수리가 기본이며, 긴급 상황 시 대체 단말기를 보내드립니다. 1600-6116으로 연락 주시면 바로 접수됩니다.', 'terminal', 21, true),

  -- CCTV (cctv)
  ('CCTV 몇 대가 적당한가요?', '매장 크기와 구조에 따라 다릅니다. 일반적으로 10평 미만은 2~3대, 10~30평은 4~6대를 추천드립니다. 사각지대 없이 설치하는 게 핵심이에요. 상담 시 매장 도면이나 사진을 보내주시면 정확한 견적을 드립니다.', 'cctv', 30, true),
  ('CCTV 영상을 스마트폰으로 볼 수 있나요?', '네, 대부분의 CCTV 시스템이 스마트폰 앱으로 실시간 확인을 지원합니다. 외출 중에도 매장 상황을 바로 확인할 수 있어요. 앱 설정까지 설치 기사가 도와드립니다.', 'cctv', 31, true),

  -- 키오스크 (torder)
  ('테이블오더(키오스크)를 도입하면 인건비가 줄어드나요?', '네, 주문 접수 인력을 줄일 수 있어 인건비 절감 효과가 큽니다. 실제로 도입 매장의 평균 인건비가 월 80~120만원 절감되는 것으로 나타났습니다. 주문 오류도 줄어들어 운영 효율이 올라갑니다.', 'torder', 40, true),
  ('테이블오더 설치 시 기존 POS와 연동되나요?', '주요 POS 시스템(키움, 포스뱅크, 오케이포스 등)과 연동을 지원합니다. 상담 시 현재 사용 중인 POS를 알려주시면 연동 가능 여부를 바로 확인해드립니다.', 'torder', 41, true),

  -- 렌탈 (rental)
  ('렌탈 계약 기간은 어떻게 되나요?', '제품에 따라 다르지만 보통 3년(36개월) 또는 5년(60개월)입니다. 계약 기간이 길수록 월 렌탈료가 낮아지며, 중도 해지 시 잔여 기간에 따른 위약금이 있을 수 있습니다.', 'rental', 50, true),
  ('정수기 필터 교체는 어떻게 하나요?', '렌탈 계약에 정기 관리 서비스가 포함되어 있습니다. 보통 2~4개월마다 전문 관리사가 방문하여 필터 교체와 살균 소독을 진행합니다. 별도 비용은 없어요.', 'rental', 51, true);


-- ─────────────────────────────────────────────────────────────
-- 3) GNB 메뉴 3개 추가 (기존 메뉴 뒤에 추가)
--    현재 8개 → 최대 sort_order 다음 번호로
-- ─────────────────────────────────────────────────────────────

-- 현재 최대 sort_order 확인 후 뒤에 추가
INSERT INTO nav_menus (label, url, sort_order, is_visible, is_external)
VALUES
  ('소상공인 패키지', '/packages', 9, true, false),
  ('회사소개',       '/about',    10, true, false),
  ('FAQ',           '/faq',      11, true, false)
ON CONFLICT (label) WHERE parent_id IS NULL DO NOTHING;

-- =============================================================
-- 완료! 확인 쿼리:
-- SELECT slug, name, icon, hook_copy FROM packages WHERE is_visible = true ORDER BY sort_order;
-- SELECT category, question FROM faqs WHERE is_active = true ORDER BY sort_order;
-- SELECT label, url, sort_order FROM nav_menus WHERE parent_id IS NULL AND is_visible = true ORDER BY sort_order;
-- =============================================================

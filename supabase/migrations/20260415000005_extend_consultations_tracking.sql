-- =============================================================
-- Migration: 20260415000005
-- Phase 2-A #5 : consultations 트래킹 필드 확장 (3차 대비 플레이스홀더)
-- =============================================================
-- 목적 : 2차에서는 값을 수집하지 않더라도, 3차 어트리뷰션 로드맵을 위해
--        스키마 여지를 미리 확보. NULL 허용이므로 기존 데이터에 무해.
--
-- 3차 로드맵 (auto-memory: project_wooripen_phase3_roadmap.md 참조)
--   1. 리드 획득 경로(레퍼럴) 추적
--   2. 어트리뷰션용 쿠키 + 디바이스 핑거프린트
--   3. userid 매칭 (비로그인 쿠키 ↔ 로그인 후 userid)
--   4. Google Analytics 4 연계
--   5. 리드 상담신청 결과 추적 (상담 → 계약 → 설치)
--   6. 결제 상품 단가 관리
-- =============================================================

-- 세션/디바이스 트래킹
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS session_id     text;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS client_id      text;  -- GA4 client_id
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS fingerprint_id text;  -- 3차에서 핑거프린트 라이브러리 연동 시
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS device_type    text;  -- 'mobile'|'tablet'|'desktop'

-- 광고 클릭 식별자
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS gclid          text;  -- Google Ads
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS fbclid         text;  -- Meta/Facebook Ads
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS kakao_click_id text;  -- 카카오모먼트
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS naver_click_id text;  -- 네이버 GFA/SA

-- 랜딩·경로
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS landing_page   text;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS exit_page      text;

-- 관심 상품 다중 선택 (폼에서 체크박스)
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS interested_products text[];

-- 마케팅 동의 (카톡/이메일/문자 발송 가능 여부)
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS marketing_agreed boolean DEFAULT false;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS marketing_agreed_at timestamptz;

-- 상담 결과 추적 (3차 확장 대비, 2차엔 수동 입력만)
-- 기존 status : 'pending'|'contacted'|'converted'|'failed' 이미 있음.
-- 여기 확장은 "결과 세부" 로 별도 컬럼
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS result_note     text;  -- "계약 보류 사유" 등
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS contracted_at   timestamptz;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS contract_amount integer;  -- 계약 금액 (원)

-- user_profiles 연결 대비 (카카오/네이버 로그인 후 리드로 전환 시)
-- 2차에선 user_profiles 테이블이 Phase 2-B에 생기므로 FK는 나중에 추가
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS user_profile_id uuid;
-- FK 추가는 Migration #9 (qna_redesign)에서 user_profiles 생성 후 별도 추가

CREATE INDEX IF NOT EXISTS idx_consultations_status      ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at  ON consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_client_id   ON consultations(client_id);

COMMENT ON COLUMN consultations.session_id        IS '브라우저 세션 식별자 (3차 어트리뷰션)';
COMMENT ON COLUMN consultations.client_id         IS 'GA4 client_id (쿠키 _ga 에서 추출)';
COMMENT ON COLUMN consultations.interested_products IS '폼에서 체크한 관심 상품 카테고리 배열';
COMMENT ON COLUMN consultations.user_profile_id   IS 'Phase 2-B 에서 user_profiles FK 연결';

-- =============================================================
-- ROLLBACK
-- =============================================================
-- ALTER TABLE consultations
--   DROP COLUMN IF EXISTS session_id, DROP COLUMN IF EXISTS client_id,
--   DROP COLUMN IF EXISTS fingerprint_id, DROP COLUMN IF EXISTS device_type,
--   DROP COLUMN IF EXISTS gclid, DROP COLUMN IF EXISTS fbclid,
--   DROP COLUMN IF EXISTS kakao_click_id, DROP COLUMN IF EXISTS naver_click_id,
--   DROP COLUMN IF EXISTS landing_page, DROP COLUMN IF EXISTS exit_page,
--   DROP COLUMN IF EXISTS interested_products, DROP COLUMN IF EXISTS marketing_agreed,
--   DROP COLUMN IF EXISTS marketing_agreed_at, DROP COLUMN IF EXISTS result_note,
--   DROP COLUMN IF EXISTS contracted_at, DROP COLUMN IF EXISTS contract_amount,
--   DROP COLUMN IF EXISTS user_profile_id;
-- DROP INDEX IF EXISTS idx_consultations_status;
-- DROP INDEX IF EXISTS idx_consultations_created_at;
-- DROP INDEX IF EXISTS idx_consultations_client_id;

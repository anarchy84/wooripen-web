-- =============================================================
-- Migration: 20260415000003
-- Phase 2-A #3 : 숫자로 보는 우리편 (site_stats)
-- =============================================================
-- 목적 : 메인페이지 ⑦섹션의 "도와드린 사장님 1200+" 같은 숫자 카드를
--        어드민에서 자유 편집 가능하게.
-- =============================================================

CREATE TABLE IF NOT EXISTS site_stats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label       text NOT NULL,        -- "도와드린 사장님"
  value       text NOT NULL,        -- "1,200" (문자열로 하여 "XX+", "XX년" 등 자유)
  suffix      text DEFAULT '',      -- "+", "명" 등
  icon        text,                 -- 이모지 또는 아이콘 경로
  description text,                 -- 호버·툴팁용 부연 설명 (선택)
  is_visible  boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_stats_visible_order
  ON site_stats(is_visible, sort_order);

-- RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_stats_public_read"
  ON site_stats FOR SELECT
  USING (is_visible = true);

CREATE POLICY "site_stats_admin_all"
  ON site_stats FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- updated_at 트리거 (packages 마이그레이션에서 만든 함수 재사용)
DROP TRIGGER IF EXISTS trg_site_stats_updated_at ON site_stats;
CREATE TRIGGER trg_site_stats_updated_at
  BEFORE UPDATE ON site_stats
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE site_stats IS '메인페이지 숫자 카드 — 어드민에서 자유 편집';

-- =============================================================
-- 초기 데이터 (대웅이 어드민에서 값만 바꾸면 됨)
-- =============================================================
INSERT INTO site_stats (label, value, suffix, icon, sort_order) VALUES
  ('도와드린 사장님', '1,200', '+', '👨‍🦱', 1),
  ('함께한 업력',      '5',     '년', '📅',    2),
  ('제휴 통신·파트너사', '20',   '+', '🤝',    3)
ON CONFLICT DO NOTHING;

-- =============================================================
-- ROLLBACK
-- =============================================================
-- DROP TRIGGER IF EXISTS trg_site_stats_updated_at ON site_stats;
-- DROP TABLE IF EXISTS site_stats;

-- =============================================================
-- Migration: 20260415000004
-- Phase 2-A #4 : GNB 동적 관리 (nav_menus)
-- =============================================================
-- 목적 : 현재 Header.tsx에 하드코딩된 GNB를 DB 기반으로 전환.
--        어드민에서 메뉴 CRUD + 드래그 순서 변경 + 표시/숨김 토글 가능.
-- 주의 : 이 마이그레이션 실행 후 Header.tsx 컴포넌트를 nav_menus를
--        읽어오는 방식으로 교체해야 실제 노출에 반영됨.
-- =============================================================

CREATE TABLE IF NOT EXISTS nav_menus (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id    uuid REFERENCES nav_menus(id) ON DELETE CASCADE,  -- 2뎁스
  label        text NOT NULL,
  url          text NOT NULL,
  is_external  boolean NOT NULL DEFAULT false,
  is_visible   boolean NOT NULL DEFAULT true,
  sort_order   integer NOT NULL DEFAULT 0,
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nav_menus_parent_order
  ON nav_menus(parent_id NULLS FIRST, sort_order);

CREATE INDEX IF NOT EXISTS idx_nav_menus_visible
  ON nav_menus(is_visible);

-- 재실행 시 중복 방지용 부분 UNIQUE (parent별 label 유일)
-- NULL은 UNIQUE에서 모두 다른 것으로 취급되므로 루트 메뉴용 별도 인덱스도 추가
CREATE UNIQUE INDEX IF NOT EXISTS uq_nav_menus_child_label
  ON nav_menus(parent_id, label) WHERE parent_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_nav_menus_root_label
  ON nav_menus(label) WHERE parent_id IS NULL;

-- RLS
ALTER TABLE nav_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nav_menus_public_read"
  ON nav_menus FOR SELECT
  USING (is_visible = true);

CREATE POLICY "nav_menus_admin_all"
  ON nav_menus FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS trg_nav_menus_updated_at ON nav_menus;
CREATE TRIGGER trg_nav_menus_updated_at
  BEFORE UPDATE ON nav_menus
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nav_menus IS 'GNB 메뉴 — 어드민에서 드래그로 순서·뎁스 조정';

-- =============================================================
-- 초기 데이터 — Step 2에서 확정한 GNB 구조 그대로 이식
-- =============================================================

-- 대메뉴 7개 먼저 삽입
WITH ins AS (
  INSERT INTO nav_menus (label, url, sort_order) VALUES
    ('사업자 맞춤패키지', '/packages',  1),
    ('결제시스템',        '/payment',   2),
    ('사업자 인터넷',     '/internet',  3),
    ('테이블오더',        '/t-order',   4),
    ('CCTV',             '/cctv',      5),
    ('마케팅지원',        '/marketing', 6),
    ('커뮤니티',          '/community', 7)
  ON CONFLICT (label) WHERE parent_id IS NULL DO NOTHING
  RETURNING id, label
)
-- 하위 메뉴 삽입 (대메뉴 id 참조)
INSERT INTO nav_menus (parent_id, label, url, sort_order)
SELECT ins.id, sub.label, sub.url, sub.sort_order
FROM ins
JOIN LATERAL (
  SELECT * FROM (VALUES
    -- 사업자 맞춤패키지
    ('사업자 맞춤패키지', '초기창업자 패키지', '/packages/startup',        1),
    ('사업자 맞춤패키지', '사업자 응원 패키지', '/packages/support',       2),
    -- 결제시스템
    ('결제시스템',         '토스 결제단말기',    '/payment/toss-terminal',  1),
    ('결제시스템',         '토스 PG',           '/payment/toss-pg',        2),
    -- 사업자 인터넷
    ('사업자 인터넷',      'SK브로드밴드',       '/internet/sk',            1),
    ('사업자 인터넷',      'KT',                '/internet/kt',            2),
    ('사업자 인터넷',      'LG U+',             '/internet/lg',            3),
    ('사업자 인터넷',      '기타 통신사',        '/internet/others',        4),
    -- 커뮤니티
    ('커뮤니티',           '꿀팁',              '/community/tips',         1),
    ('커뮤니티',           'FAQ',              '/community/faq',          2),
    ('커뮤니티',           '회사소개',          '/community/about',        3),
    ('커뮤니티',           'Q&A',              '/community/qna',          4)
  ) AS t(parent_label, label, url, sort_order)
) AS sub ON sub.parent_label = ins.label
ON CONFLICT (parent_id, label) WHERE parent_id IS NOT NULL DO NOTHING;

-- =============================================================
-- ROLLBACK
-- =============================================================
-- DROP TRIGGER IF EXISTS trg_nav_menus_updated_at ON nav_menus;
-- DROP TABLE IF EXISTS nav_menus;

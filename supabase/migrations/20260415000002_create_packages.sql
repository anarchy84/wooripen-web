-- =============================================================
-- Migration: 20260415000002
-- Phase 2-A #2 : 패키지 동적 빌더 (packages + package_items)
-- =============================================================
-- 목적 : 어드민에서 여러 상품을 드래그로 조합해 "초기창업자 패키지" 등
--        번들 상품을 만들고, 메인페이지 ③섹션 및 /packages/* 상세페이지에
--        동적으로 노출.
-- =============================================================

-- 패키지 본체
CREATE TABLE IF NOT EXISTS packages (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 text UNIQUE NOT NULL,
  name                 text NOT NULL,
  target_industry      text,             -- 예: "음식점", "카페", null=전체
  target_description   text,             -- "창업 3개월 이내 사장님"
  hero_title           text,
  hero_subtitle        text,
  hero_image           text,
  icon                 text,             -- 패키지 카드 아이콘 (이모지·파일명)
  hook_copy            text,             -- 메인페이지 카드에 표시될 훅 문구
  is_visible           boolean NOT NULL DEFAULT true,
  sort_order           integer NOT NULL DEFAULT 0,

  -- SEO (기존 page_meta 패턴 재사용)
  seo_title            text,
  seo_description      text,
  og_image_url         text,

  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packages_visible_order
  ON packages(is_visible, sort_order);

-- 패키지 ↔ 상품 조합 (N:M)
CREATE TABLE IF NOT EXISTS package_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id      uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order      integer NOT NULL DEFAULT 0,
  is_highlighted  boolean NOT NULL DEFAULT false,  -- "대표 구성품" 표시
  note            text,                             -- "2년 약정 시 추가 할인"
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(package_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_package_items_package
  ON package_items(package_id, sort_order);

-- RLS — USING + WITH CHECK 둘 다 명시 (프로젝트 원칙)
ALTER TABLE packages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_items  ENABLE ROW LEVEL SECURITY;

-- 공개 조회: is_visible = true 만
CREATE POLICY "packages_public_read"
  ON packages FOR SELECT
  USING (is_visible = true);

CREATE POLICY "package_items_public_read"
  ON package_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM packages p
      WHERE p.id = package_items.package_id AND p.is_visible = true
    )
  );

-- 어드민(authenticated) — 단일 admin 모델
CREATE POLICY "packages_admin_all"
  ON packages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "package_items_admin_all"
  ON package_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_packages_updated_at ON packages;
CREATE TRIGGER trg_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE packages      IS '업종별 맞춤패키지 — 어드민에서 상품 조합하여 만듦';
COMMENT ON TABLE package_items IS '패키지 포함 상품 (다대다). sort_order로 노출 순서 제어';

-- =============================================================
-- 초기 데이터 (2개 패키지 골격만, 내용은 어드민에서 채움)
-- =============================================================
INSERT INTO packages (slug, name, target_description, hook_copy, sort_order)
VALUES
  ('startup',  '초기창업자 패키지', '이제 막 시작하시는 사장님께',          '창업 첫 세팅 한 번에',   1),
  ('support',  '사업자 응원 패키지', '이미 운영 중이신 사장님께',          '사업 성장, 우리편이 함께', 2)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================
-- ROLLBACK
-- =============================================================
-- DROP TRIGGER IF EXISTS trg_packages_updated_at ON packages;
-- DROP TABLE IF EXISTS package_items;
-- DROP TABLE IF EXISTS packages;
-- DROP FUNCTION IF EXISTS set_updated_at();  -- 다른 테이블도 쓰면 유지

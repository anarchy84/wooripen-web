-- =============================================================
-- Migration: 20260415000001
-- Phase 2-A #1 : products 테이블 세부페이지 필드 확장
-- =============================================================
-- 목적 : 세부페이지 Type A(상품 상세) 컴포넌트에서 필요한 데이터를
--        products 테이블 안으로 통합. jsonb로 유연하게.
-- 영향 : 기존 30개 레코드에 NULL/DEFAULT로 채워짐 (무해)
-- =============================================================

-- 히어로 블록
ALTER TABLE products ADD COLUMN IF NOT EXISTS hero_title         text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hero_subtitle      text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hero_image         text;

-- 신뢰 배지 (②) — [{icon, label}] 형태
ALTER TABLE products ADD COLUMN IF NOT EXISTS trust_badges       jsonb DEFAULT '[]'::jsonb;

-- 특장점 카드 (③) — [{icon, title, desc}]
-- 기존 features(text[])는 요금제 특징 리스트용이라 유지, 세부페이지용은 별도 필드
ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_features    jsonb DEFAULT '[]'::jsonb;

-- 비교표 (④) — 인터넷/결제만 사용
ALTER TABLE products ADD COLUMN IF NOT EXISTS comparison_table   jsonb;

-- CTA 라벨 (⑦) — 상품별로 커스터마이징 가능
ALTER TABLE products ADD COLUMN IF NOT EXISTS cta_primary_label   text DEFAULT '상담 신청';
ALTER TABLE products ADD COLUMN IF NOT EXISTS cta_secondary_label text DEFAULT '견적 받기';

-- SEO 필드 (기존 page_meta와 별개로 상품 개별 SEO)
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title       text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS og_image_url    text;

-- 슬러그 — URL 라우팅용 (예: /payment/toss-terminal)
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug text;

-- 슬러그 UNIQUE 제약 (NULL은 허용, 값 있으면 유니크)
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique
  ON products(slug) WHERE slug IS NOT NULL;

-- 카테고리 확장: 기존 'internet'/'terminal'/'cctv'/'torder'/'rental' 외에
-- 'pg' 추가를 위해 category는 text 그대로 사용 (enum 아님, 제약 없음)
-- Sub-category로 세분화: terminal + sub_category='terminal|pg' 방식

COMMENT ON COLUMN products.trust_badges     IS '신뢰 배지: [{"icon":"✓","label":"빠른 설치"}]';
COMMENT ON COLUMN products.detail_features  IS '세부 특장점 카드: [{"icon":"","title":"","desc":""}]';
COMMENT ON COLUMN products.comparison_table IS '비교표 스키마 자유: {"columns":[],"rows":[]}';
COMMENT ON COLUMN products.slug             IS 'URL 슬러그 — 예: toss-terminal, sk';

-- =============================================================
-- ROLLBACK (비상시 되돌리기)
-- =============================================================
-- DROP INDEX IF EXISTS products_slug_unique;
-- ALTER TABLE products
--   DROP COLUMN IF EXISTS hero_title, DROP COLUMN IF EXISTS hero_subtitle,
--   DROP COLUMN IF EXISTS hero_image, DROP COLUMN IF EXISTS trust_badges,
--   DROP COLUMN IF EXISTS detail_features, DROP COLUMN IF EXISTS comparison_table,
--   DROP COLUMN IF EXISTS cta_primary_label, DROP COLUMN IF EXISTS cta_secondary_label,
--   DROP COLUMN IF EXISTS seo_title, DROP COLUMN IF EXISTS seo_description,
--   DROP COLUMN IF EXISTS og_image_url, DROP COLUMN IF EXISTS slug;

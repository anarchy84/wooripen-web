// 우리편 DB 타입 정의

// Phase 2-A 세부페이지용 블록 스키마
export interface TrustBadge {
  icon: string
  label: string
}

export interface DetailFeature {
  icon?: string
  title: string
  desc: string
}

export interface ComparisonTable {
  columns?: string[]
  rows?: Array<Record<string, string>>
}

// 패키지 상세페이지 블록 (자유도 높은 섹션 배열)
export interface PackageSection {
  type: 'hero' | 'benefits' | 'faq' | 'testimonial' | 'cta' | 'richtext'
  data: Record<string, unknown>
}

export interface Product {
  id: string
  name: string
  category: 'internet' | 'terminal' | 'cctv' | 'torder' | 'rental'
  sub_category: string | null
  carrier: 'SKT' | 'KT' | 'LG U+' | null
  price: number | null
  original_price: number | null
  speed: string | null
  gift_description: string | null
  features: string[] | null
  specs: Record<string, unknown> | null
  image_url: string | null
  description: string | null
  promo_badge: string | null
  promo_active: boolean
  is_active: boolean
  sort_order: number
  // Phase 2-A 세부페이지 필드
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  trust_badges: TrustBadge[] | null
  detail_features: DetailFeature[] | null
  comparison_table: ComparisonTable | null
  cta_primary_label: string | null
  cta_secondary_label: string | null
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  slug: string | null
  created_at: string
  updated_at: string
}

// Phase 2-A #2 패키지 (맞춤 상품 조합)
// 실제 DB 스키마와 1:1 매칭 — target_industry, target_description, hero_title, hook_copy, is_visible
export interface Package {
  id: string
  slug: string
  name: string
  target_industry: string | null     // '음식점', '카페', null=전체
  target_description: string | null  // '창업 3개월 이내 사장님'
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  icon: string | null                // 패키지 카드 아이콘
  hook_copy: string | null           // 메인카드 훅 문구
  is_visible: boolean
  sort_order: number
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  // Phase 2-A #6 보강
  detail_sections: PackageSection[] | null
  price_range_label: string | null
  created_at: string
  updated_at: string
}

// 패키지 포함 상품 (product_id NOT NULL — 반드시 products 참조)
export interface PackageItem {
  id: string
  package_id: string
  product_id: string
  sort_order: number
  is_highlighted: boolean             // 대표 구성품 표시
  note: string | null                 // '2년 약정 시 추가 할인'
  created_at: string
  // JOIN 결과 (products 테이블 연동 시)
  product?: Pick<Product, 'id' | 'name' | 'category' | 'image_url' | 'description' | 'slug' | 'price'> | null
}

// Phase 2-A #3 메인페이지 숫자 카드
export interface SiteStat {
  id: string
  label: string
  value: string
  suffix: string
  icon: string | null
  description: string | null
  is_visible: boolean
  sort_order: number
  updated_at: string
}

// Phase 2-A #4 GNB
export interface NavMenu {
  id: string
  parent_id: string | null
  label: string
  url: string
  is_external: boolean
  is_visible: boolean
  sort_order: number
  // Phase 2-A #6 보강
  icon: string | null
  badge_label: string | null
  badge_color: string | null
  updated_at: string
  // 트리 구조용 (API 응답)
  children?: NavMenu[]
}

export interface Consultation {
  id: string
  name: string
  phone: string
  product_category: string
  product_id: string | null
  business_type: string | null
  business_address: string | null
  current_carrier: string | null
  memo: string | null
  status: 'pending' | 'contacted' | 'converted' | 'failed'
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer_url: string | null
  created_at: string
  updated_at: string
}

export interface Tip {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string
  tags: string[] | null
  seo_title: string | null
  seo_description: string | null
  featured_image_url: string | null
  is_published: boolean
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PageMeta {
  id: string
  page_slug: string
  page_name: string
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  structured_data: Record<string, unknown> | null
  updated_at: string
}

export interface Script {
  id: string
  name: string
  code: string
  position: 'head' | 'body_start' | 'body_end'
  scope: 'global' | 'page'
  target_pages: string[] | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  file_name: string
  storage_path: string
  webp_path: string | null
  mime_type: string | null
  file_size: number | null
  width: number | null
  height: number | null
  alt_text: string | null
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string | null
  updated_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface QnA {
  id: string
  title: string
  content: string
  author_name: string
  author_phone: string | null
  password: string
  is_public: boolean
  status: 'pending' | 'answered'
  answer: string | null
  answered_at: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export const FAQ_CATEGORIES: Record<string, string> = {
  general: '일반',
  internet: '인터넷',
  terminal: '결제단말기',
  cctv: 'CCTV',
  torder: '키오스크',
  rental: '렌탈',
}

// 상담 신청 폼 입력 타입
export interface ConsultationFormData {
  name: string
  phone: string
  product_category: string
  product_id?: string
  business_type?: string
  business_address?: string
  current_carrier?: string
  memo?: string
}

// 카테고리 라벨 매핑
export const CATEGORY_LABELS: Record<Product['category'], string> = {
  internet: '인터넷',
  terminal: '결제단말기',
  cctv: 'CCTV',
  torder: '키오스크',
  rental: '렌탈',
}

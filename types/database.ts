// 우리편 DB 타입 정의

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
  created_at: string
  updated_at: string
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

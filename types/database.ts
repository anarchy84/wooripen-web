// 우리편 DB 타입 정의

export interface Product {
  id: string
  name: string
  category: 'internet_b2c' | 'internet_b2b' | 'terminal' | 'cctv' | 'torder' | 'rental'
  carrier: 'SKT' | 'KT' | 'LG' | null
  price: number | null
  original_price: number | null
  speed: string | null
  gift_description: string | null
  features: string[] | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Consultation {
  id: string
  name: string
  phone: string
  product_category: 'internet_b2c' | 'terminal' | 'internet_b2b' | 'cctv' | 'torder' | 'bundle'
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
  category: 'comparison' | 'saving' | 'guide' | 'case_study' | 'faq'
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

// 상담 신청 폼 입력 타입
export interface ConsultationFormData {
  name: string
  phone: string
  product_category: Consultation['product_category']
  product_id?: string
  business_type?: string
  business_address?: string
  current_carrier?: string
  memo?: string
}

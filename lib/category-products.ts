// ─────────────────────────────────────────────
// 카테고리별 활성 products fetch — 카테고리 페이지 자동 카탈로그용
//
// 사용처 :
//   /internet, /business/{cctv,terminal,torder}, /rental
//   각 페이지의 server wrapper 에서 호출 → ProductGrid 컴포넌트로 렌더
//
// RLS : 'Public read active products' 정책으로 anon 읽기 허용
// ─────────────────────────────────────────────
import { createClient as createSupabase } from '@supabase/supabase-js'

export interface CategoryProduct {
  id: string
  slug: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  hero_image: string | null
}

function anonClient() {
  return createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

/**
 * 카테고리 ID 로 활성 products 조회.
 *   internet / cctv / terminal / torder / rental
 * slug 가 비어있는 row 는 자동 제외 (상세 페이지 노출 불가하므로).
 */
export async function getProductsByCategory(category: string): Promise<CategoryProduct[]> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, price, image_url, hero_image')
    .eq('category', category)
    .eq('is_active', true)
    .not('slug', 'is', null)
    .neq('slug', '')
    .order('price', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  if (error || !data) {
    console.error('[category-products] fetch failed:', category, error)
    return []
  }
  return data as CategoryProduct[]
}

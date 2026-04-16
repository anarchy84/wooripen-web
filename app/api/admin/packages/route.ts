import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 패키지 목록 조회 (items 포함)
// 실제 스키마: packages.is_visible, package_items(product_id, sort_order, is_highlighted, note)
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_items (
        id, product_id, sort_order, is_highlighted, note,
        product:products ( id, name, category, image_url )
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // items도 정렬 순서로
  const sorted = (data || []).map((pkg) => ({
    ...pkg,
    package_items: (pkg.package_items || []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
    ),
  }))

  return NextResponse.json(sorted)
}

// 새 패키지 등록
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // slug, name 필수
  if (!body.slug || !body.name) {
    return NextResponse.json({ error: 'slug, name 필수' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('packages')
    .insert({
      slug: body.slug,
      name: body.name,
      target_industry: body.target_industry || null,
      target_description: body.target_description || null,
      hero_title: body.hero_title || null,
      hero_subtitle: body.hero_subtitle || null,
      hero_image: body.hero_image || null,
      icon: body.icon || null,
      hook_copy: body.hook_copy || null,
      is_visible: body.is_visible ?? true,
      sort_order: body.sort_order ?? 0,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      og_image_url: body.og_image_url || null,
      detail_sections: body.detail_sections || [],
      price_range_label: body.price_range_label || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

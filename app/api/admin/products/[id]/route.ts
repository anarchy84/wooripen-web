import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth-admin'

// GET: 단일 상품 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT: 상품 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('products')
    .update({
      name: body.name,
      category: body.category,
      sub_category: body.sub_category || null,
      carrier: body.carrier || null,
      price: body.price ?? null,
      original_price: body.original_price ?? null,
      speed: body.speed || null,
      gift_description: body.gift_description || null,
      features: body.features || [],
      specs: body.specs || {},
      image_url: body.image_url || null,
      description: body.description || null,
      promo_badge: body.promo_badge || null,
      promo_active: body.promo_active ?? false,
      is_active: body.is_active ?? true,
      sort_order: body.sort_order ?? 0,
      // Phase 2-A 확장 필드
      slug: body.slug || null,
      hero_title: body.hero_title || null,
      hero_subtitle: body.hero_subtitle || null,
      hero_image: body.hero_image || null,
      trust_badges: body.trust_badges || null,
      detail_features: body.detail_features || null,
      comparison_table: body.comparison_table || null,
      cta_primary_label: body.cta_primary_label || null,
      cta_secondary_label: body.cta_secondary_label || null,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      og_image_url: body.og_image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE: 상품 삭제 (soft delete — is_active를 false로)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('products')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

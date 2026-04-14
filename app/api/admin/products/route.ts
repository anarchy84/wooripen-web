import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: 상품 목록 조회 (카테고리 필터 지원)
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let query = supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST: 새 상품 등록
export async function POST(request: NextRequest) {
  const supabase = createClient()

  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('products')
    .insert({
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
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

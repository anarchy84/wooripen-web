import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 단일 패키지 + 구성 아이템 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
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
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  // items 정렬
  if (data.package_items) {
    data.package_items = data.package_items.sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
    )
  }

  return NextResponse.json(data)
}

// 패키지 수정 (items도 함께 delete+insert 전략으로 동기화)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // 1) 패키지 본체 업데이트 — 실제 스키마 컬럼 사용
  const { data: pkg, error: pkgErr } = await supabase
    .from('packages')
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (pkgErr) {
    return NextResponse.json({ error: pkgErr.message }, { status: 500 })
  }

  // 2) package_items 동기화 (body.items 가 있을 때만)
  //    전략: 기존 전부 삭제 → 새로 insert (간단하고 안전)
  //    스키마: product_id(NOT NULL), sort_order, is_highlighted, note
  if (Array.isArray(body.items)) {
    const { error: delErr } = await supabase
      .from('package_items')
      .delete()
      .eq('package_id', params.id)

    if (delErr) {
      return NextResponse.json(
        { error: `items 삭제 실패: ${delErr.message}` },
        { status: 500 },
      )
    }

    if (body.items.length > 0) {
      // product_id 없는 행은 무시 (NOT NULL 제약)
      const rows = body.items
        .filter((it: { product_id?: string | null }) => !!it.product_id)
        .map((it: {
          product_id: string
          is_highlighted?: boolean
          note?: string | null
          sort_order?: number
        }, idx: number) => ({
          package_id: params.id,
          product_id: it.product_id,
          is_highlighted: it.is_highlighted ?? false,
          note: it.note || null,
          sort_order: it.sort_order ?? idx,
        }))

      if (rows.length > 0) {
        const { error: insErr } = await supabase
          .from('package_items')
          .insert(rows)

        if (insErr) {
          return NextResponse.json(
            { error: `items 추가 실패: ${insErr.message}` },
            { status: 500 },
          )
        }
      }
    }
  }

  return NextResponse.json(pkg)
}

// 패키지 삭제 — soft delete (is_visible=false). items는 유지.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('packages')
    .update({ is_visible: false, updated_at: new Date().toISOString() })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

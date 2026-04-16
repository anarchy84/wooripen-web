import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 메뉴 수정
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

  const { data, error } = await supabase
    .from('nav_menus')
    .update({
      parent_id: body.parent_id || null,
      label: body.label,
      url: body.url,
      is_external: body.is_external ?? false,
      is_visible: body.is_visible ?? true,
      sort_order: body.sort_order ?? 0,
      icon: body.icon || null,
      badge_label: body.badge_label || null,
      badge_color: body.badge_color || null,
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 메뉴 삭제 — 하위 메뉴도 CASCADE로 함께 삭제됨 (스키마 ON DELETE CASCADE)
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
    .from('nav_menus')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

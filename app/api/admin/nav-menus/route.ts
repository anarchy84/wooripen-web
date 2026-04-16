import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { NavMenu } from '@/types/database'

// GNB 메뉴 목록 — 트리 구조로 반환 (어드민은 숨김 포함)
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('nav_menus')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 평탄 배열 → 트리 구조로 변환 (루트 아래 children)
  const all = (data || []) as NavMenu[]
  const roots = all.filter((m) => !m.parent_id)
  const tree = roots.map((root) => ({
    ...root,
    children: all
      .filter((m) => m.parent_id === root.id)
      .sort((a, b) => a.sort_order - b.sort_order),
  }))

  return NextResponse.json(tree)
}

// 새 메뉴 추가 (parent_id가 있으면 하위 메뉴)
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (!body.label || !body.url) {
    return NextResponse.json({ error: 'label, url 필수' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('nav_menus')
    .insert({
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
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

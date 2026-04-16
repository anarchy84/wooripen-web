import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 숫자 카드 목록 (어드민은 숨김 포함 전체)
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('site_stats')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 새 숫자 카드 추가
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (!body.label || !body.value) {
    return NextResponse.json({ error: 'label, value 필수' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('site_stats')
    .insert({
      label: body.label,
      value: body.value,
      suffix: body.suffix || '',
      icon: body.icon || null,
      description: body.description || null,
      is_visible: body.is_visible ?? true,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

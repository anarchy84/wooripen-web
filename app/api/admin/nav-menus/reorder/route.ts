import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 드래그앤드롭 순서 일괄 업데이트
// body: { items: [{ id, sort_order }, ...] }
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const items = body.items as Array<{ id: string; sort_order: number }>

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'items 배열 필요' }, { status: 400 })
  }

  // 순차 업데이트 (트랜잭션 보장 필요 시 RPC로 전환)
  for (const it of items) {
    const { error } = await supabase
      .from('nav_menus')
      .update({ sort_order: it.sort_order })
      .eq('id', it.id)

    if (error) {
      return NextResponse.json(
        { error: `id=${it.id} 업데이트 실패: ${error.message}` },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ success: true })
}

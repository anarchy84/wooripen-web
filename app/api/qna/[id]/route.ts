import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 개별 Q&A 조회 (비공개 글은 비밀번호 확인)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const body = await request.json()

  // 먼저 글 조회
  const { data: item, error } = await supabase
    .from('qna')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !item) {
    return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 비공개 글이면 비밀번호 확인
  if (!item.is_public) {
    if (!body.password || body.password !== item.password) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.', needPassword: true }, { status: 403 })
    }
  }

  // 조회수 증가
  await supabase
    .from('qna')
    .update({ view_count: (item.view_count || 0) + 1 })
    .eq('id', params.id)

  // 비밀번호 제거 후 반환
  const { password: _, ...safeItem } = item
  return NextResponse.json(safeItem)
}

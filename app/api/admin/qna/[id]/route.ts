import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 답변 작성/수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.answer !== undefined) {
    updateData.answer = body.answer
    updateData.status = 'answered'
    updateData.answered_at = new Date().toISOString()
  }
  if (body.is_public !== undefined) updateData.is_public = body.is_public
  if (body.status !== undefined) updateData.status = body.status

  const { data, error } = await supabase
    .from('qna')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('qna').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

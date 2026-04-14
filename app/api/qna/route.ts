import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 공개 Q&A 목록 조회 (공개 글만)
export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('qna')
    .select('id, title, author_name, is_public, status, answer, answered_at, view_count, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// 질문 작성 (비로그인 가능)
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const body = await request.json()

  if (!body.title || !body.content || !body.author_name || !body.password) {
    return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('qna')
    .insert({
      title: body.title,
      content: body.content,
      author_name: body.author_name,
      author_phone: body.author_phone || null,
      password: body.password,
      is_public: body.is_public ?? true,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 공개(비인증) FAQ 조회 — is_active=true만 반환
// /faq 페이지에서 사용. 카테고리별로 그룹핑은 프론트에서 처리.
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('faqs')
    .select('id, question, answer, category, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [], {
    headers: {
      'Cache-Control': 's-maxage=120, stale-while-revalidate=60',
    },
  })
}

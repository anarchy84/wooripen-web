import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET: 페이지별 메타태그 목록
export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('page_meta')
    .select('*')
    .order('page_slug')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { SCRIPTS_CACHE_TAG } from '@/lib/scripts-server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase.from('scripts').select('*').order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('scripts')
    .insert({
      name: body.name,
      code: body.code,
      position: body.position || 'head',
      scope: body.scope || 'global',
      target_pages: body.target_pages || null,
      is_active: body.is_active ?? false,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // 공개 페이지 주입 캐시 즉시 무효화 (lib/scripts-server.ts)
  revalidateTag(SCRIPTS_CACHE_TAG)
  return NextResponse.json(data, { status: 201 })
}

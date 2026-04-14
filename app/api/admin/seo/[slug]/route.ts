import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PUT: 페이지 메타태그 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const { data, error } = await supabase
    .from('page_meta')
    .update({
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      og_image_url: body.og_image_url || null,
      canonical_url: body.canonical_url || null,
      structured_data: body.structured_data || null,
      updated_at: new Date().toISOString(),
    })
    .eq('page_slug', params.slug)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

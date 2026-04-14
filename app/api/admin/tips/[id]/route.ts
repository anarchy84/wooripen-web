import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: 단일 글 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PUT: 글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // 처음 발행 시 published_at 설정
  let published_at = body.published_at
  if (body.is_published && !published_at) {
    const { data: existing } = await supabase
      .from('tips')
      .select('published_at')
      .eq('id', params.id)
      .single()
    published_at = existing?.published_at || new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('tips')
    .update({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || null,
      category: body.category,
      tags: body.tags || [],
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      featured_image_url: body.featured_image_url || null,
      is_published: body.is_published ?? false,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE: 글 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('tips').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

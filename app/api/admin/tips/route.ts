import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: 꿀팁 목록
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // 'published' | 'draft' | 'all'

  let query = supabase
    .from('tips')
    .select('id, title, slug, excerpt, category, is_published, view_count, published_at, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (status === 'published') query = query.eq('is_published', true)
  else if (status === 'draft') query = query.eq('is_published', false)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: 새 글 작성
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // slug 자동 생성 (없으면)
  const slug = body.slug || body.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)

  const { data, error } = await supabase
    .from('tips')
    .insert({
      title: body.title,
      slug,
      content: body.content || '',
      excerpt: body.excerpt || null,
      category: body.category || '가이드',
      tags: body.tags || [],
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      featured_image_url: body.featured_image_url || null,
      is_published: body.is_published ?? false,
      published_at: body.is_published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

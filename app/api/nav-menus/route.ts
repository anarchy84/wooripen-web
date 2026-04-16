import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NavMenu } from '@/types/database'

// 공개(비인증) GNB 조회 — is_visible=true만 반환
// Header 컴포넌트가 사용. 트리 구조로 반환 (루트 + children).
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('nav_menus')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const all = (data || []) as NavMenu[]
  const roots = all.filter((m) => !m.parent_id)
  const tree = roots.map((root) => ({
    ...root,
    children: all
      .filter((m) => m.parent_id === root.id)
      .sort((a, b) => a.sort_order - b.sort_order),
  }))

  // 캐시: 60초 CDN, 30초 stale — 메뉴는 자주 안 바뀌니 적극 캐싱
  return NextResponse.json(tree, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
    },
  })
}

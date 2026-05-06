// ─────────────────────────────────────────────
// /api/web-vitals — Core Web Vitals 수집 API
//
// Edge runtime — 글로벌 분산 + 빠른 응답 (측정값 INSERT 만)
// 익명 측정 — 사용자 식별 정보 X (page_path, metric, value 등 익명 데이터만)
// ─────────────────────────────────────────────
import { createClient as createSupabase } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Body {
  metric?: string
  value?: number
  rating?: string
  page_path?: string
  navigation_type?: string
}

export async function POST(req: NextRequest) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  // 입력 검증 — 알려진 metric 만 허용 (악의적 INSERT 방지)
  const allowed = new Set(['LCP', 'CLS', 'INP', 'FCP', 'TTFB'])
  if (!body.metric || !allowed.has(body.metric)) {
    return NextResponse.json({ error: 'invalid metric' }, { status: 400 })
  }
  if (typeof body.value !== 'number' || !Number.isFinite(body.value)) {
    return NextResponse.json({ error: 'invalid value' }, { status: 400 })
  }
  if (!body.page_path || typeof body.page_path !== 'string' || body.page_path.length > 500) {
    return NextResponse.json({ error: 'invalid page_path' }, { status: 400 })
  }

  // anon 클라이언트 — RLS 의 web_vitals_anon_insert 정책으로 통과
  const supabase = createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const ua = req.headers.get('user-agent')?.slice(0, 500) ?? null

  const { error } = await supabase.from('web_vitals').insert({
    metric: body.metric,
    value: body.value,
    rating: body.rating ?? null,
    page_path: body.page_path.slice(0, 500),
    navigation_type: body.navigation_type ?? null,
    user_agent: ua,
  })

  if (error) {
    console.error('[web-vitals insert]', error)
    return NextResponse.json({ error: 'insert failed' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}

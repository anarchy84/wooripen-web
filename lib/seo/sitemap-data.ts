// ─────────────────────────────────────────────
// SEO sitemap 데이터 — Supabase 에서 공개 가능한 슬러그 모음
//
// 목적 :
//   /sitemap.xml 생성 시 검색엔진에 알려야 할 동적 페이지 목록.
//   (정적 페이지 목록은 app/sitemap.ts 에서 직접 정의)
//
// 호출 시점 : 서버 컴포넌트(app/sitemap.ts)에서만.
//   - service_role 안 씀. anon key + RLS 의존.
//   - 발행 안 된(is_published=false) 글은 자동 제외 (RLS 또는 필터).
// ─────────────────────────────────────────────
// sitemap·robots 같은 라우트 핸들러에서는 cookies() 가 있는 SSR client 가 아니라
// 순수 anon 클라이언트가 더 안정적이다 (캐시·dynamic 컨텍스트 노이즈 없음).
import { createClient as createSupabase } from '@supabase/supabase-js'

export interface SitemapEntry {
  /** /tips/{slug} 같은 라우트 경로 (slash 시작) */
  path: string
  /** 마지막 수정 시각 (ISO) — 검색엔진 재크롤 트리거 */
  lastModified: string
}

// 익명 키 기반의 read-only 클라이언트 — RLS 의 'public' 정책으로 통과
function anonClient() {
  return createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}

// -------------------------------------------------------------
// tips — 발행된 꿀팁 글
// -------------------------------------------------------------
export async function getPublishedTipPaths(): Promise<SitemapEntry[]> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('tips')
    .select('slug, updated_at, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(500)

  if (error || !data) {
    console.error('[sitemap] tips fetch failed:', error)
    return []
  }
  return data
    .filter((row) => typeof row.slug === 'string' && row.slug.length > 0)
    .map((row) => ({
      path: `/tips/${encodeURIComponent(row.slug)}`,
      lastModified: row.updated_at ?? row.published_at ?? new Date().toISOString(),
    }))
}

// -------------------------------------------------------------
// packages — 노출(visible) 패키지 상품
//   주의 : 컬럼명이 is_active 가 아니라 is_visible (실제 DB 스키마 기준)
// -------------------------------------------------------------
export async function getActivePackagePaths(): Promise<SitemapEntry[]> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('packages')
    .select('slug, updated_at')
    .eq('is_visible', true)
    .order('updated_at', { ascending: false })
    .limit(200)

  if (error || !data) {
    console.error('[sitemap] packages fetch failed:', error)
    return []
  }
  return data
    .filter((row) => typeof row.slug === 'string' && row.slug.length > 0)
    .map((row) => ({
      path: `/packages/${encodeURIComponent(row.slug)}`,
      lastModified: row.updated_at ?? new Date().toISOString(),
    }))
}

// -------------------------------------------------------------
// products — 활성 단품
// -------------------------------------------------------------
export async function getActiveProductPaths(): Promise<SitemapEntry[]> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(200)

  if (error || !data) {
    console.error('[sitemap] products fetch failed:', error)
    return []
  }
  return data
    .filter((row) => typeof row.slug === 'string' && row.slug.length > 0)
    .map((row) => ({
      path: `/products/${encodeURIComponent(row.slug)}`,
      lastModified: row.updated_at ?? new Date().toISOString(),
    }))
}

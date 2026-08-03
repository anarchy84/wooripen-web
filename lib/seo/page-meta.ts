// ─────────────────────────────────────────────
// 어드민 SEO 관리(page_meta) → 공개 페이지 메타태그 연결
//
// 배경 (2026-08-03) :
//   어드민 > SEO 관리에 9개 페이지가 등록돼 있었지만, 공개 페이지의
//   generateMetadata 가 page_meta 를 조회하는 곳이 단 한 곳도 없었다.
//   즉 "경로 불일치로 반영이 안 될 수 있다" 가 아니라 연결 자체가 없어서
//   무엇을 입력해도 반영될 통로가 없었다. 메타는 전부 코드 하드코딩.
//
// 슬러그 정책 :
//   page_meta.page_slug 는 짧은 논리 슬러그(home, cctv, terminal, torder…)를 유지한다.
//   실제 라우트(/business/cctv)로 바꾸면 /api/admin/seo/[slug] 단일 세그먼트
//   라우트가 깨지므로, 대신 SLUG_TO_PATH 로 매핑만 잡는다.
//
// 머지 규칙 :
//   DB 값이 있으면 덮어쓰고, 비어 있으면 코드 fallback 을 그대로 둔다(null-safe).
//   ← 이게 없으면 어드민에서 빈 값 저장 시 프로덕션 메타가 통째로 사라진다.
// ─────────────────────────────────────────────

import 'server-only'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { PageMeta } from '@/types/database'

// 슬러그 ↔ 실제 라우트 매핑은 클라이언트(어드민 SEO 화면)에서도 써야 해서
// 'server-only' 가 아닌 lib/seo/slug-path.ts 에 둔다.
export { SLUG_TO_PATH } from '@/lib/seo/slug-path'

async function getPageMeta(slug: string): Promise<PageMeta | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('page_meta')
      .select('*')
      .eq('page_slug', slug)
      .maybeSingle()

    if (error) return null
    return (data as PageMeta) ?? null
  } catch {
    // 메타 조회 실패가 페이지 렌더를 막아선 안 된다
    return null
  }
}

/**
 * 코드 fallback 위에 어드민 입력값을 덮어쓴 Metadata 를 만든다.
 * 각 페이지의 `export const metadata` 를 아래로 바꿔 쓰면 된다.
 *
 *   export async function generateMetadata() {
 *     return buildPageMetadata('cctv', FALLBACK)
 *   }
 */
export async function buildPageMetadata(
  slug: string,
  fallback: Metadata
): Promise<Metadata> {
  const meta = await getPageMeta(slug)
  if (!meta) return fallback

  const title = meta.seo_title?.trim() || undefined
  const description = meta.seo_description?.trim() || undefined
  const ogImage = meta.og_image_url?.trim() || undefined
  const canonical = meta.canonical_url?.trim() || undefined

  const merged: Metadata = { ...fallback }

  if (title) {
    // 루트 layout 의 title template('%s | 우리편') 이 DB 값에도 붙는다.
    // 어드민이 접미사까지 입력한 경우 중복되므로 absolute 로 고정한다.
    merged.title = title.includes('우리편') ? { absolute: title } : title
  }
  if (description) merged.description = description
  if (canonical) merged.alternates = { ...fallback.alternates, canonical }

  if (title || description || ogImage) {
    merged.openGraph = {
      ...fallback.openGraph,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    }
  }

  return merged
}

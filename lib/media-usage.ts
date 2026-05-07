// ─────────────────────────────────────────────
// 미디어 사용처 검색 — 어디서 이 이미지 URL 이 쓰이는지 추적
//
// 미디어 라이브러리에서 이미지 삭제하기 전에 이 함수로 사용처 확인.
// 사용 중인 이미지를 강제 삭제하면 해당 콘텐츠의 이미지가 깨지므로
// 어드민 UI 에서 명확한 경고 + 강제 삭제 옵션을 제공한다.
//
// 검색 대상 (우리편 사이트 기준) :
//   · tips.content              — TipTap HTML 본문 (이미지 src 직접 박힘)
//   · tips.featured_image_url   — 게시물 대표 이미지
//   · products.image_url        — 상품 이미지
//   · products.hero_image       — 상품 상세 히어로
//   · products.og_image_url     — 상품 OG 이미지
//   · packages.hero_image       — 패키지 히어로
//   · packages.og_image_url     — 패키지 OG
//   · packages.detail_sections  — 패키지 구성품 (JSONB, 안에 url)
//   · page_meta.og_image_url    — 페이지별 OG
//   · content_blocks.value      — 인라인 편집 ImageValue (JSONB)
// ─────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js'

export interface UsageItem {
  url: string                 // 어떤 URL 이 발견되었는지 (storage_path or webp_path)
  table: string               // 어느 테이블
  id: string                  // 그 row 의 PK
  title: string               // 사람이 읽기 좋은 라벨
  location: string            // 컬럼명 또는 "본문" / "OG" 같은 설명
  href?: string | null        // 어드민에서 해당 콘텐츠로 점프할 링크 (있으면)
}

/**
 * 주어진 미디어 URL 들이 사이트의 어디서 사용 중인지 일괄 검색.
 * 각 테이블당 한 번씩만 쿼리해서 N+1 회피.
 */
export async function findMediaUsage(
  supabase: SupabaseClient,
  urls: string[],
): Promise<UsageItem[]> {
  if (urls.length === 0) return []
  const items: UsageItem[] = []

  // ── tips.featured_image_url (정확 일치) ─────────
  {
    const { data } = await supabase
      .from('tips')
      .select('id, title, slug, featured_image_url')
      .in('featured_image_url', urls)
    for (const r of data ?? []) {
      if (r.featured_image_url) {
        items.push({
          url: r.featured_image_url,
          table: 'tips',
          id: r.id,
          title: r.title,
          location: '대표 이미지',
          href: `/admin/tips/${r.id}`,
        })
      }
    }
  }

  // ── tips.content (HTML 본문 substring) ─────────
  // ILIKE 으로 한 번씩 검색. tips 가 수백 단위라면 OK
  {
    const { data: tips } = await supabase
      .from('tips')
      .select('id, title, slug, content')
    for (const t of tips ?? []) {
      if (!t.content) continue
      for (const url of urls) {
        if (t.content.includes(url)) {
          items.push({
            url,
            table: 'tips',
            id: t.id,
            title: t.title,
            location: '본문',
            href: `/admin/tips/${t.id}`,
          })
        }
      }
    }
  }

  // ── products (image_url / hero_image / og_image_url) ─────────
  for (const col of ['image_url', 'hero_image', 'og_image_url'] as const) {
    const { data } = await supabase
      .from('products')
      .select(`id, name, ${col}`)
      .in(col, urls)
    for (const r of (data ?? []) as Array<Record<string, unknown>>) {
      const used = r[col] as string | null
      if (used) {
        items.push({
          url: used,
          table: 'products',
          id: r.id as string,
          title: r.name as string,
          location: col,
          href: `/admin/products`,
        })
      }
    }
  }

  // ── packages (hero_image / og_image_url) ─────────
  for (const col of ['hero_image', 'og_image_url'] as const) {
    const { data } = await supabase
      .from('packages')
      .select(`id, name, ${col}`)
      .in(col, urls)
    for (const r of (data ?? []) as Array<Record<string, unknown>>) {
      const used = r[col] as string | null
      if (used) {
        items.push({
          url: used,
          table: 'packages',
          id: r.id as string,
          title: r.name as string,
          location: col,
          href: `/admin/packages`,
        })
      }
    }
  }

  // ── packages.detail_sections (JSONB substring) ─────────
  // 구성품 카드 안의 image url 찾기
  {
    const { data: pkgs } = await supabase
      .from('packages')
      .select('id, name, detail_sections')
    for (const p of pkgs ?? []) {
      const text = JSON.stringify(p.detail_sections ?? '')
      for (const url of urls) {
        if (text.includes(url)) {
          items.push({
            url,
            table: 'packages',
            id: p.id,
            title: p.name,
            location: '구성품 이미지',
            href: `/admin/packages`,
          })
        }
      }
    }
  }

  // ── page_meta.og_image_url ─────────
  {
    const { data } = await supabase
      .from('page_meta')
      .select('id, page_name, page_slug, og_image_url')
      .in('og_image_url', urls)
    for (const r of data ?? []) {
      if (r.og_image_url) {
        items.push({
          url: r.og_image_url,
          table: 'page_meta',
          id: r.id,
          title: r.page_name,
          location: 'OG 이미지',
          href: `/admin/seo`,
        })
      }
    }
  }

  // ── content_blocks.value (JSONB substring) ─────────
  // ImageValue 의 url / fallback_url 둘 다 포함됨
  {
    const { data: blocks } = await supabase
      .from('content_blocks')
      .select('id, page_path, block_key, value')
    for (const b of blocks ?? []) {
      const text = JSON.stringify(b.value ?? '')
      for (const url of urls) {
        if (text.includes(url)) {
          items.push({
            url,
            table: 'content_blocks',
            id: b.id,
            title: `${b.page_path} · ${b.block_key}`,
            location: '인라인 편집',
            href: b.page_path || null,
          })
        }
      }
    }
  }

  return items
}

/**
 * 단일 미디어 row 의 두 URL (storage_path, webp_path) 모두로 검색.
 */
export async function findUsageForMedia(
  supabase: SupabaseClient,
  media: { storage_path: string; webp_path: string | null },
): Promise<UsageItem[]> {
  const urls = [media.storage_path, media.webp_path].filter(Boolean) as string[]
  return findMediaUsage(supabase, urls)
}

/**
 * Supabase Storage public URL 에서 객체 path 추출.
 *   https://xxx.supabase.co/storage/v1/object/public/media/uploads/123-foo.png
 *   → uploads/123-foo.png
 */
export function extractStoragePath(publicUrl: string | null): string | null {
  if (!publicUrl) return null
  const m = publicUrl.match(/\/storage\/v1\/object\/public\/media\/(.+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

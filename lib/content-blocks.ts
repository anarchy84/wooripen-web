// ─────────────────────────────────────────────
// 인라인 편집 블록 — 서버사이드 조회 헬퍼
//  - SSR에서 block_key 로 value 조회 (단일/다중)
//  - ISR 캐시 태그 부착 → revalidateTag 로 즉시 갱신
//  - admin 에디터에서 value 저장 후 해당 태그만 무효화
// ─────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'

// -------------------------------------------------------------
// 타입 정의 — value 의 형태는 block_type 별로 다름
// -------------------------------------------------------------
export type TextValue  = { text: string }
export type ImageValue = {
  url: string
  alt?: string
  width?: number
  height?: number
  format?: 'webp' | 'png' | 'jpeg' | 'svg' | 'gif'
  // 로고 등 PNG fallback 있는 케이스 (WebP 알파 + PNG 원본 병행)
  fallback_url?: string
}
export type LinkValue  = { label: string; href: string; target?: '_self' | '_blank' }

export type BlockValue = TextValue | ImageValue | LinkValue

export interface ContentBlock {
  block_key: string
  block_type: 'text' | 'image' | 'link'
  value: BlockValue
  semantic_tag: string | null
  page_path: string | null
  note: string | null
  updated_at: string
}

// 캐시 태그 네이밍 규칙 : page_path 기준으로 묶어 일괄 무효화
export const cacheTagFor = (blockKey: string) => `cb:${blockKey}`
export const cacheTagForPage = (pagePath: string) => `cb-page:${pagePath}`

// -------------------------------------------------------------
// 단일 블록 조회 — fallback 있으면 없을 때 대체값 반환
// -------------------------------------------------------------
export async function getBlock<T extends BlockValue = BlockValue>(
  blockKey: string,
  fallback?: T
): Promise<{ value: T | undefined; meta: ContentBlock | null }> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('block_key', blockKey)
    .maybeSingle()

  if (error || !data) {
    return { value: fallback, meta: null }
  }

  return {
    value: data.value as T,
    meta: data as ContentBlock,
  }
}

// -------------------------------------------------------------
// 페이지 단위 일괄 조회 — 홈 렌더 1회에 1쿼리로 모든 블록 가져옴
// 반환값은 block_key → ContentBlock 맵
// -------------------------------------------------------------
export async function getBlocksForPage(pagePath: string): Promise<Map<string, ContentBlock>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page_path', pagePath)

  const map = new Map<string, ContentBlock>()
  if (error || !data) return map

  for (const row of data) {
    map.set(row.block_key, row as ContentBlock)
  }
  return map
}

// -------------------------------------------------------------
// 다중 블록 조회 (block_key 배열) — 섹션 단위 prefetch 용
// -------------------------------------------------------------
export async function getBlocks(blockKeys: string[]): Promise<Map<string, ContentBlock>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .in('block_key', blockKeys)

  const map = new Map<string, ContentBlock>()
  if (error || !data) return map

  for (const row of data) {
    map.set(row.block_key, row as ContentBlock)
  }
  return map
}

// -------------------------------------------------------------
// 편의 함수 — map 에서 값 꺼낼 때 fallback 자동 적용
// -------------------------------------------------------------
export function pickText(
  map: Map<string, ContentBlock>,
  key: string,
  fallback: string
): string {
  const block = map.get(key)
  if (!block || block.block_type !== 'text') return fallback
  return (block.value as TextValue).text ?? fallback
}

export function pickImage(
  map: Map<string, ContentBlock>,
  key: string,
  fallback: ImageValue
): ImageValue {
  const block = map.get(key)
  if (!block || block.block_type !== 'image') return fallback
  return block.value as ImageValue
}

export function pickLink(
  map: Map<string, ContentBlock>,
  key: string,
  fallback: LinkValue
): LinkValue {
  const block = map.get(key)
  if (!block || block.block_type !== 'link') return fallback
  return block.value as LinkValue
}

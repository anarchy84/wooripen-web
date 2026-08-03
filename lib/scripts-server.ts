// ─────────────────────────────────────────────
// 어드민 스크립트 — 서버 전용 조회 헬퍼
//
// 배경 (2026-08-03) :
//   - 어드민 > 스크립트(/admin/scripts)에 GTM 등이 등록돼 있었지만
//     공개 페이지에서 scripts 테이블을 읽어 주입하는 로직이 없어
//     "등록해도 렌더링 안 되는" 상태였음 → 이 헬퍼 + InjectedScripts 로 연결
//   - unstable_cache 안에서는 cookies() 를 못 쓰므로
//     lib/supabase/server.ts 대신 쿠키 없는 bare client 를 사용
//   - 조회 실패 시 빈 배열 반환 (fail-soft) — 루트 레이아웃에서 쓰이므로
//     여기서 throw 하면 사이트 전체가 500 이 된다
//
// 캐시 무효화 :
//   - 어드민 저장/수정/삭제 API 가 revalidateTag(SCRIPTS_CACHE_TAG) 호출 → 즉시 반영
//   - 그 외엔 5분(300s) 주기 재검증
// ─────────────────────────────────────────────

import 'server-only'
import { unstable_cache } from 'next/cache'
import { createClient as createBareClient } from '@supabase/supabase-js'
import type { Script } from '@/types/database'

export const SCRIPTS_CACHE_TAG = 'scripts'

// 캐시 대상 — 여기서 throw 하면 unstable_cache 가 결과를 저장하지 않는다.
// (실패한 빈 배열이 정상 결과처럼 5분간 캐시되어 전 사이트 스크립트 공백이
//  장기화되는 것을 막기 위함. fail-soft 는 바깥 래퍼에서 처리한다.)
const fetchActiveScripts = unstable_cache(
  async (): Promise<Script[]> => {
    const supabase = createBareClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    // 1차 범위는 scope='global' 만 지원 (현재 등록 스크립트가 전부 global).
    // scope='page' + target_pages 필터는 pathname 전달 구조 확정 후 확장.
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('is_active', true)
      .eq('scope', 'global')
      .order('sort_order')

    if (error) throw new Error(error.message)
    return (data as Script[]) ?? []
  },
  ['active-scripts'],
  { tags: [SCRIPTS_CACHE_TAG], revalidate: 300 }
)

/**
 * 활성 스크립트 조회. 실패 시 빈 배열 (루트 레이아웃에서 쓰이므로 절대 throw 금지).
 * 실패 결과는 캐시되지 않으므로 다음 요청에서 즉시 재시도된다.
 */
export async function getActiveScripts(): Promise<Script[]> {
  try {
    return await fetchActiveScripts()
  } catch (err) {
    console.warn('[scripts] fetch failed:', err instanceof Error ? err.message : err)
    return []
  }
}

// ─────────────────────────────────────────────
// 우리편 홈 — 서버 컴포넌트 (얇은 래퍼)
//
// 역할 :
//   1. Supabase 에서 홈("/") 페이지 content_blocks 전부 1쿼리로 조회
//   2. Map → Record 직렬화 변환
//   3. 실제 렌더 로직은 HomeClient 로 위임
//
// 왜 이렇게 쪼갰나 :
//   - 인라인 편집 블록 DB 값을 SSR 로 읽어야 SEO · 초기 렌더 품질 유지
//   - 기존 홈 페이지는 'use client' 필요한 로직 (폼 · 카운트업 · attribution)
//     이 많아서 서버 컴포넌트로 통째 전환 불가
//   - 서버는 "데이터 공급"만, 클라이언트는 "렌더 + 인터랙션" 만 담당하는 구조
//
// 캐시 전략 :
//   - Next.js ISR 기본 캐시 + revalidateTag 로 편집 시 즉시 갱신
//     (/api/admin/content-blocks PATCH 에서 tag 무효화)
// ─────────────────────────────────────────────

import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import HomeClient from '@/components/pages/HomeClient'
import { OrganizationLd, WebSiteLd } from '@/lib/seo/structured-data'

export default async function HomePage() {
  // 서버에서 홈 블록 일괄 조회 (1 쿼리)
  const blocksMap = await getBlocksForPage('/')

  // 서버 → 클라이언트 prop 은 JSON 직렬화만 통과하므로
  // Map 은 반드시 Record(plain object) 로 변환해서 넘겨야 함
  const blocks = blocksMapToRecord(blocksMap)

  return (
    <>
      {/* SERP 리치 결과용 구조화 데이터 — 검색엔진만 읽음 */}
      <OrganizationLd />
      <WebSiteLd />
      <HomeClient blocks={blocks} />
    </>
  )
}

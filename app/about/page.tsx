// /about — server wrapper for inline editing
//   - blocks fetch in server, BlocksProvider in client child
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import AboutClient from './AboutClient'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const revalidate = 0

// 코드 fallback — 어드민 SEO 관리(page_meta)에 값이 있으면 그쪽이 우선한다
const FALLBACK_METADATA: Metadata = {
  title: '회사소개',
  description:
    '사장님 옆에 서서 같이 고민하는 팀 우리편. 매장 인프라를 가장 쉽고 합리적으로.',
  alternates: { canonical: 'https://ourteam.kr/about' },
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('about', FALLBACK_METADATA)
}

export default async function AboutPage() {
  const blocksMap = await getBlocksForPage('/about')
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <AboutClient />
    </BlocksProvider>
  )
}

// /about — server wrapper for inline editing
//   - blocks fetch in server, BlocksProvider in client child
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import AboutClient from './AboutClient'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '회사소개 | 우리편',
  description:
    '사장님 옆에 서서 같이 고민하는 팀 우리편. 매장 인프라를 가장 쉽고 합리적으로.',
  alternates: { canonical: 'https://ourteam.kr/about' },
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

// /recommend — server wrapper for inline editing
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import RecommendClient from './RecommendClient'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '맞춤 추천 | 우리편',
  description: '업종별로 우리편이 추천하는 매장 인프라 패키지를 확인하고, 한 번에 상담받으세요.',
  alternates: { canonical: 'https://ourteam.kr/recommend' },
  openGraph: {
    title: '맞춤 추천 | 우리편',
    description: '업종별 매장 인프라 추천 + 원스톱 상담.',
    url: 'https://ourteam.kr/recommend',
    type: 'website',
  },
}

export default async function RecommendPage() {
  const blocksMap = await getBlocksForPage('/recommend')
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <RecommendClient />
    </BlocksProvider>
  )
}

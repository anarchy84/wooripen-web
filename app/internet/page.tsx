// /internet — server wrapper for inline editing
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import InternetClient from './InternetClient'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '사업자 인터넷 | 우리편',
  description:
    'SKT · KT · LG U+ 사업자 인터넷 요금을 비교하고 매장에 맞는 회선 구성을 상담받으세요.',
  alternates: { canonical: 'https://wooripen.co.kr/internet' },
}

export default async function InternetPage() {
  const blocksMap = await getBlocksForPage('/internet')
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <InternetClient />
    </BlocksProvider>
  )
}

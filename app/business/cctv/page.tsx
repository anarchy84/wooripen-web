// /business/cctv — server wrapper
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import CctvClient from './CctvClient'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'CCTV 설치 | 우리편',
  description: '매장 크기와 구조에 맞는 CCTV 구성을 추천해드립니다.',
  alternates: { canonical: 'https://wooripen.co.kr/business/cctv' },
}

export default async function CctvPage() {
  const blocksMap = await getBlocksForPage('/business/cctv')
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <CctvClient />
    </BlocksProvider>
  )
}

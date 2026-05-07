// /business/cctv — server wrapper + 자동 카탈로그
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import CctvClient from './CctvClient'
import CategoryProductGrid from '@/components/sections/CategoryProductGrid'
import { getProductsByCategory } from '@/lib/category-products'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'CCTV 설치 | 우리편',
  description: '매장 크기와 구조에 맞는 CCTV 구성을 추천해드립니다.',
  alternates: { canonical: 'https://ourteam.kr/business/cctv' },
}

export default async function CctvPage() {
  const [blocksMap, products] = await Promise.all([
    getBlocksForPage('/business/cctv'),
    getProductsByCategory('cctv'),
  ])
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <CctvClient />
      <CategoryProductGrid
        products={products}
        accent="emerald"
        eyebrow="Catalog"
        title="등록된 CCTV 상품"
        subtitle="실시간 등록된 카메라 라인업. 클릭하면 상세 페이지로."
      />
    </BlocksProvider>
  )
}

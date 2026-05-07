// /business/torder — server wrapper + 자동 카탈로그
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import TorderClient from './TorderClient'
import CategoryProductGrid from '@/components/sections/CategoryProductGrid'
import { getProductsByCategory } from '@/lib/category-products'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '키오스크 · 티오더 | 우리편',
  description: '키오스크부터 테이블 오더까지. 비대면 주문 시스템으로 매장 효율을 높여보세요.',
  alternates: { canonical: 'https://wooripen.co.kr/business/torder' },
}

export default async function TorderPage() {
  const [blocksMap, products] = await Promise.all([
    getBlocksForPage('/business/torder'),
    getProductsByCategory('torder'),
  ])
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <TorderClient />
      <CategoryProductGrid
        products={products}
        accent="orange"
        eyebrow="Catalog"
        title="등록된 키오스크·티오더 상품"
        subtitle="실시간 등록된 주문 시스템. 클릭하면 상세 페이지로."
      />
    </BlocksProvider>
  )
}

// /rental — server wrapper + 자동 카탈로그
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import RentalClient from './RentalClient'
import CategoryProductGrid from '@/components/sections/CategoryProductGrid'
import { getProductsByCategory } from '@/lib/category-products'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '매장 렌탈 | 우리편',
  description: '정수기·공기청정기·복합기·제빙기까지 매장 운영에 필요한 장비를 부담 없이 렌탈하세요.',
  alternates: { canonical: 'https://wooripen.co.kr/rental' },
}

export default async function RentalPage() {
  const [blocksMap, products] = await Promise.all([
    getBlocksForPage('/rental'),
    getProductsByCategory('rental'),
  ])
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <RentalClient />
      <CategoryProductGrid
        products={products}
        accent="cyan"
        eyebrow="Catalog"
        title="등록된 렌탈 상품"
        subtitle="실시간 등록된 정수기·공기청정기·복합기. 클릭하면 상세로."
      />
    </BlocksProvider>
  )
}

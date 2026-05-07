// /business/terminal — server wrapper + 자동 카탈로그
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import TerminalClient from './TerminalClient'
import CategoryProductGrid from '@/components/sections/CategoryProductGrid'
import { getProductsByCategory } from '@/lib/category-products'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '결제단말기 | 우리편',
  description: '유선·무선·키인 단말기부터 POS까지 비교·상담해드립니다.',
  alternates: { canonical: 'https://wooripen.co.kr/business/terminal' },
}

export default async function TerminalPage() {
  const [blocksMap, products] = await Promise.all([
    getBlocksForPage('/business/terminal'),
    getProductsByCategory('terminal'),
  ])
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <TerminalClient />
      <CategoryProductGrid
        products={products}
        accent="violet"
        eyebrow="Catalog"
        title="등록된 단말기 라인업"
        subtitle="실시간 등록된 단말기. 클릭하면 상세 페이지로."
      />
    </BlocksProvider>
  )
}

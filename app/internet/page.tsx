// /internet — server wrapper for inline editing + 자동 카탈로그
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import InternetClient from './InternetClient'
import CategoryProductGrid from '@/components/sections/CategoryProductGrid'
import { getProductsByCategory } from '@/lib/category-products'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const revalidate = 0

// 코드 fallback — 어드민 SEO 관리(page_meta)에 값이 있으면 그쪽이 우선한다
const FALLBACK_METADATA: Metadata = {
  title: '사업자 인터넷',
  description:
    'SKT · KT · LG U+ 사업자 인터넷 요금을 비교하고 매장에 맞는 회선 구성을 상담받으세요.',
  alternates: { canonical: 'https://ourteam.kr/internet' },
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('internet', FALLBACK_METADATA)
}

export default async function InternetPage() {
  const [blocksMap, products] = await Promise.all([
    getBlocksForPage('/internet'),
    getProductsByCategory('internet'),
  ])
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <InternetClient />
      {/* 자동 카탈로그 — products(internet) 활성 9개 */}
      <CategoryProductGrid
        products={products}
        accent="sky"
        eyebrow="Catalog"
        title="등록된 인터넷 상품"
        subtitle="실시간 등록된 회선·요금제. 클릭하면 상세 페이지로."
      />
    </BlocksProvider>
  )
}

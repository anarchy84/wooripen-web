// /business/terminal — server wrapper
import { getBlocksForPage } from '@/lib/content-blocks-server'
import { blocksMapToRecord } from '@/lib/content-blocks'
import { BlocksProvider } from '@/components/editable/BlocksProvider'
import TerminalClient from './TerminalClient'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '결제단말기 | 우리편',
  description: '유선·무선·키인 단말기부터 POS까지 비교·상담해드립니다.',
  alternates: { canonical: 'https://wooripen.co.kr/business/terminal' },
}

export default async function TerminalPage() {
  const blocksMap = await getBlocksForPage('/business/terminal')
  const blocks = blocksMapToRecord(blocksMap)
  return (
    <BlocksProvider blocks={blocks}>
      <TerminalClient />
    </BlocksProvider>
  )
}

// 꿀팁 게시판(목록) — 메타데이터 전용 래퍼
//   /tips/[slug] 상세는 자체 generateMetadata 가 처리하므로 영향 X
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/page-meta'

// 코드 fallback — 어드민 SEO 관리(page_meta, slug: tips)에 값이 있으면 그쪽이 우선한다
const FALLBACK_METADATA: Metadata = {
  title: '소상공인 꿀팁 — 인터넷·결제·CCTV 운영 노하우',
  description:
    '매장 운영자가 실제로 쓰는 인터넷·결제·CCTV·티오더 셋업 노하우와 비용 절감 팁을 정리했습니다. 매주 새 글이 업데이트됩니다.',
  alternates: { canonical: 'https://ourteam.kr/tips' },
  openGraph: {
    title: '소상공인 꿀팁 | 우리편',
    description: '매장 운영자가 실제로 쓰는 셋업·비용 절감 노하우.',
    url: 'https://ourteam.kr/tips',
    type: 'website',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('tips', FALLBACK_METADATA)
}

export default function TipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// 결제단말기(카드단말기) 카테고리 — 메타데이터 전용 래퍼
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '결제단말기 비교·설치 — 카드단말기·무선단말기·VAN 통합',
  description:
    '소상공인 매장에 필요한 카드단말기, 무선단말기, VAN 결제 솔루션을 한 자리에서 비교하고 설치하세요. 사용 패턴별 최적 모델을 추천드립니다.',
  alternates: { canonical: 'https://wooripen.co.kr/business/terminal' },
  openGraph: {
    title: '결제단말기 비교·설치 | 우리편',
    description: '카드단말기·무선단말기·VAN 까지 매장에 맞춰 추천.',
    url: 'https://wooripen.co.kr/business/terminal',
    type: 'website',
  },
}

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

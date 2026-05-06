// 티오더(테이블 오더) 카테고리 — 메타데이터 전용 래퍼
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '티오더 도입 — 테이블 오더로 인건비·실수 줄이기',
  description:
    '음식점·카페·주점에 맞는 티오더(테이블 오더) 시스템을 설치 비용·POS 연동·운영 노하우까지 한 자리에서 비교하세요.',
  alternates: { canonical: 'https://wooripen.co.kr/business/torder' },
  openGraph: {
    title: '티오더 도입 | 우리편',
    description: '테이블 오더로 인건비·주문 실수 줄이기.',
    url: 'https://wooripen.co.kr/business/torder',
    type: 'website',
  },
}

export default function TorderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

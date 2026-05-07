// CCTV 카테고리 — 메타데이터 전용 래퍼
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CCTV 설치·렌탈 — 매장 보안·관리 통합 솔루션',
  description:
    '4K 화질·야간촬영·원격관제까지 가능한 CCTV 를 매장 규모에 맞춰 설치·렌탈하세요. 사후 점검과 통신 회선까지 한 번에 정리합니다.',
  alternates: { canonical: 'https://ourteam.kr/business/cctv' },
  openGraph: {
    title: 'CCTV 설치·렌탈 | 우리편',
    description: '매장 규모에 맞춘 CCTV 견적·설치를 한 번에.',
    url: 'https://ourteam.kr/business/cctv',
    type: 'website',
  },
}

export default function CctvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

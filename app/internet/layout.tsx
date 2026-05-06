// 사업자 인터넷 카테고리 — 메타데이터 전용 래퍼
//   page.tsx 가 'use client' 라 layout 에서 metadata export
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '사업자 인터넷 비교·설치 — 매장에 딱 맞는 회선',
  description:
    'KT·SK·LG U+ 사업자 전용 인터넷 회선을 한 자리에서 비교하고 매장 환경에 맞는 조합으로 설치 받으세요. 최대 사은품·요금 할인 적용.',
  alternates: { canonical: 'https://wooripen.co.kr/internet' },
  openGraph: {
    title: '사업자 인터넷 비교·설치 | 우리편',
    description: '매장에 딱 맞는 인터넷 회선을 한 번에 비교·설치.',
    url: 'https://wooripen.co.kr/internet',
    type: 'website',
  },
}

export default function InternetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

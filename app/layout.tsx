import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingCTA from '@/components/layout/FloatingCTA'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://wooripen.co.kr'),
  title: {
    default: '우리편 | 소상공인 인터넷·결제단말기·CCTV 한번에',
    template: '%s | 우리편',
  },
  description:
    '사업자 인터넷, 결제단말기, CCTV, 티오더까지 한번에 비교하고 최대 혜택으로 설치하세요. 전문 상담사가 매장에 딱 맞는 솔루션을 추천해드립니다.',
  keywords: [
    '사업자 인터넷',
    '결제단말기',
    'CCTV 설치',
    '티오더',
    '소상공인 인터넷',
    '매장 인터넷',
    '카드단말기',
    '무선단말기',
    'POS',
    '사업자 통신',
  ],
  authors: [{ name: '우리편' }],
  creator: '우리편',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://wooripen.co.kr',
    siteName: '우리편',
    title: '우리편 | 소상공인 인터넷·결제단말기·CCTV 한번에',
    description:
      '사업자 인터넷, 결제단말기, CCTV, 티오더까지 한번에 비교하고 최대 혜택으로 설치하세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '우리편 - 소상공인 편에 서는 유일한 파트너',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '우리편 | 소상공인 인터넷·결제단말기·CCTV 한번에',
    description:
      '사업자 인터넷, 결제단말기, CCTV, 티오더까지 한번에 비교하고 최대 혜택으로 설치하세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: 실제 인증 코드 입력
    // google: 'google-site-verification-code',
    // other: { 'naver-site-verification': 'naver-code' },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  )
}

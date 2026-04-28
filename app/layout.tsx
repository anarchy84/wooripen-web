import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingCTA from '@/components/layout/FloatingCTA'
// 어드민 경로(/admin/**) 에선 메인 사이트 GNB·Footer·FloatingCTA 숨기는 client wrapper
import SiteShell from '@/components/layout/SiteShell'
// 인라인 편집 — 전역 편집 컨텍스트 & 모달 (admin 로그인 시에만 실질 동작)
import { EditorProvider } from '@/components/editable/EditorProvider'
import { EditorModal } from '@/components/editable/EditorModal'
// 관리자 권한 체크 — 앱 전체에서 Supabase auth 호출을 1회로 축소 (NavigatorLock 경쟁 방지)
import { AdminGuardProvider } from '@/components/editable/AdminGuardProvider'
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
        {/*
          AdminGuardProvider : 앱 전체에서 Supabase auth 체크를 1회로 묶음
            - 바깥쪽에 둬서 EditorProvider/EditorModal/Header 등이 모두 같은 context 를 읽게 함
            - 비로그인 방문자에게도 오버헤드 거의 0 (1회 getUser + 이벤트 구독 1개)
          EditorProvider : 편집 세션 관리 (어떤 블록을 누가 편집 중인지)
        */}
        <AdminGuardProvider>
          <EditorProvider>
            {/*
              SiteShell : /admin/** 경로면 메인 셸(GNB·Footer·FloatingCTA) 숨김.
              어드민 페이지가 자체 layout 으로 화면 그리도록 양보.
              비어드민 경로면 기존처럼 Header / main / Footer / FloatingCTA 그대로 렌더.
            */}
            <SiteShell
              header={<Header />}
              footer={<Footer />}
              floatingCta={<FloatingCTA />}
            >
              {children}
            </SiteShell>
            {/* 전역 편집 모달 — admin 이 ✏️ 눌렀을 때만 실제 DOM 에 나타남 */}
            <EditorModal />
          </EditorProvider>
        </AdminGuardProvider>
      </body>
    </html>
  )
}

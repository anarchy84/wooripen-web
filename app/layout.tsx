import type { Metadata, Viewport } from 'next'
import { pretendard } from '@/lib/fonts'
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
// Core Web Vitals 측정 (LCP/CLS/INP/FCP/TTFB) → /api/web-vitals → 어드민 대시보드
import { WebVitalsReporter } from '@/components/WebVitalsReporter'
// 어드민 > 스크립트 등록분(GTM 등) 주입 — /admin 경로는 ScriptsGate 가 차단
import { getActiveScripts } from '@/lib/scripts-server'
import InjectedScripts from '@/components/layout/InjectedScripts'
import ScriptsGate from '@/components/layout/ScriptsGate'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://ourteam.kr'),
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
    url: 'https://ourteam.kr',
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

// 모바일 최적화 + 브라우저 UI 컬러 (Lighthouse 가산점 + 안드로이드 크롬 상단바)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1114' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 어드민 등록 활성 스크립트 (5분 캐시 + 어드민 저장 시 revalidateTag 즉시 반영)
  const injectedScripts = await getActiveScripts()

  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        {/*
          주입 스크립트 (GTM 등) :
          - head/body_start 포지션은 body 최상단에서 처리 —
            <script> 는 next/script(afterInteractive)라 물리 위치 무관,
            <noscript> 조각(GTM iframe)은 body 시작이 표준 위치
          - /admin 경로는 ScriptsGate 가 렌더 자체를 차단 (GA 오염 방지)
        */}
        <ScriptsGate>
          <InjectedScripts scripts={injectedScripts} positions={['head', 'body_start']} />
        </ScriptsGate>
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
        {/* Core Web Vitals 익명 측정 → 어드민 대시보드 */}
        <WebVitalsReporter />
        {/* body 끝 포지션 주입 스크립트 */}
        <ScriptsGate>
          <InjectedScripts scripts={injectedScripts} positions={['body_end']} />
        </ScriptsGate>
      </body>
    </html>
  )
}

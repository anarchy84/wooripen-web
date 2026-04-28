// ─────────────────────────────────────────────
// SiteShell — 메인 사이트 셸 (Header / Footer / FloatingCTA) 조건부 렌더
//
// 왜 만듦 :
//   root layout 이 server component 라 pathname 직접 받기 어려움.
//   /admin/** 페이지에 메인 사이트 GNB 가 같이 떠서 어드민 UI 가려지는 문제 → 이걸로 해결.
//
// 사용법 (app/layout.tsx) :
//   <SiteShell
//     header={<Header />}
//     footer={<Footer />}
//     floatingCta={<FloatingCTA />}
//   >
//     {children}
//   </SiteShell>
//
//   → Header / Footer / FloatingCTA 는 server component 인 상태로 보존 (props 로 전달).
//   → /admin 경로면 셸 안 그리고 children 만, 아니면 전체 셸 그림.
// ─────────────────────────────────────────────
'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface Props {
  header: ReactNode
  footer: ReactNode
  floatingCta: ReactNode
  children: ReactNode
}

export default function SiteShell({
  header,
  footer,
  floatingCta,
  children,
}: Props) {
  const pathname = usePathname() ?? ''
  // /admin 또는 /admin/login 등 어드민 영역 → 메인 셸 숨김
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    // main wrapper 도 빼서 어드민 layout 이 자체 레이아웃을 자유롭게 잡게 함
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {floatingCta}
    </>
  )
}

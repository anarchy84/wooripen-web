// ─────────────────────────────────────────────
// ScriptsGate — /admin/** 경로에서 주입 스크립트(GTM 등) 렌더 차단
//
// 왜 :
//   - 어드민 트래픽이 GA/광고 데이터에 섞이면 전환 지표가 오염됨
//   - SiteShell 과 같은 패턴 (root layout 은 서버 컴포넌트라 pathname 을
//     직접 못 읽음 → 클라이언트 게이트로 분기, 스크립트 자체는 서버에서 준비)
//
// 한계 (허용) :
//   - 공개 페이지 → /admin 으로 SPA 이동 시 이미 로드된 GTM 은 내려가지 않음.
//     어드민 진입은 보통 /admin 직접 접속이라 초기 로드 차단으로 대부분 커버.
// ─────────────────────────────────────────────
'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function ScriptsGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ''
  if (pathname.startsWith('/admin')) return null
  return <>{children}</>
}

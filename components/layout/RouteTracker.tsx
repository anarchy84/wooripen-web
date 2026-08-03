// ─────────────────────────────────────────────
// RouteTracker — SPA 소프트 내비게이션 페이지뷰 발화
//
// 배경 (2026-08-03) :
//   주입된 GTM 스니펫은 최초 로드에서 1회만 실행된다. 이후 next/link 로
//   페이지를 옮겨다니면 dataLayer 에 아무것도 push 되지 않아, GTM 컨테이너가
//   'All Pages(초기화)' 트리거만 쓰는 경우 2번째 페이지부터 조회수가 통째로 누락된다.
//   lib/gtm.ts 의 firePageView 는 정의만 있고 호출처가 없는 데드 코드였다.
//
// ⚠️ GTM 설정 주의 :
//   컨테이너에서 이 page_view 커스텀 이벤트를 트리거로 사용할 것.
//   History Change 트리거를 동시에 켜두면 같은 이동이 두 번 집계된다.
//
// 최초 로드는 GTM 스니펫 자체가 페이지뷰를 잡으므로 여기서는 제외한다(중복 방지).
// ─────────────────────────────────────────────
'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { firePageView } from '@/lib/gtm'

export default function RouteTracker() {
  const pathname = usePathname()
  const prev = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    // 최초 마운트는 건너뜀 — GTM 스니펫의 초기 페이지뷰와 중복되므로
    if (prev.current === null) {
      prev.current = pathname
      return
    }
    if (prev.current === pathname) return
    prev.current = pathname
    firePageView(pathname, document.title)
  }, [pathname])

  return null
}

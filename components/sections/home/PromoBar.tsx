'use client'

// ─────────────────────────────────────────────
// 상단 프로모바 (페이히어 벤치마크 — 2분할)
//  좌: 인터넷+CCTV 핫딜 / 우: 이달의 이벤트
//  어드민 연동은 Phase 3. 지금은 정적 텍스트 + 링크.
// ─────────────────────────────────────────────

import Link from 'next/link'

interface PromoItem {
  text: React.ReactNode
  href: string
  bg: string
  textColor: string
}

const PROMOS: [PromoItem, PromoItem] = [
  {
    text: (
      <>
        <span className="font-semibold">[매장 창업 필수]</span>{' '}
        <span className="font-bold">인터넷 + CCTV</span> 월 3만원대부터
      </>
    ),
    href: '/internet',
    bg: 'bg-primary',
    textColor: 'text-white',
  },
  {
    text: (
      <>
        모르면 손해,{' '}
        <span className="font-bold">티오더 테이블오더</span> 도입 50% 할인
      </>
    ),
    href: '/business/torder',
    bg: 'bg-gray-900',
    textColor: 'text-white',
  },
]

export default function PromoBar() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 text-xs md:text-sm">
      {PROMOS.map((promo, i) => (
        <Link
          key={i}
          href={promo.href}
          className={`${promo.bg} ${promo.textColor} py-2 px-4 text-center hover:opacity-90 transition-opacity`}
        >
          {promo.text}
        </Link>
      ))}
    </div>
  )
}

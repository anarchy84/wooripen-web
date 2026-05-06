// ─────────────────────────────────────────────
// 정적 SVG 아이콘 (가장 자주 쓰는 것만 inline 으로 분리)
//
// 왜 분리?
//   - @iconify/react 는 dynamic import 라 매 페이지에서 추가 청크 다운로드.
//   - 가장 자주 쓰는 아이콘(check-circle, arrow-right) 두 개만 정적 SVG 로 박으면
//     초기 청크가 줄고 LCP/INP 에 작은 이득.
//
// 사용 :
//   import { CheckCircleIcon, ArrowRightIcon } from '@/components/icons'
//   <CheckCircleIcon className="w-5 h-5 text-primary" />
//
// solar:check-circle-bold / solar:arrow-right-linear 디자인 그대로 가져옴.
// 추가 분리 후보 — 사용 빈도 2회 이상인 아이콘 (다음 라운드).
// ─────────────────────────────────────────────
import * as React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {}

// solar:check-circle-bold — 사용 14회 (전 사이트에서 가장 많음)
export function CheckCircleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm4.768-13.477a.75.75 0 0 1 .144 1.05l-4.96 6.504a1.75 1.75 0 0 1-2.616.184l-2.65-2.65a.75.75 0 1 1 1.06-1.06l2.651 2.65a.25.25 0 0 0 .374-.027l4.96-6.504a.75.75 0 0 1 1.05-.144Z"
      />
    </svg>
  )
}

// solar:arrow-right-linear — 사용 12회 (CTA·카드 끝 화살표)
export function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 6s6 4.419 6 6c0 1.581-6 6-6 6" />
      <path d="M4 12h15.5" strokeLinejoin="round" />
    </svg>
  )
}

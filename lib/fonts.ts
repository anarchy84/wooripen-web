// ─────────────────────────────────────────────
// Pretendard Variable 자체 호스팅 (next/font/local)
//
// - 외부 CDN(jsdelivr) 의존 제거 → 1st-party 도메인 캐시·preload 활용
// - 빌드 타임에 폰트 메타 분석 → CSS 자동 생성 + display:swap
// - --font-pretendard CSS 변수로 노출 → tailwind sans 패밀리에서 우선 사용
// ─────────────────────────────────────────────
import localFont from 'next/font/local'

export const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',          // variable axis 전체 범위
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})

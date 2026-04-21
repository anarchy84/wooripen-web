'use client'

// ─────────────────────────────────────────────
// 히어로 캐러셀 (페이히어 벤치마크)
//  - 헤드카피 고정 + 하단에 5개 유스케이스 슬라이드
//  - embla 대신 CSS scroll-snap + 자동 재생 + 수동 네비게이션
//  - 이미지는 전부 MediaSlot → 플레이스홀더로 시작
// ─────────────────────────────────────────────

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import MediaSlot from '@/components/ui/MediaSlot'
import FadeIn from '@/components/ui/FadeIn'

interface Slide {
  eyebrow: string           // 상단 뱃지 텍스트
  title: React.ReactNode    // 슬라이드 제목
  ctaPrimary: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  // MediaSlot 파라미터
  subject: string
  label: string
  hint: string
  icon: string
}

const SLIDES: Slide[] = [
  {
    eyebrow: '신규 창업',
    title: (
      <>
        카페 창업 준비 중?
        <br className="hidden sm:inline" />
        {' '}
        <span className="text-primary">필요한 건 전부 월 3만원대로.</span>
      </>
    ),
    ctaPrimary: { label: '창업 패키지 상담', href: '/internet' },
    ctaSecondary: { label: '견적 받기', href: '#consult' },
    subject: 'hero-startup-cafe',
    label: '히어로 1 — 카페 창업 장면',
    hint: '매장 오픈 준비 실사 · 1920×1080+',
    icon: 'solar:shop-bold-duotone',
  },
  {
    eyebrow: 'CCTV 교체',
    title: (
      <>
        낡은 CCTV,
        <br className="hidden sm:inline" />
        {' '}
        <span className="text-primary">4K로 바꾸고 유지비는 줄이기.</span>
      </>
    ),
    ctaPrimary: { label: 'CCTV 상담', href: '/business/cctv' },
    ctaSecondary: { label: '요금 비교', href: '/business/cctv' },
    subject: 'hero-cctv-upgrade',
    label: '히어로 2 — CCTV 설치 현장',
    hint: '매장 천장 CCTV 실사 · 1920×1080+',
    icon: 'solar:videocamera-record-bold-duotone',
  },
  {
    eyebrow: '키오스크 도입',
    title: (
      <>
        인건비는 낮추고
        <br className="hidden sm:inline" />
        {' '}
        <span className="text-primary">주문 회전율은 올리기.</span>
      </>
    ),
    ctaPrimary: { label: '키오스크 상담', href: '/business/torder' },
    ctaSecondary: { label: '사례 보기', href: '#cases' },
    subject: 'hero-kiosk',
    label: '히어로 3 — 키오스크 주문 장면',
    hint: '고객 키오스크 이용 실사 · 1920×1080+',
    icon: 'solar:tablet-bold-duotone',
  },
  {
    eyebrow: '렌탈 갈아타기',
    title: (
      <>
        지금 쓰는 단말기,
        <br className="hidden sm:inline" />
        {' '}
        <span className="text-primary">우리편이 더 저렴합니다.</span>
      </>
    ),
    ctaPrimary: { label: '단말기 비교', href: '/business/terminal' },
    ctaSecondary: { label: '상담 신청', href: '#consult' },
    subject: 'hero-terminal',
    label: '히어로 4 — 카드단말기 클로즈업',
    hint: '결제 단말기 실사 · 1920×1080+',
    icon: 'solar:card-recive-bold-duotone',
  },
  {
    eyebrow: '테이블 오더',
    title: (
      <>
        네이버 리뷰 연동되는
        <br className="hidden sm:inline" />
        {' '}
        <span className="text-primary">테이블 오더, 써보셨어요?</span>
      </>
    ),
    ctaPrimary: { label: '테이블 오더 상담', href: '/business/torder' },
    ctaSecondary: { label: '도입 사례', href: '#cases' },
    subject: 'hero-tableorder',
    label: '히어로 5 — 테이블 오더 사용 장면',
    hint: '식탁 위 태블릿 주문 실사 · 1920×1080+',
    icon: 'solar:chat-round-dots-bold-duotone',
  },
]

const AUTO_INTERVAL = 5000 // 5초

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 자동 재생
  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, AUTO_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused])

  const goTo = (i: number) => {
    setIndex(i)
    setPaused(true)
    // 수동 조작 후 10초 뒤 자동 재생 복귀
    setTimeout(() => setPaused(false), 10000)
  }

  const current = SLIDES[index]

  return (
    <section
      className="relative overflow-hidden bg-gray-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 배경 그라데이션 장식 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-blue-400/10 blur-[100px]" />
      </div>

      {/* Header(h-16) + PromoBar(모바일 2줄 ~80px / 데스크톱 ~40px) 높이만큼 상단 여백 확보 */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-40 pb-10 md:pt-32 md:pb-16">
        {/* 헤드카피 영역 */}
        <FadeIn>
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block px-3 py-1 text-xs md:text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
              {current.eyebrow}
            </span>
            {/* min-h는 슬라이드 전환 시 높이 점프 방지용 — 모바일에선 tight하게 */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight min-h-[2.5em] md:min-h-[3em] break-keep">
              {current.title}
            </h1>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={current.ctaPrimary.href}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
              >
                {current.ctaPrimary.label}
                <Icon icon="solar:arrow-right-linear" className="ml-1 w-5 h-5" />
              </Link>
              {current.ctaSecondary && (
                <Link
                  href={current.ctaSecondary.href}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-full border border-primary hover:bg-primary/5 transition-colors"
                >
                  {current.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 슬라이드 이미지 영역 */}
        <FadeIn delay={100}>
          <div className="relative">
            <div
              className="relative rounded-3xl overflow-hidden shadow-card"
              style={{ aspectRatio: '16/9' }}
            >
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <MediaSlot
                    vendor="wooripen"
                    usage="scene"
                    subject={slide.subject}
                    number="01"
                    aspect="16/9"
                    label={slide.label}
                    hint={slide.hint}
                    icon={slide.icon}
                    priority={i === 0}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>
              ))}
            </div>

            {/* 인디케이터 — WCAG 44px 터치타겟 확보 (시각은 기존 유지, 히트영역만 확장) */}
            <div className="mt-4 md:mt-6 flex items-center justify-center gap-1">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`슬라이드 ${i + 1}로 이동`}
                  className="inline-flex items-center justify-center p-3"
                >
                  <span
                    className={`block transition-all rounded-full ${
                      i === index
                        ? 'w-8 h-2 bg-primary'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

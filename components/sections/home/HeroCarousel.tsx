'use client'

// ─────────────────────────────────────────────
// 히어로 캐러셀 (페이히어 벤치마크)
//  - 헤드카피 고정 + 하단에 5개 유스케이스 슬라이드
//  - embla 대신 CSS scroll-snap + 자동 재생 + 수동 네비게이션
//  - 이미지는 전부 MediaSlot → 플레이스홀더로 시작
//
// 인라인 편집 (2026-04-21) :
//  - 슬라이드당 5개 블록 키 : eyebrow, title_line1, title_line2, cta_primary, cta_secondary
//  - 원 JSX title 은 "일반 텍스트 + <br> + primary 색 하이라이트" 2단 구조라
//    title_line1 / title_line2 로 분해 (Phase A 와 동일 패턴)
//  - 블록 키 prefix : home.hero.{keyBase}.{field}
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import MediaSlot from '@/components/ui/MediaSlot'
import FadeIn from '@/components/ui/FadeIn'
import { EditableText } from '@/components/editable/EditableText'
import { EditableLink } from '@/components/editable/EditableLink'
import { useBlocks } from '@/components/editable/BlocksProvider'
import { pickTextOrUndef, pickLinkOrUndef, pickImageOrUndef, type LinkValue } from '@/lib/content-blocks'

interface Slide {
  /** 블록 키 prefix — "slide1" ~ "slide5" */
  keyBase: string
  defaultEyebrow: string
  /** 타이틀 1줄 (일반 색) */
  defaultTitleLine1: string
  /** 타이틀 2줄 (primary 하이라이트) */
  defaultTitleLine2: string
  defaultCtaPrimary: LinkValue
  defaultCtaSecondary?: LinkValue
  // MediaSlot 파라미터
  subject: string
  label: string
  hint: string
  icon: string
}

const SLIDES: Slide[] = [
  {
    keyBase: 'slide1',
    defaultEyebrow: '신규 창업',
    defaultTitleLine1: '카페 창업 준비 중?',
    defaultTitleLine2: '필요한 건 전부 월 3만원대로.',
    defaultCtaPrimary: { label: '창업 패키지 상담', href: '/internet', target: '_self' },
    defaultCtaSecondary: { label: '견적 받기', href: '#consult', target: '_self' },
    subject: 'hero-startup-cafe',
    label: '히어로 1 — 카페 창업 장면',
    hint: '매장 오픈 준비 실사 · 1920×1080+',
    icon: 'solar:shop-bold-duotone',
  },
  {
    keyBase: 'slide2',
    defaultEyebrow: 'CCTV 교체',
    defaultTitleLine1: '낡은 CCTV,',
    defaultTitleLine2: '4K로 바꾸고 유지비는 줄이기.',
    defaultCtaPrimary: { label: 'CCTV 상담', href: '/business/cctv', target: '_self' },
    defaultCtaSecondary: { label: '요금 비교', href: '/business/cctv', target: '_self' },
    subject: 'hero-cctv-upgrade',
    label: '히어로 2 — CCTV 설치 현장',
    hint: '매장 천장 CCTV 실사 · 1920×1080+',
    icon: 'solar:videocamera-record-bold-duotone',
  },
  {
    keyBase: 'slide3',
    defaultEyebrow: '키오스크 도입',
    defaultTitleLine1: '인건비는 낮추고',
    defaultTitleLine2: '주문 회전율은 올리기.',
    defaultCtaPrimary: { label: '키오스크 상담', href: '/business/torder', target: '_self' },
    defaultCtaSecondary: { label: '사례 보기', href: '#cases', target: '_self' },
    subject: 'hero-kiosk',
    label: '히어로 3 — 키오스크 주문 장면',
    hint: '고객 키오스크 이용 실사 · 1920×1080+',
    icon: 'solar:tablet-bold-duotone',
  },
  {
    keyBase: 'slide4',
    defaultEyebrow: '렌탈 갈아타기',
    defaultTitleLine1: '지금 쓰는 단말기,',
    defaultTitleLine2: '우리편이 더 저렴합니다.',
    defaultCtaPrimary: { label: '단말기 비교', href: '/business/terminal', target: '_self' },
    defaultCtaSecondary: { label: '상담 신청', href: '#consult', target: '_self' },
    subject: 'hero-terminal',
    label: '히어로 4 — 카드단말기 클로즈업',
    hint: '결제 단말기 실사 · 1920×1080+',
    icon: 'solar:card-recive-bold-duotone',
  },
  {
    keyBase: 'slide5',
    defaultEyebrow: '테이블 오더',
    defaultTitleLine1: '네이버 리뷰 연동되는',
    defaultTitleLine2: '테이블 오더, 써보셨어요?',
    defaultCtaPrimary: { label: '테이블 오더 상담', href: '/business/torder', target: '_self' },
    defaultCtaSecondary: { label: '도입 사례', href: '#cases', target: '_self' },
    subject: 'hero-tableorder',
    label: '히어로 5 — 테이블 오더 사용 장면',
    hint: '식탁 위 태블릿 주문 실사 · 1920×1080+',
    icon: 'solar:chat-round-dots-bold-duotone',
  },
]

const AUTO_INTERVAL = 5000 // 5초

export default function HeroCarousel() {
  // BlocksProvider 로부터 주입된 홈 블록 — 각 슬라이드 DB 값 꺼낼 때 사용
  const blocks = useBlocks()

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

  // 현재 슬라이드의 CTA DB 값 (없으면 defaults)
  const ctaPrimaryValue   = pickLinkOrUndef(blocks, `home.hero.${current.keyBase}.cta_primary`)
  const ctaPrimary        = ctaPrimaryValue ?? current.defaultCtaPrimary
  const ctaSecondaryValue = pickLinkOrUndef(blocks, `home.hero.${current.keyBase}.cta_secondary`)
  const ctaSecondary      = ctaSecondaryValue ?? current.defaultCtaSecondary

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
            {/* eyebrow — 상단 뱃지 */}
            <span className="inline-block px-3 py-1 text-xs md:text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
              <EditableText
                blockKey={`home.hero.${current.keyBase}.eyebrow`}
                as="span"
                value={pickTextOrUndef(blocks, `home.hero.${current.keyBase}.eyebrow`)}
                fallback={current.defaultEyebrow}
                pagePath="/"
              />
            </span>

            {/* 타이틀 — 2단 분해 (일반 + primary 하이라이트) */}
            {/* min-h는 슬라이드 전환 시 높이 점프 방지용 — 모바일에선 tight하게 */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight min-h-[2.5em] md:min-h-[3em] break-keep">
              <EditableText
                blockKey={`home.hero.${current.keyBase}.title_line1`}
                as="span"
                value={pickTextOrUndef(blocks, `home.hero.${current.keyBase}.title_line1`)}
                fallback={current.defaultTitleLine1}
                pagePath="/"
              />
              <br className="hidden sm:inline" />
              {' '}
              <EditableText
                blockKey={`home.hero.${current.keyBase}.title_line2`}
                as="span"
                value={pickTextOrUndef(blocks, `home.hero.${current.keyBase}.title_line2`)}
                fallback={current.defaultTitleLine2}
                pagePath="/"
                className="text-primary"
              />
            </h1>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {/* 1차 CTA — label + href 둘 다 편집 가능 */}
              <EditableLink
                blockKey={`home.hero.${current.keyBase}.cta_primary`}
                fallback={current.defaultCtaPrimary}
                value={ctaPrimaryValue}
                pagePath="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
              >
                {ctaPrimary.label}
                <Icon icon="solar:arrow-right-linear" className="ml-1 w-5 h-5" />
              </EditableLink>

              {/* 2차 CTA — 있을 때만 */}
              {current.defaultCtaSecondary && (
                <EditableLink
                  blockKey={`home.hero.${current.keyBase}.cta_secondary`}
                  fallback={current.defaultCtaSecondary}
                  value={ctaSecondaryValue}
                  pagePath="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-full border border-primary hover:bg-primary/5 transition-colors"
                >
                  {ctaSecondary?.label ?? current.defaultCtaSecondary.label}
                </EditableLink>
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
              {SLIDES.map((slide, i) => {
                // 각 슬라이드 이미지 블록키 — home.hero.slide{1..5}.image
                const imgKey = `home.hero.${slide.keyBase}.image`
                return (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <MediaSlot
                      blockKey={imgKey}
                      value={pickImageOrUndef(blocks, imgKey)}
                      pagePath="/"
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
                )
              })}
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

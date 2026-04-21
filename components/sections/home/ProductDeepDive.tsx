'use client'

// ─────────────────────────────────────────────
// 제품 딥다이브 섹션 (페이히어 "페이히어 터미널" 포맷 벤치마크)
//  - 제품 1개 × 특징 4~5개 × 스펙 이미지 1~2개 = 섹션당 5슬롯
//  - 홈에서 3개 제품 반복 사용 (카드단말기 / 키오스크 / CCTV)
// ─────────────────────────────────────────────

import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'

export interface ProductFeature {
  title: string
  desc: string
  icon: string
  // 각 특징당 작은 이미지 슬롯 (선택)
  subject?: string
  vendor?: 'wooripen' | 'tossplace' | 'torder'
}

export interface ProductSpec {
  label: string       // "467g 초경량"
  value: string       // "휴대폰처럼 직관"
}

export interface ProductDeepDiveProps {
  eyebrow: string       // 섹션 상단 뱃지
  title: React.ReactNode // 섹션 제목
  accentClass?: string  // 제목 강조 색 (기본: primary)
  // 메인 히어로컷 (왼쪽 대형 이미지)
  vendor: 'wooripen' | 'tossplace' | 'torder'
  mainSubject: string
  mainLabel: string
  mainHint: string
  mainIcon: string
  // 특징 카드 4~5개
  features: ProductFeature[]
  // 스펙 하이라이트 (선택)
  specs?: ProductSpec[]
  // CTA
  ctaLabel: string
  ctaHref: string
  // 배경 테마
  bgClass?: string
  // 섹션 앵커 id (링크용)
  id?: string
  // 레이아웃 방향 (좌↔우 교대 연출용)
  reverse?: boolean
}

export default function ProductDeepDive({
  eyebrow,
  title,
  accentClass = 'text-primary',
  vendor,
  mainSubject,
  mainLabel,
  mainHint,
  mainIcon,
  features,
  specs,
  ctaLabel,
  ctaHref,
  bgClass = 'bg-gray-50',
  id,
  reverse = false,
}: ProductDeepDiveProps) {
  return (
    <section id={id} className={`py-16 md:py-28 ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* 상단 헤드 */}
        <FadeIn>
          <div className={`max-w-3xl ${reverse ? 'md:ml-auto md:text-right' : ''}`}>
            <span className={`inline-block px-3 py-1 text-xs md:text-sm font-semibold ${accentClass} bg-white/80 rounded-full mb-4`}>
              {eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight break-keep">
              {title}
            </h2>
          </div>
        </FadeIn>

        {/* 메인 영역: 좌 이미지 / 우 특징 */}
        <div
          className={`mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          {/* 좌: 메인 제품컷 */}
          <FadeIn delay={60} direction={reverse ? 'right' : 'left'}>
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <MediaSlot
                vendor={vendor}
                usage="product"
                subject={mainSubject}
                number="01"
                aspect="4/3"
                label={mainLabel}
                hint={mainHint}
                icon={mainIcon}
                sizes="(max-width: 1024px) 100vw, 50vw"
                fit="cover"
              />
            </div>

            {/* 스펙 하이라이트 (선택) */}
            {specs && specs.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 md:p-4 rounded-2xl bg-white border border-gray-100"
                  >
                    <div className="text-base md:text-lg font-bold text-gray-900 leading-tight break-keep">
                      {spec.label}
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-gray-500 leading-tight break-keep">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FadeIn>

          {/* 우: 특징 리스트 */}
          <FadeIn delay={120} direction={reverse ? 'left' : 'right'}>
            <ul className="space-y-5 md:space-y-6">
              {features.map((f, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon icon={f.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 break-keep">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                {ctaLabel}
                <Icon icon="solar:arrow-right-linear" className="ml-1 w-5 h-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

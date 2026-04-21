'use client'

// ─────────────────────────────────────────────
// 카테고리 4카드 섹션 (페이히어 BEST/EVENT/HOT/NEW 벤치마크)
//  - 4개 주요 제품군을 뱃지와 함께 강조
//  - 각 카드 상단에 MediaSlot (제품 대표컷)
// ─────────────────────────────────────────────

import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'

interface CategoryCard {
  badge: { label: string; color: string }
  title: string
  subtitle: string
  href: string
  cta: string
  // MediaSlot 파라미터
  vendor: 'wooripen' | 'tossplace' | 'torder'
  subject: string
  slotLabel: string
  slotHint: string
  icon: string
  accentBg: string
}

const CARDS: CategoryCard[] = [
  {
    badge: { label: 'BEST', color: 'bg-primary text-white' },
    title: '카드 단말기',
    subtitle: '월 렌탈 0원부터, 업종별 최저가',
    href: '/business/terminal',
    cta: '단말기 비교',
    vendor: 'tossplace',
    subject: 'pcpos',
    slotLabel: '카드단말기 대표컷',
    slotHint: '단독 제품샷 · 4:3',
    icon: 'solar:card-recive-bold-duotone',
    accentBg: 'from-violet-50 to-purple-50',
  },
  {
    badge: { label: 'EVENT', color: 'bg-[#F04452] text-white' },
    title: '테이블 오더',
    subtitle: '네이버 리뷰 연동 · 50% 도입 할인',
    href: '/business/torder',
    cta: '티오더 상담',
    vendor: 'torder',
    subject: 'tabletfixed',
    slotLabel: '테이블오더 거치대',
    slotHint: '식탁 위 태블릿 · 4:3',
    icon: 'solar:tablet-bold-duotone',
    accentBg: 'from-rose-50 to-orange-50',
  },
  {
    badge: { label: 'HOT', color: 'bg-orange-500 text-white' },
    title: '키오스크',
    subtitle: '무인 주문 도입, 인건비 평균 35% 절감',
    href: '/business/kiosk',
    cta: '키오스크 상담',
    vendor: 'tossplace',
    subject: 'kiosk',
    slotLabel: '키오스크 대표컷',
    slotHint: '매장 키오스크 목업 · 4:3',
    icon: 'solar:monitor-smartphone-bold-duotone',
    accentBg: 'from-emerald-50 to-teal-50',
  },
  {
    badge: { label: 'NEW', color: 'bg-gray-900 text-white' },
    title: '인터넷 + CCTV 패키지',
    subtitle: 'SKT · KT · LG U+ 전사 월 3만원대',
    href: '/internet',
    cta: '패키지 보기',
    vendor: 'wooripen',
    subject: 'internet-package',
    slotLabel: '인터넷+CCTV 패키지컷',
    slotHint: '매장 공유기+CCTV 실사 · 4:3',
    icon: 'solar:wi-fi-router-bold-duotone',
    accentBg: 'from-sky-50 to-blue-50',
  },
]

export default function CategoryCards() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 break-keep">
              매장에 필요한 모든 것
              <br className="md:hidden" />
              <span className="text-primary"> 한 번에 해결</span>
            </h2>
            <p className="mt-3 text-gray-600 text-sm md:text-base break-keep">
              결제·주문·CCTV·인터넷까지. 우리편이 골라 드릴게요.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CARDS.map((card, i) => (
            <FadeIn key={card.title} delay={i * 80}>
              <Link
                href={card.href}
                className="group relative block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* 배지 */}
                <span
                  className={`absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-md ${card.badge.color}`}
                >
                  {card.badge.label}
                </span>

                {/* 이미지 영역 */}
                <div className={`bg-gradient-to-br ${card.accentBg}`}>
                  <MediaSlot
                    vendor={card.vendor}
                    usage="product"
                    subject={card.subject}
                    number="01"
                    aspect="4/3"
                    label={card.slotLabel}
                    hint={card.slotHint}
                    icon={card.icon}
                    fit="contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>

                {/* 텍스트 */}
                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 break-keep">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 break-keep">
                    {card.subtitle}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    {card.cta}
                    <Icon
                      icon="solar:arrow-right-linear"
                      className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

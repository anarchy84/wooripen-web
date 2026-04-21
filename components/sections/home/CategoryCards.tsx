'use client'

// ─────────────────────────────────────────────
// 카테고리 4카드 섹션 (페이히어 BEST/EVENT/HOT/NEW 벤치마크)
//  - 4개 주요 제품군을 뱃지와 함께 강조
//  - 각 카드 상단에 MediaSlot (제품 대표컷)
//
// 인라인 편집 (2026-04-21) :
//  - 섹션 헤더 : title_line1, title_line2 (primary 하이라이트), sub
//  - 카드 4장 × (title + subtitle + cta_label) = 12
//  - Link 는 카드 전체 네비게이션이라 EditableLink 분리 대신 "레이블만" 편집
//    (href 변경은 드물고 필요시 어드민에서 URL 리다이렉트로 처리)
//  - 블록 키 : home.category.header.* / home.category.{keyBase}.*
// ─────────────────────────────────────────────

import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'
import { EditableText } from '@/components/editable/EditableText'
import { useBlocks } from '@/components/editable/BlocksProvider'
import { pickTextOrUndef, pickImageOrUndef } from '@/lib/content-blocks'

interface CategoryCard {
  /** 블록 키 prefix (제품 대표 단어) */
  keyBase: string
  badge: { label: string; color: string }
  defaultTitle: string
  defaultSubtitle: string
  defaultCta: string
  href: string
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
    keyBase: 'terminal',
    badge: { label: 'BEST', color: 'bg-primary text-white' },
    defaultTitle: '카드 단말기',
    defaultSubtitle: '월 렌탈 0원부터, 업종별 최저가',
    defaultCta: '단말기 비교',
    href: '/business/terminal',
    vendor: 'tossplace',
    subject: 'pcpos',
    slotLabel: '카드단말기 대표컷',
    slotHint: '단독 제품샷 · 4:3',
    icon: 'solar:card-recive-bold-duotone',
    accentBg: 'from-violet-50 to-purple-50',
  },
  {
    keyBase: 'torder',
    badge: { label: 'EVENT', color: 'bg-[#F04452] text-white' },
    defaultTitle: '테이블 오더',
    defaultSubtitle: '네이버 리뷰 연동 · 50% 도입 할인',
    defaultCta: '티오더 상담',
    href: '/business/torder',
    vendor: 'torder',
    subject: 'tabletfixed',
    slotLabel: '테이블오더 거치대',
    slotHint: '식탁 위 태블릿 · 4:3',
    icon: 'solar:tablet-bold-duotone',
    accentBg: 'from-rose-50 to-orange-50',
  },
  {
    keyBase: 'kiosk',
    badge: { label: 'HOT', color: 'bg-orange-500 text-white' },
    defaultTitle: '키오스크',
    defaultSubtitle: '무인 주문 도입, 인건비 평균 35% 절감',
    defaultCta: '키오스크 상담',
    href: '/business/kiosk',
    vendor: 'tossplace',
    subject: 'kiosk',
    slotLabel: '키오스크 대표컷',
    slotHint: '매장 키오스크 목업 · 4:3',
    icon: 'solar:monitor-smartphone-bold-duotone',
    accentBg: 'from-emerald-50 to-teal-50',
  },
  {
    keyBase: 'bundle',
    badge: { label: 'NEW', color: 'bg-gray-900 text-white' },
    defaultTitle: '인터넷 + CCTV 패키지',
    defaultSubtitle: 'SKT · KT · LG U+ 전사 월 3만원대',
    defaultCta: '패키지 보기',
    href: '/internet',
    vendor: 'wooripen',
    subject: 'internet-package',
    slotLabel: '인터넷+CCTV 패키지컷',
    slotHint: '매장 공유기+CCTV 실사 · 4:3',
    icon: 'solar:wi-fi-router-bold-duotone',
    accentBg: 'from-sky-50 to-blue-50',
  },
]

export default function CategoryCards() {
  const blocks = useBlocks()

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* 섹션 헤더 — 2단 타이틀 (일반 + primary 하이라이트) + 서브카피 */}
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 break-keep">
              <EditableText
                blockKey="home.category.header.title_line1"
                as="span"
                value={pickTextOrUndef(blocks, 'home.category.header.title_line1')}
                fallback="매장에 필요한 모든 것"
                pagePath="/"
              />
              <br className="md:hidden" />
              {' '}
              <EditableText
                blockKey="home.category.header.title_line2"
                as="span"
                value={pickTextOrUndef(blocks, 'home.category.header.title_line2')}
                fallback="한 번에 해결"
                pagePath="/"
                className="text-primary"
              />
            </h2>
            <EditableText
              blockKey="home.category.header.sub"
              as="p"
              value={pickTextOrUndef(blocks, 'home.category.header.sub')}
              fallback="결제·주문·CCTV·인터넷까지. 우리편이 골라 드릴게요."
              pagePath="/"
              className="mt-3 text-gray-600 text-sm md:text-base break-keep"
            />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CARDS.map((card, i) => (
            <FadeIn key={card.keyBase} delay={i * 80}>
              <Link
                href={card.href}
                className="group relative block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* 배지 — 카드 식별용 고정 라벨 (BEST/EVENT/HOT/NEW) 편집 없음 */}
                <span
                  className={`absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-md ${card.badge.color}`}
                >
                  {card.badge.label}
                </span>

                {/* 이미지 영역 — blockKey 로 DB 이미지 연결, hover 시 ✏️ 업로드 */}
                <div className={`bg-gradient-to-br ${card.accentBg}`}>
                  <MediaSlot
                    blockKey={`home.category.${card.keyBase}.image`}
                    value={pickImageOrUndef(blocks, `home.category.${card.keyBase}.image`)}
                    pagePath="/"
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

                {/* 텍스트 — title / subtitle / cta 모두 편집 가능 */}
                <div className="p-5 md:p-6">
                  <EditableText
                    blockKey={`home.category.${card.keyBase}.title`}
                    as="h3"
                    value={pickTextOrUndef(blocks, `home.category.${card.keyBase}.title`)}
                    fallback={card.defaultTitle}
                    pagePath="/"
                    className="text-lg md:text-xl font-bold text-gray-900 mb-1 break-keep"
                  />
                  <EditableText
                    blockKey={`home.category.${card.keyBase}.subtitle`}
                    as="p"
                    value={pickTextOrUndef(blocks, `home.category.${card.keyBase}.subtitle`)}
                    fallback={card.defaultSubtitle}
                    pagePath="/"
                    className="text-sm text-gray-600 mb-4 line-clamp-2 break-keep"
                  />
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    <EditableText
                      blockKey={`home.category.${card.keyBase}.cta`}
                      as="span"
                      value={pickTextOrUndef(blocks, `home.category.${card.keyBase}.cta`)}
                      fallback={card.defaultCta}
                      pagePath="/"
                    />
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

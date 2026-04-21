'use client'

// ─────────────────────────────────────────────
// 업종별 타일 4개 (페이히어 "업종 바로가기" 벤치마크)
//  - 음식점 / 카페·베이커리 / 도소매 / 서비스업 4개 카드
//  - 각 타일에 매장 실사 이미지 + 체크리스트 3줄 + 업종 상담 CTA
//  - 홈에서 업종 랜딩/패키지로 드랍다운 없이 바로 진입
//
// 인라인 편집 (2026-04-21) :
//  - 섹션 헤더 : eyebrow, title_line1(일반), title_line2(primary), sub
//  - 타일 4개 × (title + tagline + cta) = 12
//  - bullets 3줄은 반복 배열 + 다음 패스에서 이미지 편집과 묶어 정리
//  - 블록 키 : home.industry.header.* / home.industry.{slug}.*
// ─────────────────────────────────────────────

import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'
import { EditableText } from '@/components/editable/EditableText'
import { useBlocks } from '@/components/editable/BlocksProvider'
import { pickTextOrUndef, pickImageOrUndef } from '@/lib/content-blocks'

interface IndustryTile {
  slug: string           // 블록 키 prefix 역할
  defaultTitle: string           // "음식점"
  defaultTagline: string         // 한 줄 설명
  bullets: string[]              // 체크리스트 3개 (이번 패스 비편집)
  href: string
  defaultCta: string
  subject: string                // MediaSlot subject
  icon: string
  accent: string                 // 그라데이션 tailwind class
}

const TILES: IndustryTile[] = [
  {
    slug: 'food',
    defaultTitle: '음식점',
    defaultTagline: '주문·결제·리뷰까지 한 번에',
    bullets: [
      '테이블오더 + POS 통합',
      'CCTV 4K + 녹화 30일 보관',
      '네이버 리뷰 자동 연동',
    ],
    href: '/industry/food',
    defaultCta: '음식점 패키지 보기',
    subject: 'industry-food',
    icon: 'solar:dish-bold-duotone',
    accent: 'from-rose-100 to-orange-50',
  },
  {
    slug: 'cafe',
    defaultTitle: '카페 · 베이커리',
    defaultTagline: '창업부터 운영까지 月 3만원대',
    bullets: [
      '인터넷 + CCTV 번들',
      '키오스크 + 포스 통합',
      '배달앱 주문 자동 취합',
    ],
    href: '/industry/cafe',
    defaultCta: '카페 패키지 보기',
    subject: 'industry-cafe',
    icon: 'solar:cup-hot-bold-duotone',
    accent: 'from-amber-50 to-yellow-50',
  },
  {
    slug: 'retail',
    defaultTitle: '도소매 · 편의점',
    defaultTagline: '재고·결제·고객관리 자동화',
    bullets: [
      '바코드 POS + 재고 연동',
      'CCTV + 인터넷 월 렌탈',
      '단말기 수수료 최저가',
    ],
    href: '/industry/retail',
    defaultCta: '도소매 패키지 보기',
    subject: 'industry-retail',
    icon: 'solar:cart-3-bold-duotone',
    accent: 'from-sky-50 to-cyan-50',
  },
  {
    slug: 'service',
    defaultTitle: '서비스업',
    defaultTagline: '예약·결제·관리까지 한곳에서',
    bullets: [
      '예약 관리 시스템 연동',
      '고객 DB 자동 수집',
      '모바일 결제 + 키오스크',
    ],
    href: '/industry/service',
    defaultCta: '서비스업 패키지 보기',
    subject: 'industry-service',
    icon: 'solar:scissors-square-bold-duotone',
    accent: 'from-violet-50 to-fuchsia-50',
  },
]

export default function IndustryTiles() {
  const blocks = useBlocks()

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs md:text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
              <Icon icon="solar:buildings-2-bold-duotone" className="w-4 h-4" />
              <EditableText
                blockKey="home.industry.header.eyebrow"
                as="span"
                value={pickTextOrUndef(blocks, 'home.industry.header.eyebrow')}
                fallback="업종별 맞춤 패키지"
                pagePath="/"
              />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 break-keep">
              <EditableText
                blockKey="home.industry.header.title_line1"
                as="span"
                value={pickTextOrUndef(blocks, 'home.industry.header.title_line1')}
                fallback="내 업종에 딱 맞는 "
                pagePath="/"
              />
              <EditableText
                blockKey="home.industry.header.title_line2"
                as="span"
                value={pickTextOrUndef(blocks, 'home.industry.header.title_line2')}
                fallback="솔루션"
                pagePath="/"
                className="text-primary"
              />
            </h2>
            <EditableText
              blockKey="home.industry.header.sub"
              as="p"
              value={pickTextOrUndef(blocks, 'home.industry.header.sub')}
              fallback="업종별로 무엇이 꼭 필요하고 어떻게 엮이는지, 우리편이 정리해 드릴게요."
              pagePath="/"
              className="mt-3 text-gray-600 text-sm md:text-base break-keep"
            />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TILES.map((tile, i) => (
            <FadeIn key={tile.slug} delay={i * 80}>
              <Link
                href={tile.href}
                className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* 이미지 슬롯 — blockKey 로 DB 연결, hover 시 ✏️ 업로드 */}
                <div className={`bg-gradient-to-br ${tile.accent}`}>
                  <MediaSlot
                    blockKey={`home.industry.${tile.slug}.image`}
                    value={pickImageOrUndef(blocks, `home.industry.${tile.slug}.image`)}
                    pagePath="/"
                    vendor="wooripen"
                    usage="scene"
                    subject={tile.subject}
                    number="01"
                    aspect="4/3"
                    label={`${tile.defaultTitle} 매장 실사`}
                    hint="매장 운영 장면 · 4:3"
                    icon={tile.icon}
                    fit="cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>

                {/* 본문 — title / tagline / cta 편집 가능, bullets 는 다음 패스 */}
                <div className="flex-1 flex flex-col p-5 md:p-6">
                  <EditableText
                    blockKey={`home.industry.${tile.slug}.title`}
                    as="h3"
                    value={pickTextOrUndef(blocks, `home.industry.${tile.slug}.title`)}
                    fallback={tile.defaultTitle}
                    pagePath="/"
                    className="text-lg md:text-xl font-bold text-gray-900 break-keep"
                  />
                  <EditableText
                    blockKey={`home.industry.${tile.slug}.tagline`}
                    as="p"
                    value={pickTextOrUndef(blocks, `home.industry.${tile.slug}.tagline`)}
                    fallback={tile.defaultTagline}
                    pagePath="/"
                    className="mt-1 text-sm text-gray-600 break-keep"
                  />

                  <ul className="mt-4 space-y-2 flex-1">
                    {tile.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-700 break-keep">
                        <Icon
                          icon="solar:check-circle-bold"
                          className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-semibold text-primary">
                    <EditableText
                      blockKey={`home.industry.${tile.slug}.cta`}
                      as="span"
                      value={pickTextOrUndef(blocks, `home.industry.${tile.slug}.cta`)}
                      fallback={tile.defaultCta}
                      pagePath="/"
                    />
                    <Icon
                      icon="solar:arrow-right-linear"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

// ─────────────────────────────────────────────
// 뉴스룸 카드 그리드 (페이히어 "Newsroom" 벤치마크)
//  - 5장 카드: 대형 1 + 소형 4 배치 (또는 모바일에서 단일 스크롤)
//  - 각 카드에 썸네일 MediaSlot + 카테고리 뱃지 + 날짜 + 제목
//  - 지금은 정적 더미 데이터 → Phase 3에서 Supabase news 테이블 연결
//
// 인라인 편집 (2026-04-21) :
//  - 섹션 헤더만 편집 대상 : eyebrow, title_line1(일반), title_line2(primary), sub, all_link
//  - 뉴스 카드 본문(카테고리/날짜/제목/발췌) 은 Phase 3 Supabase news 테이블 연결 후
//    어드민 CMS 로 관리 (이번 패스에서 블록키로 잡으면 DB 마이그레이션 때 꼬임)
//  - 블록 키 : home.news.header.* / home.news.all_link
// ─────────────────────────────────────────────

import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'
import { EditableText } from '@/components/editable/EditableText'
import { EditableLink } from '@/components/editable/EditableLink'
import { useBlocks } from '@/components/editable/BlocksProvider'
import { pickTextOrUndef, pickLinkOrUndef } from '@/lib/content-blocks'

interface NewsCard {
  category: string        // "공지" / "이벤트" / "도입사례" / "가이드"
  categoryColor: string   // tailwind class
  date: string            // "2026-04-10"
  title: string
  excerpt?: string        // 대형 카드만 사용
  href: string
  subject: string         // MediaSlot subject
  icon: string
}

const NEWS: NewsCard[] = [
  {
    category: '이벤트',
    categoryColor: 'bg-rose-100 text-rose-700',
    date: '2026-04-18',
    title: '신규 창업 사장님 대상 인터넷+CCTV 패키지 월 3만원대 프로모션',
    excerpt:
      '카페·음식점 신규 창업 시 필수 장비를 월 3만원대로. 초기 설치비 0원, 36개월 약정.',
    href: '/news/promo-starter-2026',
    subject: 'news-promo-starter',
    icon: 'solar:confetti-bold-duotone',
  },
  {
    category: '도입사례',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    date: '2026-04-12',
    title: '고깃집 화로온 — 테이블오더 도입 후 회전율 28% 상승',
    href: '/news/case-hwaroon',
    subject: 'news-case-hwaroon',
    icon: 'solar:chart-square-bold-duotone',
  },
  {
    category: '공지',
    categoryColor: 'bg-sky-100 text-sky-700',
    date: '2026-04-08',
    title: '티오더 테이블오더 50% 도입 할인 이벤트 시작',
    href: '/news/torder-event',
    subject: 'news-torder-event',
    icon: 'solar:tablet-bold-duotone',
  },
  {
    category: '가이드',
    categoryColor: 'bg-violet-100 text-violet-700',
    date: '2026-04-02',
    title: '카페 창업 준비 체크리스트 — 장비·통신·결제 한눈에',
    href: '/news/guide-cafe-starter',
    subject: 'news-guide-cafe',
    icon: 'solar:checklist-bold-duotone',
  },
  {
    category: '도입사례',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    date: '2026-03-27',
    title: '베이커리 햇살결 — CCTV 4K 교체로 유지비 40% 절감',
    href: '/news/case-haetsal',
    subject: 'news-case-haetsal',
    icon: 'solar:videocamera-record-bold-duotone',
  },
]

export default function NewsroomCards() {
  const blocks = useBlocks()
  const [featured, ...rest] = NEWS

  // "전체 보기" 링크 — 데스크톱/모바일 공용 (편집값은 한 군데서 관리)
  const allLinkFallback = { label: '전체 보기', href: '/news', target: '_self' as const }
  const allLinkValue = pickLinkOrUndef(blocks, 'home.news.all_link')

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeIn>
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs md:text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
                <Icon icon="solar:notebook-bold-duotone" className="w-4 h-4" />
                <EditableText
                  blockKey="home.news.header.eyebrow"
                  as="span"
                  value={pickTextOrUndef(blocks, 'home.news.header.eyebrow')}
                  fallback="뉴스룸"
                  pagePath="/"
                />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 break-keep">
                <EditableText
                  blockKey="home.news.header.title_line1"
                  as="span"
                  value={pickTextOrUndef(blocks, 'home.news.header.title_line1')}
                  fallback="우리편의 "
                  pagePath="/"
                />
                <EditableText
                  blockKey="home.news.header.title_line2"
                  as="span"
                  value={pickTextOrUndef(blocks, 'home.news.header.title_line2')}
                  fallback="최근 소식"
                  pagePath="/"
                  className="text-primary"
                />
              </h2>
              <EditableText
                blockKey="home.news.header.sub"
                as="p"
                value={pickTextOrUndef(blocks, 'home.news.header.sub')}
                fallback="이벤트·도입사례·운영 가이드까지, 사장님께 꼭 필요한 소식만 모았어요."
                pagePath="/"
                className="mt-3 text-gray-600 text-sm md:text-base break-keep"
              />
            </div>
            {/* 데스크톱 "전체 보기" — label + href 편집 가능 */}
            <EditableLink
              blockKey="home.news.all_link"
              fallback={allLinkFallback}
              value={allLinkValue}
              pagePath="/"
              className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
            >
              {(allLinkValue?.label ?? allLinkFallback.label)}
              <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
            </EditableLink>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* 좌: 대형 피처 카드 */}
          <FadeIn delay={40}>
            <Link
              href={featured.href}
              className="group block h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <MediaSlot
                vendor="wooripen"
                usage="scene"
                subject={featured.subject}
                number="01"
                aspect="16/9"
                label={`뉴스 피처 — ${featured.title}`}
                hint="대표 썸네일 · 16:9"
                icon={featured.icon}
                fit="cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md ${featured.categoryColor}`}
                  >
                    {featured.category}
                  </span>
                  <span className="text-xs text-gray-500">{featured.date}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors break-keep">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3 break-keep">
                    {featured.excerpt}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  자세히 보기
                  <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </FadeIn>

          {/* 우: 4개 소형 카드 2×2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {rest.map((n, i) => (
              <FadeIn key={n.href} delay={80 + i * 60}>
                <Link
                  href={n.href}
                  className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <MediaSlot
                    vendor="wooripen"
                    usage="scene"
                    subject={n.subject}
                    number="01"
                    aspect="4/3"
                    label={`뉴스 썸네일 — ${n.title}`}
                    hint="썸네일 · 4:3"
                    icon={n.icon}
                    fit="cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="flex-1 flex flex-col p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${n.categoryColor}`}
                      >
                        {n.category}
                      </span>
                      <span className="text-[10px] text-gray-500">{n.date}</span>
                    </div>
                    <h4 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors break-keep">
                      {n.title}
                    </h4>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* 모바일 전체보기 링크 — 데스크톱과 같은 블록 키 공유 (EditableLink 중복 편집 오버레이 방지용 Link 로 처리) */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href={allLinkValue?.href ?? allLinkFallback.href}
            target={allLinkValue?.target ?? allLinkFallback.target}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            {allLinkValue?.label ?? allLinkFallback.label}
            <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

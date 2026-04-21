'use client'

// ─────────────────────────────────────────────
// 소셜프루프 카드 슬라이더 (페이히어 8개 업종 후기 벤치마크)
//  - "85,000+ 사장님이 선택" 스타일 큰 헤드라인 + 가로 스크롤 카드
//  - 각 카드에 사장님 실사 이미지 슬롯 + 후기 1~2줄
// ─────────────────────────────────────────────

import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'

interface Testimonial {
  quote: string
  author: string        // "카페 딥블루레이크"
  industry: string      // "카페"
  subject: string       // MediaSlot subject
  icon: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: '다른 어디보다 가격이 합리적이에요. 초기 비용 걱정이 사라졌습니다.',
    author: '고깃집 화로온',
    industry: '음식점',
    subject: 'testimonial-meat',
    icon: 'solar:fire-bold-duotone',
  },
  {
    quote: '카페 차릴 때 우리편 덕에 인터넷·CCTV·결제 한 번에 해결했어요.',
    author: '카페 블루노트',
    industry: '카페',
    subject: 'testimonial-cafe',
    icon: 'solar:cup-hot-bold-duotone',
  },
  {
    quote: '식당 운영해 본 사람이 설계한 듯 모든 게 편해요.',
    author: '레스토랑 솔밭',
    industry: '레스토랑',
    subject: 'testimonial-restaurant',
    icon: 'solar:dish-bold-duotone',
  },
  {
    quote: '글만 읽을 수 있다면 바로 쓸 정도로 직관적이에요.',
    author: '함박스테이크 필동점',
    industry: '음식점',
    subject: 'testimonial-hamburg',
    icon: 'solar:chef-hat-bold-duotone',
  },
  {
    quote: '포스·키오스크·CCTV·고객관리까지 매장에 필요한 게 다 있어요.',
    author: '베이커리 햇살결',
    industry: '베이커리',
    subject: 'testimonial-bakery',
    icon: 'solar:donut-bold-duotone',
  },
  {
    quote: '궁금한 점 물어보면 바로 답해줘서 믿음이 가요.',
    author: '주점 삼차원',
    industry: '주점',
    subject: 'testimonial-bar',
    icon: 'solar:wineglass-bold-duotone',
  },
  {
    quote: '테이블오더 도입하고 바쁜 시간 회전율이 눈에 띄게 늘었어요.',
    author: '분식 옛날순대',
    industry: '분식',
    subject: 'testimonial-snack',
    icon: 'solar:hamburger-bold-duotone',
  },
  {
    quote: '고객 지향적이고 피드백도 빨라서 계속 쓰게 되네요.',
    author: '꽃집 서해란',
    industry: '꽃집',
    subject: 'testimonial-flower',
    icon: 'solar:flower-bold-duotone',
  },
]

export default function SocialProof() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* 헤드 */}
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs md:text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
              <Icon icon="solar:users-group-rounded-bold-duotone" className="w-4 h-4" />
              사장님들의 선택
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 break-keep">
              <span className="text-primary">전국 사장님</span>이 우리편을 선택하는 이유
            </h2>
            <p className="mt-3 text-gray-600 text-sm md:text-base break-keep">
              음식점부터 꽃집까지, 업종을 가리지 않고 도입되고 있어요.
            </p>
          </div>
        </FadeIn>

        {/* 가로 스크롤 카드 */}
        <FadeIn delay={80}>
          <div className="relative -mx-4 md:-mx-8 overflow-hidden">
            <div
              className="flex gap-4 md:gap-6 overflow-x-auto px-4 md:px-8 pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}
            >
              {TESTIMONIALS.map((t) => (
                <article
                  key={t.author}
                  className="flex-shrink-0 w-[280px] md:w-[320px] snap-start bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden"
                >
                  {/* 사장님 이미지 */}
                  <MediaSlot
                    vendor="wooripen"
                    usage="case"
                    subject={t.subject}
                    number="01"
                    aspect="4/3"
                    label={`${t.author} 사장님`}
                    hint="매장 내 사장님 실사 · 4:3"
                    icon={t.icon}
                    sizes="(max-width: 768px) 80vw, 320px"
                  />

                  {/* 본문 */}
                  <div className="p-5 md:p-6">
                    <Icon
                      icon="solar:quote-up-bold"
                      className="w-6 h-6 text-primary/30 mb-2"
                    />
                    <p className="text-sm md:text-base text-gray-800 leading-relaxed line-clamp-3 break-keep">
                      {t.quote}
                    </p>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {t.author}
                        </div>
                        <div className="text-xs text-gray-500">{t.industry}</div>
                      </div>
                      <div className="flex gap-0.5 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} icon="solar:star-bold" className="w-4 h-4" />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

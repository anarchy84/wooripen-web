// ─────────────────────────────────────────────
// 카테고리 페이지에서 products 테이블 그리드를 그린다.
//
// 사용 :
//   <CategoryProductGrid products={products} accent="blue" eyebrow="..." title="..." />
//
// 색상 토큰은 페이지마다 다르므로 (sky/violet/emerald/orange/cyan) accent prop 으로 받음.
// 슬러그·이미지·가격이 채워진 상품만 자동 렌더링.
// 비어 있으면 섹션 자체를 안 그림 (빈 공간 안 남게).
// ─────────────────────────────────────────────
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import type { CategoryProduct } from '@/lib/category-products'

interface Props {
  products: CategoryProduct[]
  /** 강조 색상 — 카테고리별 (sky/violet/emerald/orange/cyan) */
  accent?: 'sky' | 'violet' | 'emerald' | 'orange' | 'cyan' | 'primary'
  eyebrow?: string
  title?: string
  subtitle?: string
  /** 추가 카드 (예: 패키지 안내) — 그리드 마지막에 들어감 */
  trailingCard?: React.ReactNode
}

const ACCENT_TOKENS: Record<NonNullable<Props['accent']>, { text: string; ring: string; bg: string }> = {
  sky:      { text: 'text-sky-600',     ring: 'ring-sky-500/20',     bg: 'bg-sky-50' },
  violet:   { text: 'text-violet-600',  ring: 'ring-violet-500/20',  bg: 'bg-violet-50' },
  emerald:  { text: 'text-emerald-600', ring: 'ring-emerald-500/20', bg: 'bg-emerald-50' },
  orange:   { text: 'text-orange-600',  ring: 'ring-orange-500/20',  bg: 'bg-orange-50' },
  cyan:     { text: 'text-cyan-600',    ring: 'ring-cyan-500/20',    bg: 'bg-cyan-50' },
  primary:  { text: 'text-primary',     ring: 'ring-primary/20',     bg: 'bg-primary-50' },
}

export default function CategoryProductGrid({
  products,
  accent = 'primary',
  eyebrow,
  title,
  subtitle,
  trailingCard,
}: Props) {
  if (!products || products.length === 0) return null
  const colors = ACCENT_TOKENS[accent]

  return (
    <section className="section-container section-gap">
      {(eyebrow || title || subtitle) && (
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-10">
            {eyebrow && (
              <span className={`text-sm font-semibold ${colors.text} tracking-wider uppercase`}>
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base text-gray-500 break-keep">{subtitle}</p>
            )}
          </div>
        </FadeIn>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p, i) => {
          const img = p.image_url || p.hero_image
          return (
            <FadeIn key={p.id} delay={i * 60}>
              <Link
                href={`/products/${encodeURIComponent(p.slug)}`}
                className={`group block rounded-3xl bg-white border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 hover:ring-2 hover:${colors.ring} transition-all duration-400 ease-toss overflow-hidden`}
              >
                {/* 이미지 영역 — 데이터 없으면 그라디언트 폴백 */}
                <div className={`relative aspect-video ${colors.bg}`}>
                  {img ? (
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                      이미지 준비 중
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 break-keep">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed break-keep line-clamp-2">
                      {p.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {typeof p.price === 'number' && p.price > 0
                        ? `월 ${p.price.toLocaleString()}원~`
                        : '상담 안내'}
                    </span>
                    <span className="inline-flex items-center text-xs font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
                      자세히
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          )
        })}

        {trailingCard}
      </div>
    </section>
  )
}

// 상품 세부페이지 (Type A 렌더러)
// products 테이블의 slug로 조회 → hero/trust_badges/detail_features/comparison_table/CTA 렌더링
// 모든 섹션은 해당 필드가 채워져 있을 때만 렌더(선택적)

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { Product, TrustBadge, DetailFeature, ComparisonTable } from '@/types/database'

interface Props {
  params: { slug: string }
}

// ─── SEO 메타 ─────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description, seo_title, seo_description, og_image_url, hero_image, image_url')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!data) return { title: '상품을 찾을 수 없습니다' }

  const title = data.seo_title || `${data.name} | 우리편`
  const description = data.seo_description || data.description || ''
  const ogImage = data.og_image_url || data.hero_image || data.image_url || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !product) notFound()

  const p = product as Product
  const trustBadges = (p.trust_badges || []) as TrustBadge[]
  const detailFeatures = (p.detail_features || []) as DetailFeature[]
  const comparison = p.comparison_table as ComparisonTable | null

  const ctaPrimary = p.cta_primary_label || '무료 상담 신청'
  const ctaSecondary = p.cta_secondary_label || null

  return (
    <div className="min-h-screen bg-white">
      {/* ─── 히어로 ─────────────────────────────────── */}
      <section
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={
          p.hero_image
            ? {
                backgroundImage: `linear-gradient(rgba(17,24,39,0.7), rgba(17,24,39,0.85)), url(${p.hero_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)' }
        }
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {p.promo_badge && p.promo_active && (
            <span className="inline-block px-3 py-1 bg-amber-500/90 text-white text-xs font-bold rounded-full mb-4">
              {p.promo_badge}
            </span>
          )}
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {p.hero_title || p.name}
          </h1>
          {p.hero_subtitle && (
            <p className="text-lg lg:text-xl text-white/80 mb-8">{p.hero_subtitle}</p>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/recommend"
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              {ctaPrimary}
            </Link>
            {ctaSecondary && (
              <a
                href="tel:1234-5678"
                className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 backdrop-blur transition-colors"
              >
                {ctaSecondary}
              </a>
            )}
          </div>

          {/* 가격 카드 */}
          {p.price != null && (
            <div className="mt-12 inline-block px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl">
              <div className="flex items-end gap-2 justify-center">
                {p.original_price && p.original_price > (p.price || 0) && (
                  <span className="text-sm text-white/50 line-through">
                    {p.original_price.toLocaleString()}원
                  </span>
                )}
                <span className="text-3xl font-bold text-white">
                  {p.price.toLocaleString()}
                </span>
                <span className="text-lg text-white/80">원{p.speed ? ' / 월' : ''}</span>
              </div>
              {p.gift_description && (
                <p className="text-sm text-amber-300 mt-2">🎁 {p.gift_description}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── 신뢰 배지 ──────────────────────────────────── */}
      {trustBadges.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className={`grid gap-6 ${trustBadges.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
              {trustBadges.map((b, i) => (
                <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                  {b.icon && (
                    <Icon icon={b.icon} className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                  )}
                  <div className="text-sm font-semibold text-gray-800">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 세부 기능 ──────────────────────────────────── */}
      {detailFeatures.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
              왜 우리편 {p.name}인가요?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detailFeatures.map((f, i) => (
                <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
                  {f.icon && (
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <Icon icon={f.icon} className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 기본 특징 (기존 features 배열) ──────────────── */}
      {p.features && p.features.length > 0 && !detailFeatures.length && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 특징</h2>
            <ul className="space-y-3">
              {p.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── 비교표 ─────────────────────────────────── */}
      {comparison && comparison.columns && comparison.columns.length > 0 && comparison.rows && comparison.rows.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              타사와 비교해보세요
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    {comparison.columns.map((h, i) => (
                      <th
                        key={i}
                        className={`px-6 py-4 text-left text-sm font-semibold ${
                          i === (comparison.columns?.length || 0) - 1 ? 'bg-blue-600' : ''
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, ri) => (
                    <tr key={ri} className="border-t border-gray-100">
                      {(comparison.columns || []).map((col, ci) => (
                        <td
                          key={ci}
                          className={`px-6 py-4 text-sm ${
                            ci === 0
                              ? 'font-medium text-gray-900'
                              : ci === (comparison.columns?.length || 0) - 1
                                ? 'text-blue-600 font-semibold bg-blue-50/50'
                                : 'text-gray-600'
                          }`}
                        >
                          {row[col] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ─── 본문 설명 ──────────────────────────────────── */}
      {p.description && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {p.description}
            </p>
          </div>
        </section>
      )}

      {/* ─── 하단 CTA ──────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            지금 바로 {p.name} 상담받으세요
          </h3>
          <p className="text-white/70 mb-8">
            전문 상담사가 매장 상황에 맞는 최적 플랜을 무료로 제안해드립니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/recommend"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              {ctaPrimary}
            </Link>
            <a
              href="tel:1234-5678"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur transition-colors"
            >
              📞 1234-5678
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

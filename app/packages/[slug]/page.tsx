// 패키지 세부페이지 (Type B 렌더러)
// packages 테이블의 slug로 조회 → 히어로 / 구성 상품 / detail_sections(JSON 블록) / CTA
// 실제 DB 스키마와 1:1 매칭: hero_title, hero_subtitle, hook_copy, target_industry,
// target_description, is_visible, detail_sections, price_range_label

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { Package, PackageItem, PackageSection } from '@/types/database'

interface Props {
  params: { slug: string }
}

// ─── SEO 메타 ─────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('packages')
    .select('name, hero_title, hero_subtitle, hook_copy, hero_image, seo_title, seo_description, og_image_url')
    .eq('slug', params.slug)
    .eq('is_visible', true)
    .maybeSingle()

  if (!data) return { title: '패키지를 찾을 수 없습니다' }

  const title = data.seo_title || `${data.name} 패키지 | 우리편`
  const description = data.seo_description || data.hook_copy || data.hero_subtitle || ''
  const ogImage = data.og_image_url || data.hero_image || ''

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

// 패키지 + 포함 상품 조회
async function getPackageWithItems(slug: string) {
  const supabase = createClient()
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .maybeSingle()

  if (!pkg) return null

  const { data: items } = await supabase
    .from('package_items')
    .select(`
      id,
      product_id,
      is_highlighted,
      note,
      sort_order,
      product:products (
        id, name, category, price, image_url, description, slug
      )
    `)
    .eq('package_id', pkg.id)
    .order('sort_order', { ascending: true })

  return {
    pkg: pkg as Package,
    items: (items || []) as unknown as PackageItem[],
  }
}

// ─── JSON 섹션 블록 렌더러 ───────────────────────────────
// 각 섹션은 { type, data } 구조. data 안의 필드는 block마다 다름.
function renderSection(section: PackageSection, idx: number) {
  const d = (section.data || {}) as Record<string, unknown>
  const str = (k: string) => (typeof d[k] === 'string' ? (d[k] as string) : '')

  switch (section.type) {
    case 'hero':
      // 추가 강조 히어로 (메인 히어로 외)
      return (
        <section key={idx} className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-900">
          <div className="max-w-4xl mx-auto text-center text-white">
            {str('title') && (
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">{str('title')}</h2>
            )}
            {str('subtitle') && <p className="text-lg text-white/80">{str('subtitle')}</p>}
          </div>
        </section>
      )

    case 'benefits': {
      const items = (Array.isArray(d.items) ? d.items : []) as Array<Record<string, unknown>>
      return (
        <section key={idx} className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {str('title') && (
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">{str('title')}</h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it, i) => {
                const icon = typeof it.icon === 'string' ? it.icon : ''
                const title = typeof it.title === 'string' ? it.title : ''
                const desc = typeof it.desc === 'string'
                  ? it.desc
                  : typeof it.description === 'string'
                    ? it.description
                    : ''
                return (
                  <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl">
                    {icon && (
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                        <Icon icon={icon} className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    {title && <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>}
                    {desc && <p className="text-sm text-gray-600">{desc}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )
    }

    case 'faq': {
      const items = (Array.isArray(d.items) ? d.items : []) as Array<Record<string, unknown>>
      return (
        <section key={idx} className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {str('title') && (
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{str('title')}</h2>
            )}
            <div className="space-y-3">
              {items.map((it, i) => (
                <details key={i} className="bg-white rounded-xl p-4 group">
                  <summary className="font-medium text-gray-900 cursor-pointer flex items-center justify-between">
                    <span>{typeof it.q === 'string' ? it.q : ''}</span>
                    <Icon icon="solar:alt-arrow-down-line-duotone" className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
                    {typeof it.a === 'string' ? it.a : ''}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'testimonial': {
      const items = (Array.isArray(d.items) ? d.items : []) as Array<Record<string, unknown>>
      return (
        <section key={idx} className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {str('title') && (
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{str('title')}</h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it, i) => (
                <blockquote key={i} className="p-6 bg-blue-50 rounded-2xl">
                  <p className="text-sm text-gray-700 italic mb-3">
                    “{typeof it.quote === 'string' ? it.quote : ''}”
                  </p>
                  <footer className="text-xs text-gray-500">
                    — {typeof it.author === 'string' ? it.author : ''}
                    {typeof it.role === 'string' ? ` · ${it.role}` : ''}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'richtext':
      return (
        <section key={idx} className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {str('title') && (
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{str('title')}</h2>
            )}
            {str('content') && (
              <div className="prose prose-lg text-gray-700 whitespace-pre-wrap">{str('content')}</div>
            )}
          </div>
        </section>
      )

    case 'cta':
      return (
        <section key={idx} className="py-20 px-4 bg-gray-900">
          <div className="max-w-3xl mx-auto text-center text-white">
            {str('title') && <h2 className="text-3xl font-bold mb-4">{str('title')}</h2>}
            {str('subtitle') && <p className="text-white/70 mb-8">{str('subtitle')}</p>}
            <Link
              href="/recommend"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-colors"
            >
              {str('button') || '무료 상담 신청하기'}
            </Link>
          </div>
        </section>
      )

    default:
      return null
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const result = await getPackageWithItems(params.slug)
  if (!result) notFound()

  const { pkg, items } = result
  const sections = (pkg.detail_sections || []) as PackageSection[]

  // 대표 구성품 먼저, 그 외 순서대로
  const sortedItems = [...items].sort((a, b) => {
    if (a.is_highlighted !== b.is_highlighted) return a.is_highlighted ? -1 : 1
    return a.sort_order - b.sort_order
  })

  return (
    <div className="min-h-screen bg-white">
      {/* ─── 히어로 ─────────────────────────────────── */}
      <section
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={
          pkg.hero_image
            ? {
                backgroundImage: `linear-gradient(rgba(17,24,39,0.65), rgba(15,52,96,0.85)), url(${pkg.hero_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)' }
        }
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 bg-blue-500/90 text-white text-xs font-bold rounded-full mb-4">
            PACKAGE
          </span>
          {pkg.target_industry && (
            <span className="inline-block ml-2 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4 backdrop-blur">
              {pkg.target_industry} 전용
            </span>
          )}
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {pkg.hero_title || pkg.name}
          </h1>
          {pkg.hero_subtitle && (
            <p className="text-lg lg:text-xl text-white/80 mb-6">{pkg.hero_subtitle}</p>
          )}
          {pkg.hook_copy && !pkg.hero_subtitle && (
            <p className="text-lg lg:text-xl text-white/80 mb-6">{pkg.hook_copy}</p>
          )}
          {pkg.price_range_label && (
            <div className="inline-block px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white backdrop-blur mb-6">
              💰 {pkg.price_range_label}
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <Link
              href="/recommend"
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              맞춤 상담 신청
            </Link>
            <a
              href="tel:1600-6116"
              className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 backdrop-blur transition-colors"
            >
              📞 전화 문의
            </a>
          </div>
        </div>
      </section>

      {/* ─── 타겟·설명 ──────────────────────────────────── */}
      {pkg.target_description && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
              추천 대상: {pkg.target_description}
            </div>
            {pkg.hook_copy && pkg.hero_subtitle && (
              <p className="text-lg text-gray-700 leading-relaxed">{pkg.hook_copy}</p>
            )}
          </div>
        </section>
      )}

      {/* ─── 포함 상품 ──────────────────────────────────── */}
      {sortedItems.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              패키지 구성 ({sortedItems.length}개)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map((item) => {
                const product = item.product
                if (!product) return null
                return (
                  <div
                    key={item.id}
                    className={`p-6 bg-white border-2 rounded-2xl hover:shadow-lg transition-shadow ${
                      item.is_highlighted ? 'border-blue-500' : 'border-gray-100'
                    }`}
                  >
                    {item.is_highlighted && (
                      <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded mb-3">
                        ⭐ 대표 구성
                      </span>
                    )}
                    {product.image_url && (
                      <div
                        className="w-full h-32 rounded-xl mb-4 bg-gray-100"
                        style={{
                          backgroundImage: `url(${product.image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    )}
                    {item.note && (
                      <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mb-3">
                        💡 {item.note}
                      </p>
                    )}
                    {product.slug && (
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        자세히 보기 →
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── JSON 세부 섹션 (flexible) ─────────────────────── */}
      {sections.map((s, i) => renderSection(s, i))}

      {/* ─── 하단 CTA ──────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900 to-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {pkg.name} 패키지가 마음에 드시나요?
          </h3>
          <p className="text-white/70 mb-8">
            매장 상황에 맞춰 전문 상담사가 세부 조건을 안내해드립니다. 가입 부담 없이 상담받아보세요.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/recommend"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              무료 상담 신청
            </Link>
            <a
              href="tel:1600-6116"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur transition-colors"
            >
              📞 1600-6116
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

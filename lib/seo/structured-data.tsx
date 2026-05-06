// ─────────────────────────────────────────────
// JSON-LD (구조화 데이터) 헬퍼
//
// 검색엔진(특히 구글) SERP 에 리치 결과로 표시되도록 schema.org 마크업을
// 페이지에 박는다. <script type="application/ld+json"> 안에 JSON 으로 출력.
//
// 사용 예 :
//   import { OrganizationLd, ArticleLd } from '@/lib/seo/structured-data'
//   <OrganizationLd />
//   <ArticleLd title={...} url={...} />
// ─────────────────────────────────────────────
import React from 'react'

const SITE_URL = 'https://wooripen.co.kr'
const SITE_NAME = '우리편'
const LOGO_URL = `${SITE_URL}/og-image.png`
const PHONE = '+82-1600-6116'

// -------------------------------------------------------------
// Organization — 사이트 루트(layout) 또는 about 에 1회
// -------------------------------------------------------------
export function OrganizationLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: '우리편 비즈니스',
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      '소상공인 인터넷·결제단말기·CCTV·키오스크·티오더 통합 솔루션. 매장에 딱 맞는 조합을 한 번에 비교·설치합니다.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE,
      contactType: 'customer service',
      areaServed: 'KR',
      availableLanguage: ['Korean'],
    },
    sameAs: [
      // TODO: 운영 SNS 계정 URL 채우기
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// -------------------------------------------------------------
// WebSite — sitelinks search box 후보 마크업 (홈)
// -------------------------------------------------------------
export function WebSiteLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'ko-KR',
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// -------------------------------------------------------------
// Article — /tips/[slug] 본문에 박음
// -------------------------------------------------------------
export function ArticleLd(props: {
  title: string
  description?: string | null
  url: string                // canonical URL (절대)
  image?: string | null      // 절대 URL 권장
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string
}) {
  const {
    title,
    description,
    url,
    image,
    datePublished,
    dateModified,
    authorName = SITE_NAME,
  } = props
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description ?? undefined,
    image: image ?? LOGO_URL,
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? datePublished ?? undefined,
    author: { '@type': 'Organization', name: authorName, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// -------------------------------------------------------------
// Product — /products/[slug], /packages/[slug] 등 상품 상세
// -------------------------------------------------------------
export function ProductLd(props: {
  name: string
  description?: string | null
  image?: string | null
  url: string
  brand?: string
  // 가격이 노출되어도 무방한 경우만 priceKRW 채움
  priceKRW?: number | null
}) {
  const { name, description, image, url, brand = SITE_NAME, priceKRW } = props
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description ?? undefined,
    image: image ?? LOGO_URL,
    brand: { '@type': 'Brand', name: brand },
    url,
  }
  if (typeof priceKRW === 'number' && priceKRW > 0) {
    data.offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'KRW',
      price: String(priceKRW),
      availability: 'https://schema.org/InStock',
    }
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// -------------------------------------------------------------
// BreadcrumbList — 카테고리 → 상세 흐름이 있는 페이지에
// -------------------------------------------------------------
export function BreadcrumbLd(props: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: props.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// -------------------------------------------------------------
// FAQPage — /faq 또는 페이지 내 FAQ 섹션
// -------------------------------------------------------------
export function FaqLd(props: { items: { question: string; answer: string }[] }) {
  if (!props.items || props.items.length === 0) return null
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

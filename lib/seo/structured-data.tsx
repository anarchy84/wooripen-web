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
    // Speakable — 음성검색·AI 비서가 읽어주는 부분 지정 (h1 + 첫 문단)
    //   본문에 cssSelector 박지 않아도 schema 만으로 hint 가 됨
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]'],
    },
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

// -------------------------------------------------------------
// LocalBusiness — 로컬 SEO·GEO·AEO 핵심
//   "우리편" 본사 정보를 schema.org 로 알려서
//   카카오맵·구글지도·네이버 플레이스·LLM 답변엔진이 정확히 인용하게 함.
//
// props 미전달 시 우리편 운영 정보로 기본값 박힘 (홈에 1회만 박으면 됨).
// 정보가 바뀌면 이 함수 안의 DEFAULTS 만 수정.
// -------------------------------------------------------------
export interface LocalBusinessProps {
  streetAddress?: string
  addressRegion?: string
  addressLocality?: string
  postalCode?: string
  openingHours?: Array<{ dayOfWeek: string[]; opens: string; closes: string }>
  areaServed?: string[]
  taxId?: string
  email?: string
}

// 운영 기본값 — 2026-05 기준 우리편 본사
//   사업자번호 197-86-03789 | 통신판매업 제 2025-서울강서-1939호
const LOCAL_DEFAULTS: Required<Omit<LocalBusinessProps, 'taxId' | 'email'>> & {
  taxId: string
  email: string
} = {
  streetAddress: '공항대로 209, 507-509호',
  addressLocality: '강서구',
  addressRegion: '서울특별시',
  postalCode: '07505',                // 강서구 공항대로 209 일대 우편번호
  // 평일 10–18 (점심 12:30–13:30 휴식 — schema 는 단일 구간만 지원하므로
  // 가독성용으로 대표 영업시간만 박고, 점심 휴식은 본사 안내문에서 처리)
  openingHours: [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00', closes: '18:00' },
  ],
  areaServed: ['전국'],
  taxId: '197-86-03789',
  email: 'ourteam.kr@gmail.com',
}

export function LocalBusinessLd(props: LocalBusinessProps = {}) {
  const merged = {
    streetAddress: props.streetAddress ?? LOCAL_DEFAULTS.streetAddress,
    addressLocality: props.addressLocality ?? LOCAL_DEFAULTS.addressLocality,
    addressRegion: props.addressRegion ?? LOCAL_DEFAULTS.addressRegion,
    postalCode: props.postalCode ?? LOCAL_DEFAULTS.postalCode,
    openingHours: props.openingHours ?? LOCAL_DEFAULTS.openingHours,
    areaServed: props.areaServed ?? LOCAL_DEFAULTS.areaServed,
    taxId: props.taxId ?? LOCAL_DEFAULTS.taxId,
    email: props.email ?? LOCAL_DEFAULTS.email,
  }

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    alternateName: '우리편 비즈니스',
    description:
      '소상공인 인터넷·결제단말기·CCTV·키오스크·티오더 통합 솔루션 — 매장에 와서 직접 설치합니다.',
    url: SITE_URL,
    image: LOGO_URL,
    logo: LOGO_URL,
    telephone: PHONE,
    email: merged.email,
    taxID: merged.taxId,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      streetAddress: merged.streetAddress,
      addressLocality: merged.addressLocality,
      addressRegion: merged.addressRegion,
      postalCode: merged.postalCode,
    },
    openingHoursSpecification: merged.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: merged.areaServed.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
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
// HowTo — 절차형 글 (Tips 중 단계별 가이드)
//   답변엔진(GEO/AEO)이 "어떻게 ~ 하나요?" 검색에 단계 그대로 인용한다.
// -------------------------------------------------------------
export interface HowToStep {
  name: string
  text: string
  image?: string | null
  url?: string | null
}

export function HowToLd(props: {
  name: string
  description?: string | null
  image?: string | null
  totalTimeISO8601?: string | null   // 예: 'PT15M'
  steps: HowToStep[]
}) {
  if (!props.steps || props.steps.length === 0) return null
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: props.name,
    description: props.description ?? undefined,
    image: props.image ?? LOGO_URL,
    step: props.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image ? { image: s.image } : {}),
      ...(s.url ? { url: s.url } : {}),
    })),
  }
  if (props.totalTimeISO8601) data.totalTime = props.totalTimeISO8601
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// GTM dataLayer 푸시 래퍼
// GA4 / Google Ads / Meta Pixel 전환은 전부 GTM 컨테이너에서 관리
// 코드에서는 이 함수들로 이벤트만 쏘면 됨

// ─── 타입 ───────────────────────────────────────
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

// ─── 기본 push ───────────────────────────────────
export function gtmPush(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(data)
}

// ─── 상담 신청 전환 이벤트 ────────────────────────
// GA4: generate_lead / Google Ads: conversion / Meta Pixel: Lead
// GTM 컨테이너에서 이 이벤트 이름으로 3개 태그 트리거 설정하면 됨
export function fireLeadConversion(params: {
  consultation_id: string
  source: string        // home, internet, rental, recommend, cctv, terminal, torder
  product_category?: string
  value?: number
}) {
  gtmPush({
    event: 'generate_lead',
    lead_id: params.consultation_id,
    lead_source: params.source,
    lead_category: params.product_category || '',
    lead_value: params.value || 0,
  })
}

// ─── 페이지뷰 (SPA 전환 시) ──────────────────────
export function firePageView(path: string, title: string) {
  gtmPush({
    event: 'page_view',
    page_path: path,
    page_title: title,
  })
}

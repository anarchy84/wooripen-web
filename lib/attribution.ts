'use client'

// 어트리뷰션(UTM/클릭ID) 캡처 훅
// 페이지 진입 시 URL 파라미터를 읽어 sessionStorage에 first/last touch 저장
// 상담 폼 제출 시 getAttribution()으로 한 번에 꺼내서 API에 보냄

import { useEffect } from 'react'

// ─── 타입 ───────────────────────────────────────
export interface Attribution {
  // first touch (최초 방문 시 캡처 — 세션 동안 불변)
  first_utm_source: string | null
  first_utm_medium: string | null
  first_utm_campaign: string | null
  first_utm_term: string | null
  first_utm_content: string | null
  first_landing_page: string | null
  first_referrer: string | null
  first_visited_at: string | null

  // last touch (폼 제출 직전 최신 값)
  last_utm_source: string | null
  last_utm_medium: string | null
  last_utm_campaign: string | null
  last_utm_term: string | null
  last_utm_content: string | null
  last_landing_page: string | null
  last_referrer: string | null

  // 광고 플랫폼 클릭 ID
  gclid: string | null
  fbclid: string | null
  yclid: string | null
  ttclid: string | null
  kakao_click_id: string | null
  naver_click_id: string | null

  // 세션 정보
  session_count: number
  device_type: string | null
  browser: string | null
}

// ─── 유틸리티 ────────────────────────────────────
const STORAGE_KEY = 'wp_attr'

function getParam(key: string): string | null {
  if (typeof window === 'undefined') return null
  const url = new URL(window.location.href)
  return url.searchParams.get(key) || null
}

function detectDevice(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/Mobile|Android|iPhone/i.test(ua)) return 'mobile'
  if (/Tablet|iPad/i.test(ua)) return 'tablet'
  return 'desktop'
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('SamsungBrowser')) return 'Samsung'
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  return 'other'
}

// sessionStorage에서 기존 어트리뷰션 로드
function loadStored(): Partial<Attribution> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// sessionStorage에 저장
function saveStored(data: Partial<Attribution>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // private browsing 등에서 실패 가능
  }
}

// ─── 메인 캡처 로직 ──────────────────────────────
function captureAttribution() {
  const stored = loadStored()

  // UTM 파라미터 현재 값
  const currentUtm = {
    source: getParam('utm_source'),
    medium: getParam('utm_medium'),
    campaign: getParam('utm_campaign'),
    term: getParam('utm_term'),
    content: getParam('utm_content'),
  }

  // 클릭 ID 현재 값
  const currentClicks = {
    gclid: getParam('gclid'),
    fbclid: getParam('fbclid'),
    yclid: getParam('yclid'),
    ttclid: getParam('ttclid'),
    kakao_click_id: getParam('kclid') || getParam('kakao_click_id'),
    naver_click_id: getParam('n_click_id') || getParam('naver_click_id'),
  }

  // first touch: 최초 1회만 기록
  if (!stored.first_visited_at) {
    stored.first_utm_source = currentUtm.source
    stored.first_utm_medium = currentUtm.medium
    stored.first_utm_campaign = currentUtm.campaign
    stored.first_utm_term = currentUtm.term
    stored.first_utm_content = currentUtm.content
    stored.first_landing_page = window.location.pathname + window.location.search
    stored.first_referrer = document.referrer || null
    stored.first_visited_at = new Date().toISOString()
    stored.session_count = 1
  } else {
    // 세션 카운트 증가 (pageview 기반 간이 카운트)
    stored.session_count = (stored.session_count || 1) + 1
  }

  // last touch: 항상 최신으로 덮어쓰기
  stored.last_utm_source = currentUtm.source || stored.last_utm_source || null
  stored.last_utm_medium = currentUtm.medium || stored.last_utm_medium || null
  stored.last_utm_campaign = currentUtm.campaign || stored.last_utm_campaign || null
  stored.last_utm_term = currentUtm.term || stored.last_utm_term || null
  stored.last_utm_content = currentUtm.content || stored.last_utm_content || null
  stored.last_landing_page = window.location.pathname + window.location.search
  stored.last_referrer = document.referrer || stored.last_referrer || null

  // 클릭 ID: 있으면 최신으로 덮어쓰기
  stored.gclid = currentClicks.gclid || stored.gclid || null
  stored.fbclid = currentClicks.fbclid || stored.fbclid || null
  stored.yclid = currentClicks.yclid || stored.yclid || null
  stored.ttclid = currentClicks.ttclid || stored.ttclid || null
  stored.kakao_click_id = currentClicks.kakao_click_id || stored.kakao_click_id || null
  stored.naver_click_id = currentClicks.naver_click_id || stored.naver_click_id || null

  // 디바이스·브라우저
  stored.device_type = detectDevice()
  stored.browser = detectBrowser()

  saveStored(stored)
}

// ─── React Hook ──────────────────────────────────
// 모든 페이지 레이아웃에서 호출 → 방문 즉시 UTM 캡처
export function useAttribution() {
  useEffect(() => {
    captureAttribution()
  }, [])
}

// ─── 폼 제출 시 호출 ─────────────────────────────
// 저장된 어트리뷰션 데이터를 한번에 반환
export function getAttribution(): Attribution {
  const stored = loadStored()
  return {
    first_utm_source: stored.first_utm_source || null,
    first_utm_medium: stored.first_utm_medium || null,
    first_utm_campaign: stored.first_utm_campaign || null,
    first_utm_term: stored.first_utm_term || null,
    first_utm_content: stored.first_utm_content || null,
    first_landing_page: stored.first_landing_page || null,
    first_referrer: stored.first_referrer || null,
    first_visited_at: stored.first_visited_at || null,

    last_utm_source: stored.last_utm_source || null,
    last_utm_medium: stored.last_utm_medium || null,
    last_utm_campaign: stored.last_utm_campaign || null,
    last_utm_term: stored.last_utm_term || null,
    last_utm_content: stored.last_utm_content || null,
    last_landing_page: stored.last_landing_page || null,
    last_referrer: stored.last_referrer || null,

    gclid: stored.gclid || null,
    fbclid: stored.fbclid || null,
    yclid: stored.yclid || null,
    ttclid: stored.ttclid || null,
    kakao_click_id: stored.kakao_click_id || null,
    naver_click_id: stored.naver_click_id || null,

    session_count: stored.session_count || 1,
    device_type: stored.device_type || null,
    browser: stored.browser || null,
  }
}

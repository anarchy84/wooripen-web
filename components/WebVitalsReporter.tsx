'use client'

// ─────────────────────────────────────────────
// Core Web Vitals 측정 → /api/web-vitals 로 전송
//
// 페이지 마다 1회 마운트되어 web-vitals 콜백 등록.
//   LCP : 가장 큰 콘텐츠가 보이기까지 (사용자 첫 인상)
//   CLS : 누적 레이아웃 이동 (요소 튀는 정도)
//   INP : 입력 ↔ 다음 페인트 지연 (반응성)
//   FCP : 첫 콘텐츠 페인트
//   TTFB: 서버 응답 시간
//
// 페이지 닫을 때 sendBeacon 으로 신뢰성 있게 전송.
// ─────────────────────────────────────────────
import { useEffect } from 'react'
import { onLCP, onCLS, onINP, onFCP, onTTFB, type Metric } from 'web-vitals'

export function WebVitalsReporter() {
  useEffect(() => {
    function send(metric: Metric) {
      try {
        const body = JSON.stringify({
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          page_path: window.location.pathname,
          navigation_type: metric.navigationType,
        })
        // sendBeacon 으로 페이지 닫혀도 전송 보장 — fetch 폴백
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/web-vitals', body)
        } else {
          fetch('/api/web-vitals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(() => {})
        }
      } catch {
        // 측정 실패는 사용자 경험에 영향 X — 조용히 패스
      }
    }

    onLCP(send)
    onCLS(send)
    onINP(send)
    onFCP(send)
    onTTFB(send)
  }, [])

  return null
}

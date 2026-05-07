// ─────────────────────────────────────────────
// /robots.txt — 검색엔진 크롤러 규칙
//
// 정책 :
//   · 공개 페이지 전체 허용
//   · /admin/**, /api/**, /consultation/complete 는 색인 차단
//     (어드민 노출 위험 + 완료 페이지는 직접 진입 가치 없음)
//   · 사이트맵 위치 명시 (Search Console 자동 발견용)
// ─────────────────────────────────────────────
import type { MetadataRoute } from 'next'

const SITE_URL = 'https://ourteam.kr'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',          // 어드민 진입점
          '/admin/',         // 어드민 모든 하위 경로
          '/api/',           // API 응답 색인 방지
          '/consultation/complete', // 폼 제출 후 리다이렉트 페이지
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

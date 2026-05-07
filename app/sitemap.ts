// ─────────────────────────────────────────────
// /sitemap.xml — 검색엔진(구글·네이버·다음) 색인용
//
// 다이내믹 :
//   - 정적 페이지(홈·about·내 카테고리 등)는 코드에 하드코딩
//   - 동적 페이지(/tips·/packages·/products 의 [slug])는
//     Supabase 에서 발행/활성된 항목만 select 해서 자동 포함
//
// 사용처 :
//   robots.txt 의 'Sitemap:' 헤더에 절대 URL 로 명시 (app/robots.ts).
//   Search Console / 네이버 웹마스터에 한 번 등록해두면 자동 반영.
// ─────────────────────────────────────────────
import type { MetadataRoute } from 'next'
import {
  getPublishedTipPaths,
  getActivePackagePaths,
  getActiveProductPaths,
} from '@/lib/seo/sitemap-data'

// SEO 의 기준 도메인 — production canonical
//   beta.ourteam.kr 은 현재 staging/production 양립 상태이므로
//   루트 metadata 의 metadataBase 를 따라간다.
const SITE_URL = 'https://ourteam.kr'

// 매 요청 동적 생성 (글 발행/수정 즉시 반영)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  // 1) 정적 페이지 (라우트별 변경 빈도·우선순위 수동 지정)
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/packages`,        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/internet`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE_URL}/business/cctv`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE_URL}/business/terminal`,lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/business/torder`, lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE_URL}/rental`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8  },
    { url: `${SITE_URL}/recommend`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8  },
    { url: `${SITE_URL}/tips`,            lastModified: now, changeFrequency: 'daily',   priority: 0.85 },
    { url: `${SITE_URL}/qna`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.7  },
    { url: `${SITE_URL}/faq`,             lastModified: now, changeFrequency: 'monthly', priority: 0.6  },
    { url: `${SITE_URL}/about`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6  },
    { url: `${SITE_URL}/privacy`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3  },
  ]

  // 2) 동적 페이지 — Supabase 에서 슬러그·수정시각 일괄 수집
  //    실패해도 sitemap 자체는 떨어뜨리지 않도록 Promise.allSettled
  const [tips, packages, products] = await Promise.allSettled([
    getPublishedTipPaths(),
    getActivePackagePaths(),
    getActiveProductPaths(),
  ])

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...(tips.status === 'fulfilled' ? tips.value : []).map((e) => ({
      url: `${SITE_URL}${e.path}`,
      lastModified: e.lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    ...(packages.status === 'fulfilled' ? packages.value : []).map((e) => ({
      url: `${SITE_URL}${e.path}`,
      lastModified: e.lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...(products.status === 'fulfilled' ? products.value : []).map((e) => ({
      url: `${SITE_URL}${e.path}`,
      lastModified: e.lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticEntries, ...dynamicEntries]
}

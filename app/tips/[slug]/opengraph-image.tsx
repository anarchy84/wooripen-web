// ─────────────────────────────────────────────
// /tips/[slug] 동적 OG 이미지
//
// 매 글마다 자동 생성되는 1200x630 PNG.
//   · featured_image_url 이 DB 에 있으면 그걸 배경으로 깔고
//   · 없으면 그라디언트 + 제목·카테고리만 텍스트 카드
//
// 카톡·페북·트위터·슬랙에 링크 붙일 때 본문 미리보기로 노출.
//
// 라우트 :
//   Next.js 가 이 파일을 보면 자동으로
//   <meta property="og:image" content="…/opengraph-image" /> 를 붙임.
//   즉 generateMetadata 의 openGraph.images 보다 우선.
// ─────────────────────────────────────────────
import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

// Edge runtime 필수 — ImageResponse 가 satori/resvg 를 Edge 에서 실행
export const runtime = 'edge'
export const alt = '우리편 꿀팁'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Params {
  params: { slug: string }
}

export default async function OgImage({ params }: Params) {
  // DB 에서 글 정보 조회 — 실패하면 폴백 카드
  const supabase = createClient()
  const { data } = await supabase
    .from('tips')
    .select('title, category, excerpt, featured_image_url')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle()

  const title = data?.title ?? '우리편 꿀팁'
  const category = data?.category ?? '꿀팁'
  const featured = data?.featured_image_url ?? null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          // featured 가 있으면 어둡게 깔고 위에 텍스트, 없으면 브랜드 그라디언트
          background: featured
            ? `linear-gradient(rgba(10,14,26,0.72), rgba(10,14,26,0.92)), url(${featured}) center/cover no-repeat`
            : 'linear-gradient(135deg, #0F3460 0%, #1A1A2E 60%, #00C896 140%)',
        }}
      >
        {/* 상단 — 카테고리 칩 + 우리편 로고텍스트 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 22px',
              fontSize: 26,
              fontWeight: 600,
              borderRadius: 999,
              background: 'rgba(0, 200, 150, 0.18)',
              color: '#00FFB7',
              letterSpacing: '-0.01em',
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 30,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: '#00FFB7', marginRight: 10 }}>●</span> 우리편
          </div>
        </div>

        {/* 중앙 — 글 제목 */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 40 ? 60 : title.length > 28 ? 72 : 82,
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            // 너무 긴 제목 잘림 방지 — 4줄까지만 노출
            maxWidth: 1056,
            wordBreak: 'keep-all',
          }}
        >
          {title}
        </div>

        {/* 하단 — 사이트 URL + 부제 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>
            ourteam.kr · 소상공인 편에 서는 유일한 파트너
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

// GET /api/consultations/recent — 최근 상담 신청 목록 (LiveTicker용)
//
// ⚠️ 가짜 데이터 제공 중단 (2026-08-03)
//   기존 동작 : NEXT_PUBLIC_LIVE_TICKER_REAL 이 'true' 가 아니면 lib/fake-consultations 의
//   생성 데이터(fake-001~050, 최근 14일 내 랜덤 날짜, 랜덤 성씨)를 반환했고,
//   실데이터 모드에서도 DB 오류가 나면 같은 가짜 데이터로 폴백했다.
//   LiveTicker 는 여기에 빨간 LIVE 점과 '몇 분 전' 상대시각까지 붙여 실제 신청처럼 노출한다.
//   → 실적을 사실과 다르게 표시하는 것이라 표시광고법 리스크가 있어 가짜 제공 경로를 전부 제거했다.
//
//   빈 배열을 주면 LiveTicker 가 스스로 렌더를 생략하므로(items 비면 null) 섹션이 자연히 사라진다.
//
//   실데이터로 켜려면 : NEXT_PUBLIC_LIVE_TICKER_REAL=true (Vercel 환경변수) 후 재배포.
//   마스킹은 consultations_public 뷰가 이미 처리한다(성 1자+**, 010-****-****).

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 폼 카테고리 슬러그 → 표시용 한글 라벨 (실데이터에 슬러그·한글이 혼재)
const CATEGORY_LABELS: Record<string, string> = {
  internet: '인터넷',
  terminal: '결제단말기',
  cctv: 'CCTV',
  kiosk: '키오스크',
  torder: '티오더',
  rental: '렌탈',
  package: '패키지',
  general: '일반 상담',
}

export async function GET() {
  // 플래그가 켜져 있지 않으면 아무것도 노출하지 않는다 (가짜 데이터 금지)
  if (process.env.NEXT_PUBLIC_LIVE_TICKER_REAL !== 'true') {
    return NextResponse.json([])
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('consultations_public')
      .select('*')
      .limit(50)

    if (error) throw error

    const rows = (data ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      product_category:
        CATEGORY_LABELS[String(row.product_category ?? '')] ?? row.product_category,
    }))
    return NextResponse.json(rows)
  } catch (err) {
    // 조회 실패 시에도 가짜로 대체하지 않는다 — 티커만 조용히 사라진다
    console.warn('[live-ticker] fetch failed:', err instanceof Error ? err.message : err)
    return NextResponse.json([])
  }
}

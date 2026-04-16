// GET /api/consultations/recent — 최근 상담 신청 목록 (LiveTicker용)
// NEXT_PUBLIC_LIVE_TICKER_REAL=true 이면 DB에서, 아니면 가상 데이터 반환

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFakeConsultations } from '@/lib/fake-consultations'

export async function GET() {
  const useReal = process.env.NEXT_PUBLIC_LIVE_TICKER_REAL === 'true'

  if (useReal) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('consultations_public')
        .select('*')
        .limit(50)

      if (error) throw error
      return NextResponse.json(data || [])
    } catch {
      // DB 실패 시 가상 데이터 폴백
      return NextResponse.json(getFakeConsultations())
    }
  }

  return NextResponse.json(getFakeConsultations())
}

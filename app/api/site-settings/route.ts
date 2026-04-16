// GET /api/site-settings?key=phone
// site_settings 테이블에서 특정 키의 값을 반환
// 공개 페이지(완료페이지, 푸터 등)에서 동적 값을 가져올 때 사용

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'key 파라미터가 필요합니다.' }, { status: 400 })
  }

  // 허용된 키만 공개 (보안: 민감 설정은 차단)
  const PUBLIC_KEYS = ['phone', 'privacy_policy', 'third_party_consent_text', 'marketing_consent_text']
  if (!PUBLIC_KEYS.includes(key)) {
    return NextResponse.json({ error: '허용되지 않은 키입니다.' }, { status: 403 })
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: '설정을 불러올 수 없습니다.' }, { status: 500 })
  }

  return NextResponse.json({ key, value: data?.value || null })
}

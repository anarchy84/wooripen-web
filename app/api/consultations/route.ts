// POST /api/consultations — 상담 신청 저장 API
// 폼에서 수집한 기본 정보 + 어트리뷰션 데이터를 consultations 테이블에 INSERT
// anon RLS INSERT 정책으로 인증 없이 저장 가능

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 필수 필드 검증
    const { name, phone, product_category } = body
    if (!name || !phone || !product_category) {
      return NextResponse.json(
        { error: '이름, 전화번호, 관심 상품은 필수입니다.' },
        { status: 400 }
      )
    }

    // 전화번호 간단 검증 (숫자·하이픈만, 최소 9자)
    const cleanPhone = phone.replace(/[^0-9-]/g, '')
    if (cleanPhone.replace(/-/g, '').length < 9) {
      return NextResponse.json(
        { error: '올바른 전화번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // INSERT 데이터 구성
    const insertData: Record<string, unknown> = {
      // 기본 정보
      name: body.name,
      phone: cleanPhone,
      product_category: body.product_category,
      business_type: body.business_type || null,
      business_address: body.business_address || null,
      memo: body.memo || null,
      interested_products: body.interested_products || [],

      // 동의
      privacy_consent: body.privacy_consent ?? true,
      third_party_consent: body.third_party_consent ?? true,
      marketing_agreed: body.marketing_consent ?? true,
      marketing_agreed_at: body.marketing_consent ? new Date().toISOString() : null,
      consent_ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,

      // 어트리뷰션 — first touch
      first_utm_source: body.first_utm_source || null,
      first_utm_medium: body.first_utm_medium || null,
      first_utm_campaign: body.first_utm_campaign || null,
      first_utm_term: body.first_utm_term || null,
      first_utm_content: body.first_utm_content || null,
      first_landing_page: body.first_landing_page || null,
      first_referrer: body.first_referrer || null,
      first_visited_at: body.first_visited_at || null,

      // 어트리뷰션 — last touch (기존 utm 컬럼에도 동시 저장)
      utm_source: body.last_utm_source || body.first_utm_source || null,
      utm_medium: body.last_utm_medium || body.first_utm_medium || null,
      utm_campaign: body.last_utm_campaign || body.first_utm_campaign || null,
      utm_term: body.last_utm_term || body.first_utm_term || null,
      utm_content: body.last_utm_content || body.first_utm_content || null,
      last_utm_source: body.last_utm_source || null,
      last_utm_medium: body.last_utm_medium || null,
      last_utm_campaign: body.last_utm_campaign || null,
      last_utm_term: body.last_utm_term || null,
      last_utm_content: body.last_utm_content || null,
      last_landing_page: body.last_landing_page || null,
      last_referrer: body.last_referrer || null,
      landing_page: body.last_landing_page || body.first_landing_page || null,
      referrer_url: body.last_referrer || body.first_referrer || null,

      // 클릭 ID
      gclid: body.gclid || null,
      fbclid: body.fbclid || null,
      yclid: body.yclid || null,
      ttclid: body.ttclid || null,
      kakao_click_id: body.kakao_click_id || null,
      naver_click_id: body.naver_click_id || null,

      // 세션 정보
      session_count: body.session_count || 1,
      device_type: body.device_type || null,
      browser: body.browser || null,

      // 상태
      status: 'pending',
    }

    const { data, error } = await supabase
      .from('consultations')
      .insert(insertData)
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Consultation insert error:', error)
      return NextResponse.json(
        { error: '상담 신청 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      created_at: data.created_at,
    })
  } catch (err) {
    console.error('Consultation API error:', err)
    return NextResponse.json(
      { error: '잠시 후 다시 시도해주세요. 문제가 계속되면 ☎ 1600-6116으로 연락주세요.' },
      { status: 500 }
    )
  }
}

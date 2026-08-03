// POST /api/consultations — 상담 신청 저장 API
// 폼에서 수집한 기본 정보 + 어트리뷰션 데이터를 consultations 테이블에 INSERT
// anon RLS INSERT 정책으로 인증 없이 저장 가능

import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendCrmProLead } from '@/lib/integrations/crmpro'

// ─── 남용 방어 ────────────────────────────────
// 이 API 는 비인증·공개다. 2026-08-03 CRM 연동 이후로는 요청 1건이
// 외부 영업 시스템(crmpro.kr)까지 그대로 전달되므로 최소 방어를 둔다.
//
// ⚠️ 한계 : 아래 레이트리밋은 인스턴스 메모리 기반이라 서버리스 다중 인스턴스에서
//    완벽하지 않다(인스턴스 수만큼 배수 허용). 단순 curl 루프는 막지만
//    본격적인 봇 방어가 필요하면 Upstash Ratelimit 같은 공유 저장소 또는
//    캡차 도입이 필요하다.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3
const rateBuckets = new Map<string, number[]>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const hits = (rateBuckets.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  hits.push(now)
  rateBuckets.set(key, hits)

  // 메모리 누수 방지 — 오래된 버킷 정리
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateBuckets.delete(k)
    }
  }
  return hits.length > RATE_LIMIT_MAX
}

// x-forwarded-for 는 위조 가능 — IPv4/IPv6 형식만 통과시킨다
function parseClientIp(header: string | null): string | null {
  const first = header?.split(',')[0]?.trim()
  if (!first) return null
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(first) &&
    first.split('.').every((o) => Number(o) <= 255)
  const isIpv6 = /^[0-9a-fA-F:]+$/.test(first) && first.includes(':')
  return isIpv4 || isIpv6 ? first : null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 허니팟 — 사람에게 보이지 않는 필드. 값이 차 있으면 봇으로 간주하고
    // 저장·CRM 전송 없이 성공처럼 응답한다(봇에게 실패를 알리지 않음).
    if (typeof body._hp === 'string' && body._hp.trim() !== '') {
      console.warn('[consultations] honeypot triggered')
      return NextResponse.json({ success: true, id: randomUUID(), created_at: new Date().toISOString() })
    }

    // 필수 필드 검증
    const { name, phone, product_category } = body
    if (!name || !phone || !product_category) {
      return NextResponse.json(
        { error: '이름, 전화번호, 관심 상품은 필수입니다.' },
        { status: 400 }
      )
    }

    // 레이트리밋 — IP 기준(없으면 전화번호 기준으로 폴백)
    const rateKey = parseClientIp(request.headers.get('x-forwarded-for'))
      ?? `phone:${String(phone).replace(/\D/g, '')}`
    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { error: '잠시 후 다시 시도해주세요.' },
        { status: 429 }
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

    // ⚠️ id·created_at 을 서버에서 미리 만든다.
    // consultations 는 개인정보라 SELECT 정책이 authenticated 전용이다.
    // 비로그인(anon) 방문자가 INSERT 뒤 .select() 로 값을 되받으면 그 RETURNING 이
    // SELECT 정책에 막혀 저장 전체가 롤백된다("저장 중 문제가 발생했습니다").
    // → 되받지 않고, 여기서 만든 값을 그대로 응답에 쓴다.
    const id = randomUUID()
    const createdAt = new Date().toISOString()

    // 고객 IP — consent_ip 저장(개보법 증빙)과 CRM X-Forwarded-For 전달에 공용.
    // x-forwarded-for 는 클라이언트가 위조할 수 있으므로 IP 형식을 검증한다.
    // (형식 불일치 시 null — 헤더 인젝션·가짜 증빙 IP 차단)
    const clientIp = parseClientIp(request.headers.get('x-forwarded-for'))

    // INSERT 데이터 구성
    const insertData: Record<string, unknown> = {
      // 식별자·생성시각 (서버 주입 — DB default 대신 명시)
      id,
      created_at: createdAt,

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
      consent_ip: clientIp,

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

    // ⚠️ .select() 되받기 없이 순수 INSERT 만 실행 (anon SELECT 정책에 막히지 않도록)
    const { error } = await supabase
      .from('consultations')
      .insert(insertData)

    if (error) {
      console.error('Consultation insert error:', error)
      return NextResponse.json(
        { error: '상담 신청 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    // CRM(crmpro.kr) 전송 — Supabase 저장 성공 후에만.
    // CRM_PRO_API_KEY 미설정 시 자동 스킵(no-op), 실패해도 접수 응답은 success 유지.
    // Vercel 서버리스는 응답 후 백그라운드가 중단되므로 반드시 await (내부 5초 타임아웃).
    await sendCrmProLead({
      name: body.name,
      phone: cleanPhone,
      productCategory: body.product_category,
      interestedProducts: body.interested_products,
      businessType: body.business_type,
      businessAddress: body.business_address,
      message: body.memo,
      createdAt,
      clientIp,
      landingPagePath: body.last_landing_page || body.first_landing_page,
      utmSource: body.last_utm_source || body.first_utm_source,
      utmMedium: body.last_utm_medium || body.first_utm_medium,
      utmCampaign: body.last_utm_campaign || body.first_utm_campaign,
    })

    return NextResponse.json({
      success: true,
      id,
      created_at: createdAt,
    })
  } catch (err) {
    console.error('Consultation API error:', err)
    return NextResponse.json(
      { error: '잠시 후 다시 시도해주세요. 문제가 계속되면 ☎ 1600-6116으로 연락주세요.' },
      { status: 500 }
    )
  }
}

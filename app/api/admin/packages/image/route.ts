// ─────────────────────────────────────────────
// 인라인 편집 — 패키지 이미지 필드 저장 API
//
// 역할 :
//   - 업로드 API (/api/admin/content-blocks/upload) 로 받은 URL 을
//     packages 테이블의 특정 컬럼에 기록.
//   - content_blocks 우회 경로 — 중복 저장 없이 단일 진실원 유지.
//
// 보호 :
//   - 인증 필수 (admin)
//   - 컬럼 화이트리스트 (hero_image 만 허용 — og_image_url 은 이번 패스 제외)
//   - packageId UUID 형식 체크
//
// 바디 :
//   {
//     packageId: 'uuid',
//     column:    'hero_image',          // 허용 컬럼만
//     value:     { url, fallback_url?, alt?, width?, height? }
//   }
// ─────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// 허용된 컬럼만 UPDATE — 무분별한 필드 수정 방지
const ALLOWED_COLUMNS = ['hero_image'] as const
type AllowedColumn = (typeof ALLOWED_COLUMNS)[number]

interface ImageValue {
  url:           string
  fallback_url?: string
  alt?:          string
  width?:        number
  height?:       number
}

interface PatchBody {
  packageId: string
  column:    AllowedColumn
  value:     ImageValue
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient()

  // 1) 인증
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2) 바디 파싱
  let body: PatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.packageId || !body.column || !body.value) {
    return NextResponse.json(
      { error: 'packageId, column, value 는 필수입니다.' },
      { status: 400 }
    )
  }

  // 3) 컬럼 화이트리스트
  if (!ALLOWED_COLUMNS.includes(body.column)) {
    return NextResponse.json(
      { error: `허용되지 않는 컬럼: ${body.column}` },
      { status: 400 }
    )
  }

  // 4) URL 필수 (빈 이미지 저장 방지)
  if (!body.value.url) {
    return NextResponse.json(
      { error: 'value.url 은 필수입니다.' },
      { status: 400 }
    )
  }

  // 5) 패키지 존재 확인 + slug 조회 (revalidate 경로용)
  const { data: pkg, error: fetchErr } = await supabase
    .from('packages')
    .select('id, slug')
    .eq('id', body.packageId)
    .maybeSingle()

  if (fetchErr || !pkg) {
    return NextResponse.json({ error: '패키지를 찾을 수 없습니다.' }, { status: 404 })
  }

  // 6) 컬럼 UPDATE — packages 테이블 컬럼은 현재 URL 문자열이므로 url 만 저장
  //    fallback_url/alt 등 메타는 content_blocks 를 쓰지 않는 이번 경로에선 일단 보관 안 함.
  //    향후 packages.hero_image_meta jsonb 추가 시 확장 가능.
  const { error: updateErr } = await supabase
    .from('packages')
    .update({
      [body.column]: body.value.url,
      updated_at:    new Date().toISOString(),
    })
    .eq('id', body.packageId)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // 7) 해당 slug 의 상세 페이지 revalidate
  try {
    revalidatePath(`/packages/${pkg.slug}`)
    revalidatePath('/packages') // 리스트도 같이 (향후 리스트에 이미지 들어갈 수 있음)
  } catch (err) {
    console.error('[packages/image] revalidate 실패:', err)
  }

  return NextResponse.json({ success: true, url: body.value.url })
}

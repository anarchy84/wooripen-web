// ─────────────────────────────────────────────
// 인라인 편집 — 상품 이미지 필드 저장 API
//
// 역할 :
//   - 업로드 API (/api/admin/content-blocks/upload) 로 받은 URL 을
//     products 테이블의 특정 컬럼에 기록.
//   - content_blocks 우회 경로 — 중복 저장 없이 단일 진실원 유지.
//
// 보호 :
//   - 인증 필수 (admin)
//   - 컬럼 화이트리스트 (image_url, hero_image 만 허용)
//   - og_image_url 은 이번 패스 제외 — 기존 /admin/products 폼에서 편집
//
// 바디 :
//   {
//     productId: 'uuid',
//     column:    'image_url' | 'hero_image',
//     value:     { url, fallback_url?, alt?, width?, height? }
//   }
// ─────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/auth-admin'

const ALLOWED_COLUMNS = ['image_url', 'hero_image'] as const
type AllowedColumn = (typeof ALLOWED_COLUMNS)[number]

interface ImageValue {
  url:           string
  fallback_url?: string
  alt?:          string
  width?:        number
  height?:       number
}

interface PatchBody {
  productId: string
  column:    AllowedColumn
  value:     ImageValue
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient()

  // 1) 인증
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2) 바디 파싱
  let body: PatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.productId || !body.column || !body.value) {
    return NextResponse.json(
      { error: 'productId, column, value 는 필수입니다.' },
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

  // 4) URL 필수
  if (!body.value.url) {
    return NextResponse.json(
      { error: 'value.url 은 필수입니다.' },
      { status: 400 }
    )
  }

  // 5) 상품 존재 확인 + slug
  const { data: product, error: fetchErr } = await supabase
    .from('products')
    .select('id, slug')
    .eq('id', body.productId)
    .maybeSingle()

  if (fetchErr || !product) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 6) UPDATE
  const { error: updateErr } = await supabase
    .from('products')
    .update({
      [body.column]: body.value.url,
      updated_at:    new Date().toISOString(),
    })
    .eq('id', body.productId)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // 7) 해당 slug 의 상세 + 상품 구성된 패키지들도 revalidate
  //    (image_url 은 /packages/[slug] 에서 구성품으로 노출되기 때문)
  try {
    if (product.slug) {
      revalidatePath(`/products/${product.slug}`)
    }
    // 해당 상품이 포함된 패키지 slug 조회 → 각각 revalidate
    const { data: pkgLinks } = await supabase
      .from('package_items')
      .select('package:packages(slug)')
      .eq('product_id', body.productId)

    const pkgSlugs = new Set<string>()
    ;(pkgLinks || []).forEach((link: unknown) => {
      const l = link as { package?: { slug?: string } | null }
      if (l.package?.slug) pkgSlugs.add(l.package.slug)
    })
    pkgSlugs.forEach((slug) => revalidatePath(`/packages/${slug}`))
  } catch (err) {
    console.error('[products/image] revalidate 실패:', err)
  }

  return NextResponse.json({ success: true, url: body.value.url })
}

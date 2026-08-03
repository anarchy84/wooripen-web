import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { normalizeSlug } from '@/lib/slug'
import { findMediaUsage, extractStoragePath } from '@/lib/media-usage'
import { isAdmin } from '@/lib/auth-admin'

// sharp 는 native 모듈 — Edge runtime 에서 안 됨. 명시적으로 nodejs 강제
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Vercel function body 기본 4.5MB. Pro 플랜은 100MB 까지 풀 수 있음.
// 큰 파일도 받을 수 있게 maxDuration 도 늘려 놓음 (sharp 처리 시간 여유)
export const maxDuration = 60

// GET: 미디어 목록
export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: 이미지 업로드 + WebP 변환
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const altText = formData.get('alt_text') as string || ''
  // ── preset : 용도별 표준 사이즈 ────────────────────────
  //   'content'  (default) : 본문 — 최대 1600px·종횡비 유지·webp
  //   'featured'           : 대표/OG — 1200x630 fit:cover·webp
  //   'thumb'              : 썸네일 — 800x450 fit:cover·webp
  //   'raw'                : 원본 그대로 (resize 안 함)
  const preset = (formData.get('preset') as string || 'content').toLowerCase()

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // 파일 크기 제한 (30MB) — Vercel body limit (Pro 100MB) 안에서 여유
  // sharp 가 메모리에서 처리 가능한 일반적인 사진 사이즈 한도
  if (file.size > 30 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 30MB)' }, { status: 400 })
  }

  // 허용 타입
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // 파일명 정리 — Storage path 는 ASCII 안전이 핵심.
  // 한글/특수문자가 들어가면 일부 CDN·브라우저에서 URL 인코딩이 깨질 수 있으므로
  // normalizeSlug 로 한글 제거 + 소문자·하이픈만 남긴다.
  // 결과가 비면 'image' 폴백.
  const rawBase = file.name.replace(/\.[^/.]+$/, '')
  const safeName = normalizeSlug(rawBase) || 'image'
  const timestamp = Date.now()
  const baseName = safeName

  // preset → sharp resize 옵션 매핑
  //   - content : 너비 1600 캡 (큰 이미지만 줄임)
  //   - featured : 1200x630 cover (OG 표준)
  //   - thumb : 800x450 cover (16:9 카드 그리드 일관)
  //   - raw : resize 안 함 (관리자 직접 지정)
  function resizeOptionsFor(p: string): sharp.ResizeOptions | null {
    switch (p) {
      case 'featured':
        return { width: 1200, height: 630, fit: 'cover', position: 'attention' }
      case 'thumb':
        return { width: 800, height: 450, fit: 'cover', position: 'attention' }
      case 'raw':
        return null
      case 'content':
      default:
        return { width: 1600, withoutEnlargement: true }
    }
  }

  // sharp로 WebP 변환 + 리사이즈
  let webpBuffer: Buffer
  let metadata: sharp.Metadata

  try {
    const sharpInstance = sharp(buffer)
    metadata = await sharpInstance.metadata()

    const resizeOpts = resizeOptionsFor(preset)
    let pipeline = sharpInstance
    if (resizeOpts) pipeline = pipeline.resize(resizeOpts)

    webpBuffer = await pipeline
      .webp({ quality: 82 })
      .toBuffer()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Image processing failed'
    console.error('[media sharp]', err)
    return NextResponse.json(
      { error: `Image processing failed: ${msg}` },
      { status: 500 },
    )
  }

  // 원본 업로드
  const originalPath = `uploads/${timestamp}-${baseName}.${file.type.split('/')[1]}`
  const { error: origErr } = await supabase.storage
    .from('media')
    .upload(originalPath, buffer, { contentType: file.type })

  if (origErr) {
    return NextResponse.json({ error: `Original upload failed: ${origErr.message}` }, { status: 500 })
  }

  // WebP 업로드
  const webpPath = `uploads/${timestamp}-${baseName}.webp`
  const { error: webpErr } = await supabase.storage
    .from('media')
    .upload(webpPath, webpBuffer, { contentType: 'image/webp' })

  if (webpErr) {
    return NextResponse.json({ error: `WebP upload failed: ${webpErr.message}` }, { status: 500 })
  }

  // public URL 생성
  const { data: origUrl } = supabase.storage.from('media').getPublicUrl(originalPath)
  const { data: webpUrl } = supabase.storage.from('media').getPublicUrl(webpPath)

  // DB에 기록
  const { data: mediaRecord, error: dbErr } = await supabase
    .from('media')
    .insert({
      file_name: file.name,
      storage_path: origUrl.publicUrl,
      webp_path: webpUrl.publicUrl,
      mime_type: file.type,
      file_size: file.size,
      width: metadata.width || null,
      height: metadata.height || null,
      alt_text: altText,
    })
    .select()
    .single()

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  return NextResponse.json(mediaRecord, { status: 201 })
}

// DELETE: 전체 비우기
//   /api/admin/media?all=1            — 미사용 미디어만 비움. 사용 중인 row 는 건드리지 않음.
//   /api/admin/media?all=1&force=1    — 사용 여부 무시하고 전부 삭제 (콘텐츠 깨질 수 있음)
//
// 안전장치 :
//   - all=1 쿼리 파라미터 명시 안 하면 거부 (실수로 호출되는 거 방지)
//   - force=1 일 때만 사용 중 이미지도 삭제
//   - 응답에 deleted_count / skipped_count 둘 다 반환
export async function DELETE(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = request.nextUrl.searchParams.get('all') === '1'
  const force = request.nextUrl.searchParams.get('force') === '1'

  if (!all) {
    return NextResponse.json(
      { error: 'Missing all=1 — bulk delete must be explicit' },
      { status: 400 },
    )
  }

  // 모든 미디어 fetch
  const { data: allMedia, error: fetchErr } = await supabase
    .from('media')
    .select('*')
  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }
  if (!allMedia || allMedia.length === 0) {
    return NextResponse.json({ deleted_count: 0, skipped_count: 0 })
  }

  // 사용 중인 URL 집합 — force=1 이면 검색 skip
  const usedUrls = new Set<string>()
  if (!force) {
    const allUrls = allMedia.flatMap((m) => [m.storage_path, m.webp_path]).filter(Boolean) as string[]
    const usage = await findMediaUsage(supabase, allUrls)
    for (const u of usage) usedUrls.add(u.url)
  }

  // 삭제 대상 / 보존 대상 분리
  const toDelete = allMedia.filter((m) => {
    if (force) return true
    return !usedUrls.has(m.storage_path) && !(m.webp_path && usedUrls.has(m.webp_path))
  })
  const skipped = allMedia.length - toDelete.length

  if (toDelete.length === 0) {
    return NextResponse.json({ deleted_count: 0, skipped_count: skipped })
  }

  // Storage 일괄 제거
  const storagePaths = toDelete
    .flatMap((m) => [extractStoragePath(m.storage_path), extractStoragePath(m.webp_path)])
    .filter(Boolean) as string[]

  if (storagePaths.length > 0) {
    const { error: storageErr } = await supabase.storage
      .from('media')
      .remove(storagePaths)
    if (storageErr) {
      console.warn('[media bulk DELETE storage]', storageErr.message)
    }
  }

  // DB 일괄 삭제
  const ids = toDelete.map((m) => m.id)
  const { error: dbErr } = await supabase
    .from('media')
    .delete()
    .in('id', ids)

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  return NextResponse.json({
    deleted_count: toDelete.length,
    skipped_count: skipped,
  })
}

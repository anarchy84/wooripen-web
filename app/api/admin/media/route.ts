import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// sharp 는 native 모듈 — Edge runtime 에서 안 됨. 명시적으로 nodejs 강제
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

  // 파일 크기 제한 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  // 허용 타입
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // 파일명 정리 (한글 → slug)
  const baseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
  const timestamp = Date.now()

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

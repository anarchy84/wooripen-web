import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

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

  // sharp로 WebP 변환 + 리사이즈 (최대 1200px)
  let webpBuffer: Buffer
  let metadata: sharp.Metadata

  try {
    const sharpInstance = sharp(buffer)
    metadata = await sharpInstance.metadata()

    webpBuffer = await sharpInstance
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
  } catch {
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 })
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

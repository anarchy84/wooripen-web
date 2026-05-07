// ─────────────────────────────────────────────
// 미디어 단일 row API
//   GET    /api/admin/media/[id]            — row + usage 정보 조회
//   DELETE /api/admin/media/[id]            — 사용 중이면 409 + usage list 반환
//   DELETE /api/admin/media/[id]?force=1    — 사용 여부 무시하고 삭제
//
// 삭제 절차 :
//   1) usage 검색 (force=1 이면 skip)
//   2) Storage 에서 원본 + WebP 파일 제거
//   3) DB row 제거
// ─────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { findUsageForMedia, extractStoragePath } from '@/lib/media-usage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Ctx {
  params: { id: string }
}

// GET — row + usage 조회
export async function GET(_req: NextRequest, { params }: Ctx) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: media, error } = await supabase
    .from('media')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !media) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const usage = await findUsageForMedia(supabase, media)
  return NextResponse.json({ media, usage })
}

// DELETE — 단일 미디어 삭제
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const force = req.nextUrl.searchParams.get('force') === '1'

  const { data: media, error: fetchErr } = await supabase
    .from('media')
    .select('*')
    .eq('id', params.id)
    .single()

  if (fetchErr || !media) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // 사용처 검색 — force 가 아니면 사용 중일 때 거부
  if (!force) {
    const usage = await findUsageForMedia(supabase, media)
    if (usage.length > 0) {
      return NextResponse.json(
        { error: 'In use', usage },
        { status: 409 },
      )
    }
  }

  // Storage 파일 제거 (원본 + WebP)
  const storagePaths = [
    extractStoragePath(media.storage_path),
    extractStoragePath(media.webp_path),
  ].filter(Boolean) as string[]

  if (storagePaths.length > 0) {
    const { error: storageErr } = await supabase.storage
      .from('media')
      .remove(storagePaths)
    // Storage 에러는 로그만 남기고 진행 — 이미 없는 파일일 수도 있음
    if (storageErr) {
      console.warn('[media DELETE storage]', storageErr.message)
    }
  }

  // DB row 제거
  const { error: dbErr } = await supabase
    .from('media')
    .delete()
    .eq('id', params.id)

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, deleted_id: params.id }, { status: 200 })
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // key-value 형태로 변환
  const settings: Record<string, string> = {}
  data?.forEach((row: { key: string; value: string | null }) => {
    settings[row.key] = row.value || ''
  })
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as Record<string, string>

  // upsert 각 설정
  for (const [key, value] of Object.entries(body)) {
    await supabase
      .from('site_settings')
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
  }

  return NextResponse.json({ success: true })
}

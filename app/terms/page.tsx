// ─────────────────────────────────────────────
// /terms — 이용약관
//
// 배경 (2026-08-03) :
//   푸터의 '이용약관' 링크 2곳(회사 링크 배열 + 하단 바)이 404 였다.
//   약관 전문은 법무 문안이라 코드에 박지 않고 site_settings.terms_of_service
//   에서 읽는다 → 어드민 > 사이트 설정에서 입력하면 즉시 반영(revalidate 0).
//
// app/privacy/page.tsx 와 같은 패턴·같은 레이아웃을 따른다.
// ─────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// 공개 페이지 — SSR로 매 요청 시 최신 설정 값 (어드민에서 즉시 반영)
export const revalidate = 0

async function getTerms(): Promise<string> {
  const supabase = createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('key', 'terms_of_service')
    .maybeSingle()

  return (data as { value?: string | null } | null)?.value || ''
}

export const metadata = {
  title: '이용약관 · 우리편',
  description: '우리편 서비스 이용약관 안내',
}

export default async function TermsPage() {
  const terms = await getTerms()

  return (
    <>
      {/* ═════ 히어로 ═════ */}
      <section className="pt-32 pb-12 md:pt-36 md:pb-16 bg-gray-50 border-b border-gray-100">
        <div className="section-container">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
            이용약관
          </h1>
          <p className="mt-4 text-base text-gray-500 leading-relaxed break-keep max-w-2xl">
            우리편 서비스 이용에 관한 조건과 절차를 안내드립니다.
          </p>
        </div>
      </section>

      {/* ═════ 본문 ═════ */}
      <section className="section-container py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <article className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
            {terms ? (
              // 장문 텍스트는 whitespace-pre-wrap 으로 줄바꿈·공백 그대로 렌더
              <div className="text-sm md:text-[15px] text-gray-700 leading-7 whitespace-pre-wrap break-keep">
                {terms}
              </div>
            ) : (
              <div className="text-sm md:text-[15px] text-gray-500 leading-7 break-keep">
                <p>약관 전문이 아직 등록되지 않았습니다.</p>
                <p className="mt-2">
                  문의사항은{' '}
                  <a href="tel:1600-6116" className="text-primary font-medium hover:underline">
                    1600-6116
                  </a>{' '}
                  으로 연락주세요.
                </p>
              </div>
            )}
          </article>

          {/* 하단 네비 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">
              개인정보처리방침 보기
            </Link>
            <Link href="/" className="text-sm font-medium text-primary hover:underline">
              홈으로 돌아가기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

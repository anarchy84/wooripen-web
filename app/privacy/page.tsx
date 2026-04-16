import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// 공개 페이지 — SSR로 매 요청 시 최신 설정 값을 가져옴 (어드민에서 즉시 반영)
export const revalidate = 0

interface LegalSections {
  privacy_policy: string
  third_party_consent_text: string
  marketing_consent_text: string
}

// site_settings 테이블에서 법적 고지 3종 값을 읽어온다
async function getLegalSections(): Promise<LegalSections> {
  const supabase = createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['privacy_policy', 'third_party_consent_text', 'marketing_consent_text'])

  const map: Record<string, string> = {}
  data?.forEach((row: { key: string; value: string | null }) => {
    map[row.key] = row.value || ''
  })

  return {
    privacy_policy: map.privacy_policy || '내용이 아직 등록되지 않았습니다. 어드민에서 설정해주세요.',
    third_party_consent_text: map.third_party_consent_text || '내용이 아직 등록되지 않았습니다.',
    marketing_consent_text: map.marketing_consent_text || '내용이 아직 등록되지 않았습니다.',
  }
}

export const metadata = {
  title: '개인정보처리방침 · 우리편',
  description: '우리편의 개인정보 수집·이용, 제3자 제공, 마케팅 수신 관련 방침 안내',
}

export default async function PrivacyPage() {
  const sections = await getLegalSections()

  // 본문 섹션 정의 (anchor id 포함) — 상담 폼의 [자세히 보기] 링크가 이 id로 스크롤됨
  const items: { id: string; title: string; badge: string; body: string }[] = [
    {
      id: 'personal',
      title: '개인정보 수집·이용 동의',
      badge: '필수',
      body: sections.privacy_policy,
    },
    {
      id: 'third-party',
      title: '제3자 제공 동의',
      badge: '필수',
      body: sections.third_party_consent_text,
    },
    {
      id: 'marketing',
      title: '마케팅 정보 수신 동의',
      badge: '선택',
      body: sections.marketing_consent_text,
    },
  ]

  return (
    <>
      {/* ═════ 히어로 ═════ */}
      <section className="pt-32 pb-12 md:pt-36 md:pb-16 bg-gray-50 border-b border-gray-100">
        <div className="section-container">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
            개인정보처리방침
          </h1>
          <p className="mt-4 text-base text-gray-500 leading-relaxed break-keep max-w-2xl">
            우리편이 이용자의 개인정보를 어떻게 수집·이용·보호하는지 안내드립니다.
            상담 신청 시 수집되는 정보와 이용자의 권리를 아래에서 확인하실 수 있어요.
          </p>

          {/* 섹션 바로가기 */}
          <nav className="mt-8 flex flex-wrap gap-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <span className="text-xs text-gray-400">[{item.badge}]</span>
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ═════ 본문 섹션 ═════ */}
      <section className="section-container py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {items.map((item) => (
            <article
              key={item.id}
              id={item.id}
              // scroll-mt: 상단 헤더 높이만큼 스크롤 오프셋 (anchor 링크 정확히 맞춤)
              className="scroll-mt-24 bg-white border border-gray-100 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.badge === '필수'
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {item.badge}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  {item.title}
                </h2>
              </div>

              {/* 장문 텍스트는 whitespace-pre-wrap 으로 줄바꿈·공백 그대로 렌더 */}
              <div className="text-sm md:text-[15px] text-gray-700 leading-7 whitespace-pre-wrap break-keep">
                {item.body}
              </div>
            </article>
          ))}

          {/* 하단 네비 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              본 방침은 어드민에서 즉시 수정 가능합니다.
            </p>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              홈으로 돌아가기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

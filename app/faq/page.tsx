// FAQ 공개 페이지
// faqs 테이블에서 is_active=true 항목을 카테고리별 아코디언으로 보여줌
// SSR — SEO 최적화 (자주 묻는 질문은 검색엔진 노출 중요)

import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { FAQ_CATEGORIES } from '@/types/database'

export const metadata: Metadata = {
  title: '자주 묻는 질문 (FAQ) | 우리편',
  description:
    '우리편 서비스에 대해 자주 묻는 질문과 답변입니다. 인터넷, 결제단말기, CCTV, 키오스크, 렌탈 관련 궁금한 점을 확인하세요.',
  openGraph: {
    title: '자주 묻는 질문 (FAQ) | 우리편',
    description:
      '소상공인 사장님들이 자주 묻는 인터넷·단말기·CCTV·키오스크·렌탈 관련 질문과 답변.',
  },
}

// FAQ 카테고리 정보 (아이콘·색상 매핑)
const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  general:  { icon: 'solar:chat-round-dots-bold-duotone',  color: 'text-gray-600',   bg: 'bg-gray-100' },
  internet: { icon: 'solar:global-bold-duotone',           color: 'text-blue-600',   bg: 'bg-blue-50' },
  terminal: { icon: 'solar:card-bold-duotone',             color: 'text-green-600',  bg: 'bg-green-50' },
  cctv:     { icon: 'solar:videocamera-record-bold-duotone', color: 'text-red-600', bg: 'bg-red-50' },
  torder:   { icon: 'solar:tablet-bold-duotone',           color: 'text-purple-600', bg: 'bg-purple-50' },
  rental:   { icon: 'solar:water-bold-duotone',            color: 'text-cyan-600',   bg: 'bg-cyan-50' },
}

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  sort_order: number
}

// 서버사이드 데이터 조회
async function getFaqs() {
  const supabase = createClient()
  const { data } = await supabase
    .from('faqs')
    .select('id, question, answer, category, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (data || []) as FaqItem[]
}

export default async function FAQPage() {
  const faqs = await getFaqs()

  // 카테고리별 그룹핑 (등록된 카테고리만 노출)
  const grouped = faqs.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = []
    acc[faq.category].push(faq)
    return acc
  }, {})

  // 카테고리 순서 고정 (general 먼저, 나머지는 FAQ_CATEGORIES 순서)
  const categoryOrder = ['general', 'internet', 'terminal', 'cctv', 'torder', 'rental']
  const orderedCategories = categoryOrder.filter((cat) => grouped[cat])

  return (
    <div className="min-h-screen bg-white">
      {/* ─── 히어로 ─────────────────────────────────── */}
      <section
        className="relative pt-32 pb-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full mb-6 backdrop-blur">
            FAQ
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 break-keep">
            자주 묻는 질문
          </h1>
          <p className="text-lg text-white/70 break-keep">
            궁금한 점이 있으신가요? 아래에서 답변을 확인해보세요.
          </p>
        </div>
      </section>

      {/* ─── FAQ 카테고리별 아코디언 ─────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {faqs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Icon icon="solar:chat-round-dots-line-duotone" className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>FAQ가 준비 중입니다. 곧 업데이트됩니다!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {orderedCategories.map((category) => {
                const items = grouped[category]
                const meta = CATEGORY_META[category] || CATEGORY_META.general
                const label = FAQ_CATEGORIES[category] || category

                return (
                  <div key={category}>
                    {/* 카테고리 헤더 */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center`}>
                        <Icon icon={meta.icon} className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{label}</h2>
                        <p className="text-xs text-gray-400">{items.length}개의 질문</p>
                      </div>
                    </div>

                    {/* 아코디언 */}
                    <div className="space-y-3">
                      {items.map((faq) => (
                        <details
                          key={faq.id}
                          className="group bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                        >
                          <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                            <span className="font-medium text-gray-900 pr-4 break-keep">
                              {faq.question}
                            </span>
                            <Icon
                              icon="solar:alt-arrow-down-line-duotone"
                              className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200"
                            />
                          </summary>
                          <div className="px-5 pb-5 -mt-1">
                            <div className="pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-keep">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── 못 찾은 질문 CTA ─────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <Icon icon="solar:question-circle-bold-duotone" className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3 break-keep">
            찾으시는 답변이 없으신가요?
          </h3>
          <p className="text-gray-500 mb-6 break-keep">
            전문 상담사에게 직접 문의하시면 빠르게 답변해드립니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/recommend"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition-colors"
            >
              무료 상담 신청
            </Link>
            <a
              href="tel:1600-6116"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors"
            >
              📞 1600-6116
            </a>
            <Link
              href="/qna"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors"
            >
              Q&A 게시판
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

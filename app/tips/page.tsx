'use client'

// ─────────────────────────────────────────────
// 꿀팁(블로그) 목록 페이지
//
// 변경 이력 :
//   - 2026-05-06: 하드코딩 posts 제거 → Supabase tips 테이블 SELECT
//     · is_published=true 글만 노출 (RLS 도 동일 정책)
//     · created_at desc 정렬
//     · 카드 클릭 → /tips/[slug] 상세 페이지로 이동
//     · 카테고리 필터(useState) 그대로 유지
//     · 뉴스레터 폼 그대로 유지 (TODO: /api/newsletter 연동)
// ─────────────────────────────────────────────
import { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import { createClient } from '@/lib/supabase/client'

// DB 컬럼 + UI 보조 (icon/color 는 카테고리별 매핑)
interface TipRow {
  id: string
  slug: string
  title: string
  excerpt: string | null
  category: string
  featured_image_url: string | null
  published_at: string | null
  created_at: string
}

// 카테고리 → 뱃지 색상 / 아이콘 매핑 (DB 에 메타로 두기엔 과해서 클라에서 룩업)
const CATEGORY_META: Record<string, { color: string; icon: string }> = {
  인터넷:    { color: 'bg-blue-50 text-blue-600',     icon: 'solar:global-bold-duotone' },
  단말기:    { color: 'bg-violet-50 text-violet-600', icon: 'solar:card-recive-bold-duotone' },
  CCTV:      { color: 'bg-emerald-50 text-emerald-600', icon: 'solar:videocamera-record-bold-duotone' },
  키오스크:  { color: 'bg-orange-50 text-orange-600', icon: 'solar:tablet-bold-duotone' },
  가이드:    { color: 'bg-gray-100 text-gray-600',    icon: 'solar:checklist-bold-duotone' },
  프로모션:  { color: 'bg-rose-50 text-rose-600',     icon: 'solar:gift-bold-duotone' },
  렌탈:      { color: 'bg-teal-50 text-teal-600',     icon: 'solar:refresh-bold-duotone' },
}
const FALLBACK_META = { color: 'bg-gray-100 text-gray-600', icon: 'solar:document-text-bold-duotone' }

const CATEGORIES = ['전체', '인터넷', '단말기', 'CCTV', '키오스크', '가이드']

// 읽는 시간 추정 (excerpt 길이 기반 — 글 본문 fetch 안 해도 대략 표시 가능)
function estimateReadMin(excerpt: string | null): number {
  // 평균 한국어 200자/분 가정. excerpt 길이 × 8 (본문 추정 배수) / 200
  const n = (excerpt?.length ?? 0) * 8
  return Math.max(2, Math.round(n / 200))
}

export default function TipsPage() {
  // 카테고리 필터
  const [activeCategory, setActiveCategory] = useState<string>('전체')
  // Supabase 글 데이터
  const [tips, setTips] = useState<TipRow[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  // 뉴스레터 폼
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  // 마운트 시 1회 fetch — 발행된 글만, 최신순
  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tips')
        .select('id, slug, title, excerpt, category, featured_image_url, published_at, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(60)
      if (error) {
        setLoadError(error.message)
        setTips([])
        return
      }
      setTips((data ?? []) as TipRow[])
    }
    run()
  }, [])

  // 카테고리 필터링
  const filtered = (tips ?? []).filter(
    (p) => activeCategory === '전체' || p.category === activeCategory
  )

  // 뉴스레터 (TODO: /api/newsletter 연동)
  async function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setNewsletterStatus('error')
      return
    }
    setNewsletterStatus('loading')
    try {
      await new Promise((r) => setTimeout(r, 600))
      setNewsletterStatus('success')
      setEmail('')
    } catch {
      setNewsletterStatus('error')
    }
  }

  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 flex items-center min-h-[34rem] md:min-h-[44rem] pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[160px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[120px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div className="section-container relative">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-6">
              <Icon icon="solar:notebook-bold-duotone" className="h-4 w-4 text-teal-400" />
              <span className="text-small text-gray-400">사업자 꿀팁</span>
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              사장님들이<br />
              <span className="text-gradient">꼭 알아야 할</span><br />
              매장 운영 꿀팁
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
              인터넷·단말기·CCTV·키오스크,
              매장 인프라에 관한 실용적인 정보를 모았어요.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 블로그 목록 ══════ */}
      <section className="section-container section-gap">
        {/* 카테고리 필터 */}
        <FadeIn>
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </FadeIn>

        {/* 카드 그리드 */}
        {tips === null ? (
          // 로딩 중 — 스켈레톤
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl bg-gray-50 p-7 animate-pulse">
                <div className="h-5 w-20 bg-gray-200 rounded-full mb-4" />
                <div className="h-10 w-10 bg-gray-200 rounded mb-4" />
                <div className="h-5 w-full bg-gray-200 rounded mb-2" />
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          // 로드 실패
          <div className="py-16 text-center">
            <p className="text-red-500 text-sm">
              데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
            <p className="text-gray-400 text-xs mt-2">{loadError}</p>
          </div>
        ) : filtered.length === 0 ? (
          // 빈 결과
          <div className="py-16 text-center">
            <Icon
              icon="solar:notebook-square-bold-duotone"
              className="h-12 w-12 text-gray-300 mx-auto mb-3"
            />
            <p className="text-gray-400">
              {activeCategory === '전체'
                ? '아직 작성된 꿀팁이 없습니다. 곧 업데이트될 예정이에요.'
                : `${activeCategory} 카테고리에 글이 없습니다. 다른 카테고리를 둘러보세요.`}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((tip, i) => {
              const meta = CATEGORY_META[tip.category] ?? FALLBACK_META
              const date = new Date(tip.published_at ?? tip.created_at).toLocaleDateString(
                'ko-KR',
                { year: 'numeric', month: '2-digit', day: '2-digit' }
              )
              const readMin = estimateReadMin(tip.excerpt)
              return (
                <FadeIn key={tip.id} delay={i * 80}>
                  <Link
                    href={`/tips/${encodeURIComponent(tip.slug)}`}
                    className="group block rounded-3xl bg-gray-50 p-7 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card-hover hover:-translate-y-1"
                  >
                    {/* 카테고리 + 읽기 시간 */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${meta.color}`}
                      >
                        {tip.category}
                      </span>
                      <span className="text-xs text-gray-400">{readMin}분 읽기</span>
                    </div>

                    {/* 대표이미지 또는 아이콘 */}
                    {tip.featured_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tip.featured_image_url}
                        alt={tip.title}
                        className="w-full aspect-[16/9] object-cover rounded-xl mb-4 border border-gray-100"
                      />
                    ) : (
                      <Icon
                        icon={meta.icon}
                        className="h-10 w-10 text-gray-300 mb-4 transition-colors duration-300 group-hover:text-primary"
                      />
                    )}

                    {/* 제목 */}
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug break-keep line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {tip.title}
                    </h3>

                    {/* 요약 */}
                    {tip.excerpt && (
                      <p className="mt-3 text-sm text-gray-500 leading-relaxed break-keep line-clamp-3">
                        {tip.excerpt}
                      </p>
                    )}

                    {/* 날짜 + 화살표 */}
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{date}</span>
                      <Icon
                        icon="solar:arrow-right-linear"
                        className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors"
                      />
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        )}

        {/* 더보기 안내 */}
        {tips !== null && filtered.length > 0 && (
          <FadeIn delay={500}>
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-400 break-keep">
                더 많은 꿀팁이 곧 업데이트됩니다.
              </p>
            </div>
          </FadeIn>
        )}
      </section>

      {/* ══════ 뉴스레터 CTA (작동) ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="max-w-xl mx-auto text-center">
              <Icon icon="solar:letter-bold-duotone" className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight break-keep">
                새 글이 올라오면 알려드릴까요?
              </h2>
              <p className="mt-3 text-base text-gray-500 break-keep">
                매장 운영에 도움 되는 꿀팁을 이메일로 받아보세요.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  placeholder="이메일 주소"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all duration-300 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {newsletterStatus === 'loading' ? '처리 중…' : newsletterStatus === 'success' ? '신청 완료' : '구독하기'}
                </button>
              </form>

              {newsletterStatus === 'success' && (
                <p className="mt-4 text-sm text-emerald-600 font-medium">
                  ✓ 사전 신청이 접수되었습니다. 뉴스레터 시작 시 가장 먼저 안내드릴게요.
                </p>
              )}
              {newsletterStatus === 'error' && (
                <p className="mt-4 text-sm text-red-500 font-medium">
                  이메일 주소를 확인해주세요.
                </p>
              )}
              {newsletterStatus === 'idle' && (
                <p className="mt-3 text-xs text-gray-400">스팸 없이, 유용한 정보만 보내드려요.</p>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 보조 CTA — 급한 질문은 Q&A로 ══════ */}
      <section className="bg-gray-900">
        <div className="section-container py-16">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Icon icon="solar:chat-square-like-bold-duotone" className="h-10 w-10 text-teal-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight break-keep">
                급한 궁금증, 글 올라오길 기다릴 수 없다면?
              </h3>
              <p className="mt-3 text-sm md:text-base text-gray-400 break-keep">
                Q&amp;A에 바로 질문 올려주세요. 평균 24시간 안에 답변드립니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Link
                  href="/qna"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  Q&amp;A로 질문하기
                  <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
                </Link>
                <a
                  href="tel:1600-6116"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                >
                  <Icon icon="solar:phone-bold" className="h-4 w-4" />
                  1600-6116
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}

import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'

/* ── 블로그 카드 데이터 (추후 Supabase로 교체) ── */
interface TipPost {
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  icon: string
  date: string
  readMin: number
}

const posts: TipPost[] = [
  {
    slug: 'card-terminal-fee-guide',
    title: '카드 수수료 아끼는 5가지 방법 (2026년 최신)',
    excerpt: '영세·중소 가맹점 우대 수수료부터 VAN사 비교까지, 실질적으로 수수료를 줄일 수 있는 방법을 정리했어요.',
    category: '단말기',
    categoryColor: 'bg-violet-50 text-violet-600',
    icon: 'solar:card-recive-bold-duotone',
    date: '2026.04.10',
    readMin: 5,
  },
  {
    slug: 'biz-internet-vs-home',
    title: '사업자 인터넷 vs 가정용 인터넷, 뭐가 다를까?',
    excerpt: '고정IP, 안정성, 세금계산서 발행 등 사업자 인터넷만의 차이점을 쉽게 설명해드려요.',
    category: '인터넷',
    categoryColor: 'bg-blue-50 text-blue-600',
    icon: 'solar:global-bold-duotone',
    date: '2026.04.08',
    readMin: 4,
  },
  {
    slug: 'cctv-channel-guide',
    title: '우리 매장에 CCTV 몇 대가 필요할까? 채널 수 가이드',
    excerpt: '매장 크기·구조별 추천 채널 수, 카메라 종류 선택 팁, 저장 기간 계산법까지 총정리.',
    category: 'CCTV',
    categoryColor: 'bg-emerald-50 text-emerald-600',
    icon: 'solar:videocamera-record-bold-duotone',
    date: '2026.04.05',
    readMin: 6,
  },
  {
    slug: 'kiosk-roi-calculation',
    title: '키오스크 도입하면 정말 이득일까? ROI 계산법',
    excerpt: '인건비 절감, 객단가 상승, 월 렌탈비를 고려한 실질 ROI를 업종별로 계산해봤어요.',
    category: '키오스크',
    categoryColor: 'bg-orange-50 text-orange-600',
    icon: 'solar:tablet-bold-duotone',
    date: '2026.04.02',
    readMin: 7,
  },
  {
    slug: 'new-store-checklist',
    title: '신규 매장 오픈 체크리스트: 인프라편',
    excerpt: '인터넷 개통, 카드단말기, CCTV, 키오스크까지 — 매장 오픈 전 꼭 챙겨야 할 인프라를 순서대로 정리했어요.',
    category: '가이드',
    categoryColor: 'bg-gray-100 text-gray-600',
    icon: 'solar:checklist-bold-duotone',
    date: '2026.03.28',
    readMin: 8,
  },
  {
    slug: 'van-company-comparison',
    title: 'VAN사 비교: NICE vs KIS vs KICC, 어디가 좋을까?',
    excerpt: '주요 VAN사별 수수료, 정산 주기, 부가서비스를 한눈에 비교해드려요.',
    category: '단말기',
    categoryColor: 'bg-violet-50 text-violet-600',
    icon: 'solar:card-transfer-bold-duotone',
    date: '2026.03.25',
    readMin: 6,
  },
]

const categories = ['전체', '인터넷', '단말기', 'CCTV', '키오스크', '가이드']

export default function TipsPage() {
  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[160px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[120px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.025]"
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
        {/* 카테고리 필터 (SSG이므로 표시만, 추후 Client Component로 분리) */}
        <FadeIn>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat, i) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  i === 0
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 80}>
              <article className="group rounded-3xl bg-gray-50 p-7 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card-hover hover:-translate-y-1">
                {/* 카테고리 + 읽기 시간 */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${post.categoryColor}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.readMin}분 읽기</span>
                </div>

                {/* 아이콘 */}
                <Icon icon={post.icon} className="h-10 w-10 text-gray-300 mb-4 transition-colors duration-300 group-hover:text-primary" />

                {/* 제목 */}
                <h3 className="text-lg font-semibold text-gray-900 leading-snug break-keep line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>

                {/* 요약 */}
                <p className="mt-3 text-sm text-gray-500 leading-relaxed break-keep line-clamp-3">
                  {post.excerpt}
                </p>

                {/* 날짜 + 더보기 */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    읽기
                    <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {/* 더보기 */}
        <FadeIn delay={500}>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400 break-keep">
              더 많은 꿀팁이 곧 업데이트됩니다.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ══════ 뉴스레터 CTA ══════ */}
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
              <form onSubmit={(e) => { e.preventDefault() }} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" placeholder="이메일 주소"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                <button type="submit"
                  className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all duration-300 shrink-0">
                  구독하기
                </button>
              </form>
              <p className="mt-3 text-xs text-gray-400">스팸 없이, 유용한 정보만 보내드려요.</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}

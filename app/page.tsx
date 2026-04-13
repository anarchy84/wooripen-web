import Link from 'next/link'
import {
  Wifi,
  CreditCard,
  Camera,
  Monitor,
  ArrowRight,
  Phone,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   데이터
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const categories = [
  {
    icon: Wifi,
    title: '인터넷',
    desc: 'SKT · KT · LG U+\n전 통신사 비교',
    href: '/internet',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: CreditCard,
    title: '결제단말기',
    desc: '유·무선 카드단말기\n최저가 비교',
    href: '/business/terminal',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    icon: Camera,
    title: 'CCTV',
    desc: '설치부터\n유지보수까지',
    href: '/business/cctv',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Monitor,
    title: '티오더',
    desc: '테이블 오더\n도입 상담',
    href: '/business/torder',
    gradient: 'from-orange-500 to-orange-600',
  },
]

const benefits = [
  {
    num: '01',
    title: '전 통신사 비교',
    desc: 'SKT, KT, LG U+ 상품을 한눈에 비교하고\n매장에 최적인 조합을 찾아드려요.',
  },
  {
    num: '02',
    title: '1:1 전문 상담',
    desc: '업종과 매장 환경에 맞는 전문 상담사가\n불필요한 비용을 줄여드려요.',
  },
  {
    num: '03',
    title: '최대 혜택 보장',
    desc: '현금사은품, 월 요금 할인, 결합할인까지\n받을 수 있는 모든 혜택을 안내해요.',
  },
]

const stats = [
  { value: '10,000+', label: '누적 상담' },
  { value: '98%', label: '만족도' },
  { value: '3사', label: '통신사 비교' },
  { value: '0원', label: '상담 비용' },
]

const faqs = [
  {
    q: '상담 비용이 있나요?',
    a: '아니요. 상담부터 설치까지 모든 과정이 무료입니다.',
  },
  {
    q: '기존 통신사에서 변경할 수 있나요?',
    a: '네. 기존 계약 상태를 확인한 뒤, 위약금 대비 혜택이 더 큰 최적의 시점을 안내해드립니다.',
  },
  {
    q: '설치까지 얼마나 걸리나요?',
    a: '인터넷은 3~5 영업일, 단말기·CCTV는 상담 후 1~3일 내 설치가 가능합니다.',
  },
  {
    q: '사업자등록증이 꼭 필요한가요?',
    a: '사업자 전용 상품은 사업자등록증이 필요하며, 개인 가입도 별도로 안내해드립니다.',
  },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   페이지
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function HomePage() {
  return (
    <>
      {/* ── 히어로 ────────────────────────── */}
      <section className="relative bg-gray-950 overflow-hidden">
        {/* 배경 그라데이션 오브 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
        </div>

        <div className="section-container relative">
          <div className="pt-40 pb-24 md:pt-48 md:pb-34 lg:pt-56 lg:pb-40">
            {/* 뱃지 */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-small text-gray-400">소상공인 편에 서는 유일한 파트너</span>
            </div>

            {/* 메인 카피 */}
            <h1 className="text-display-3 md:text-display-2 lg:text-display-1 text-white max-w-3xl">
              인터넷, 단말기, CCTV
              <br />
              <span className="text-gradient">한번에 비교하고</span>
              <br />
              최대 혜택으로
            </h1>

            <p className="mt-6 md:mt-8 text-body-1 text-gray-400 max-w-lg leading-relaxed">
              전 통신사 상품 비교부터 설치까지,
              <br className="hidden md:block" />
              전문 상담사가 우리 매장에 딱 맞는 솔루션을 찾아드립니다.
            </p>

            {/* CTA 버튼 */}
            <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-3">
              <Link href="/recommend" className="btn-primary group">
                내 매장 혜택 확인하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:1234-5678"
                className="btn-outline border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/30"
              >
                <Phone className="mr-2 h-4 w-4" />
                1234-5678
              </a>
            </div>
          </div>
        </div>

        {/* 히어로 하단 곡선 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" className="w-full">
            <path d="M0 56h1440V28C1440 28 1140 0 720 0S0 28 0 28v28z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── 카테고리 카드 ────────────────── */}
      <section className="section-container -mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative rounded-3xl bg-gray-50 p-6 md:p-8
                         transition-all duration-300 ease-toss
                         hover:bg-white hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className={`
                w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient}
                flex items-center justify-center mb-5
                transition-transform duration-300 ease-toss
                group-hover:scale-110
              `}>
                <cat.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-heading-3 text-gray-900">{cat.title}</h3>
              <p className="mt-2 text-caption text-gray-500 whitespace-pre-line">{cat.desc}</p>
              <ArrowRight className="
                mt-4 h-4 w-4 text-gray-300
                transition-all duration-300 ease-toss
                group-hover:text-gray-900 group-hover:translate-x-1
              " />
            </Link>
          ))}
        </div>
      </section>

      {/* ── 왜 우리편인가 ────────────────── */}
      <section className="section-gap">
        <div className="section-container">
          {/* 섹션 헤딩 */}
          <div className="max-w-xl">
            <p className="text-caption font-semibold text-primary mb-3">WHY WOORIPEN</p>
            <h2 className="text-heading-1 md:text-display-3 text-gray-900">
              왜 우리편인가요?
            </h2>
            <p className="mt-4 text-body-1 text-gray-500">
              직접 발품 팔 필요 없이, 한 번의 상담으로 최적의 조건을 찾아드립니다.
            </p>
          </div>

          {/* 베네핏 카드 */}
          <div className="mt-16 md:mt-20 grid md:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((b) => (
              <div key={b.num} className="group">
                <span className="text-display-2 font-bold text-gray-100 group-hover:text-primary-50 transition-colors duration-500">
                  {b.num}
                </span>
                <h3 className="mt-4 text-heading-2 text-gray-900">{b.title}</h3>
                <p className="mt-3 text-body-2 text-gray-500 whitespace-pre-line leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 숫자 배너 ────────────────────── */}
      <section className="bg-gray-50">
        <div className="section-container section-gap-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-display-3 md:text-display-2 font-bold text-gray-900">
                  {s.value}
                </p>
                <p className="mt-2 text-caption text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 프로세스 ─────────────────────── */}
      <section className="section-gap">
        <div className="section-container">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-caption font-semibold text-primary mb-3">PROCESS</p>
            <h2 className="text-heading-1 md:text-display-3 text-gray-900">
              3단계면 끝나요
            </h2>
          </div>

          <div className="mt-16 md:mt-20 grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: '상담 신청',
                desc: '1분이면 충분해요.\n간단한 정보만 입력하세요.',
                icon: MessageCircle,
              },
              {
                step: '02',
                title: '맞춤 비교',
                desc: '전문 상담사가 매장에\n최적인 상품을 비교해드려요.',
                icon: CheckCircle2,
              },
              {
                step: '03',
                title: '설치 완료',
                desc: '합리적인 비용으로\n빠르게 설치까지 완료.',
                icon: ArrowRight,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl bg-gray-50 p-8 md:p-10
                           transition-all duration-300 ease-toss
                           hover:bg-white hover:shadow-card"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-small font-semibold text-primary">{item.step}</span>
                <h3 className="mt-2 text-heading-2 text-gray-900">{item.title}</h3>
                <p className="mt-3 text-body-2 text-gray-500 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────── */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-caption font-semibold text-primary mb-3">FAQ</p>
              <h2 className="text-heading-1 md:text-display-3 text-gray-900">
                자주 묻는 질문
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl bg-white transition-all duration-300 ease-toss
                             hover:shadow-soft"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-6
                                      text-body-1 font-semibold text-gray-900
                                      select-none list-none
                                      [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="ml-6 flex-shrink-0 w-6 h-6 rounded-full bg-gray-100
                                     flex items-center justify-center
                                     text-gray-400 text-caption
                                     group-open:bg-primary-50 group-open:text-primary
                                     transition-all duration-300">
                      <svg
                        className="w-3 h-3 transition-transform duration-300 group-open:rotate-45"
                        fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2"
                      >
                        <path d="M6 1v10M1 6h10" />
                      </svg>
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-body-2 text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/faq" className="btn-ghost text-gray-500 hover:text-gray-900">
                더 많은 질문 보기
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 최종 CTA ─────────────────────── */}
      <section className="bg-gray-900">
        <div className="section-container section-gap text-center">
          <h2 className="text-display-3 md:text-display-2 text-white">
            지금 바로
            <br />
            <span className="text-gradient">최대 혜택</span>을 확인하세요
          </h2>
          <p className="mt-5 text-body-1 text-gray-400 max-w-md mx-auto">
            1분이면 충분합니다.
            <br />
            전문 상담사가 최적의 조합을 찾아드릴게요.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/recommend" className="btn-primary group">
              무료 상담 신청하기
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:1234-5678"
              className="btn-outline border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/30"
            >
              <Phone className="mr-2 h-4 w-4" />
              1234-5678
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

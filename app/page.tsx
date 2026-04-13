import Link from 'next/link'
import {
  Wifi,
  CreditCard,
  Camera,
  Monitor,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Phone,
} from 'lucide-react'

/* ─── 카테고리 카드 데이터 ─── */
const categories = [
  {
    icon: Wifi,
    title: '인터넷 가입',
    desc: 'SKT·KT·LG 전 통신사 비교',
    href: '/internet',
    color: 'text-primary',
    bg: 'bg-primary-50',
  },
  {
    icon: CreditCard,
    title: '결제단말기',
    desc: '유·무선 카드단말기 최저가',
    href: '/business/terminal',
    color: 'text-accent',
    bg: 'bg-orange-50',
  },
  {
    icon: Camera,
    title: 'CCTV',
    desc: '설치부터 유지보수까지',
    href: '/business/cctv',
    color: 'text-secondary',
    bg: 'bg-emerald-50',
  },
  {
    icon: Monitor,
    title: '티오더',
    desc: '테이블 오더 도입 상담',
    href: '/business/torder',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
]

/* ─── 왜 우리편인가 ─── */
const benefits = [
  {
    icon: ShieldCheck,
    title: '전 통신사 비교',
    desc: 'SKT, KT, LG U+ 전 통신사 상품을 한눈에 비교하고 최적의 조합을 찾아드립니다.',
  },
  {
    icon: Headphones,
    title: '전문 상담사 배정',
    desc: '매장 환경과 업종에 맞는 1:1 전문 상담으로 불필요한 비용을 줄여드립니다.',
  },
  {
    icon: TrendingUp,
    title: '최대 혜택 보장',
    desc: '현금사은품, 월 요금 할인, 결합할인까지 받을 수 있는 모든 혜택을 안내합니다.',
  },
]

/* ─── 자주 묻는 질문 ─── */
const faqs = [
  {
    q: '상담 비용이 있나요?',
    a: '아니요, 상담부터 설치까지 모든 과정이 무료입니다. 부담 없이 문의해주세요.',
  },
  {
    q: '기존 통신사에서 변경할 수 있나요?',
    a: '네, 기존 계약 상태를 확인한 뒤 위약금 대비 혜택이 더 큰 최적의 시점을 안내해드립니다.',
  },
  {
    q: '설치까지 얼마나 걸리나요?',
    a: '인터넷은 보통 3~5 영업일, 단말기·CCTV는 상담 후 1~3일 내 설치가 가능합니다.',
  },
  {
    q: '사업자등록증이 꼭 필요한가요?',
    a: '사업자 전용 상품은 사업자등록증이 필요하며, 개인 가입도 별도로 안내해드립니다.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ━━━ 히어로 섹션 ━━━ */}
      <section className="relative bg-gradient-to-br from-navy via-gray-900 to-navy overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="section-container relative py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="text-secondary font-semibold text-sm md:text-base mb-4">
              소상공인 편에 서는 유일한 파트너
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              인터넷·단말기·CCTV
              <br />
              <span className="text-accent">한번에 비교하고 최대 혜택</span>으로
            </h1>
            <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
              전 통신사 상품 비교부터 설치까지, 전문 상담사가
              <br className="hidden md:block" />
              우리 매장에 딱 맞는 솔루션을 찾아드립니다.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/recommend" className="btn-primary text-center">
                내 매장 최대혜택 확인하기
              </Link>
              <a
                href="tel:1234-5678"
                className="btn-outline border-white text-white hover:bg-white/10 text-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                전화 상담 1234-5678
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 카테고리 카드 ━━━ */}
      <section className="section-container -mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center mb-4`}
              >
                <cat.icon className={`h-6 w-6 ${cat.color}`} />
              </div>
              <h3 className="font-bold text-navy text-base md:text-lg">{cat.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ━━━ 왜 우리편인가 ━━━ */}
      <section className="section-container py-20 md:py-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy">
            왜 <span className="text-primary">우리편</span>인가요?
          </h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            직접 발품 팔 필요 없이, 한 번의 상담으로 최적의 조건을 찾아드립니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <b.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-navy text-lg">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 신뢰 요소 (숫자 배너) ━━━ */}
      <section className="bg-primary">
        <div className="section-container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { num: '10,000+', label: '누적 상담 건수' },
              { num: '98%', label: '고객 만족도' },
              { num: '3사', label: '전 통신사 비교' },
              { num: '0원', label: '상담·설치 비용' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold">{stat.num}</p>
                <p className="mt-1 text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <section className="section-container py-20 md:py-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy">자주 묻는 질문</h2>
          <p className="mt-3 text-gray-500">궁금한 점을 미리 확인해보세요.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-gray-50 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-navy hover:bg-gray-100 transition-colors">
                {faq.q}
                <span className="ml-4 text-gray-400 group-open:rotate-45 transition-transform text-xl">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faq" className="text-primary font-semibold text-sm hover:underline">
            더 많은 질문 보기 &rarr;
          </Link>
        </div>
      </section>

      {/* ━━━ 최종 CTA ━━━ */}
      <section className="bg-gradient-to-r from-navy to-gray-900">
        <div className="section-container py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            지금 바로 내 매장 최대혜택을 확인하세요
          </h2>
          <p className="mt-3 text-gray-300 max-w-md mx-auto">
            1분이면 충분합니다. 전문 상담사가 최적의 조합을 찾아드릴게요.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/recommend" className="btn-primary text-center">
              무료 상담 신청하기
            </Link>
            <a
              href="tel:1234-5678"
              className="btn-outline border-white text-white hover:bg-white/10 text-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              1234-5678
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

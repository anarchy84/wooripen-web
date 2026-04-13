'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   데이터
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const categories = [
  {
    icon: 'solar:global-bold-duotone',
    title: '인터넷 가입',
    desc: 'SKT · KT · LG U+\n전 통신사 요금제 비교',
    href: '/internet',
    gradient: 'from-blue-500 to-cyan-400',
    tag: '최대 40만원 사은품',
  },
  {
    icon: 'solar:card-recive-bold-duotone',
    title: '결제단말기',
    desc: '유·무선 카드단말기\n업종별 최저가 비교',
    href: '/business/terminal',
    gradient: 'from-violet-500 to-purple-400',
    tag: '월 렌탈 0원부터',
  },
  {
    icon: 'solar:videocamera-record-bold-duotone',
    title: 'CCTV 설치',
    desc: '매장 맞춤 CCTV\n설치·유지보수 원스톱',
    href: '/business/cctv',
    gradient: 'from-emerald-500 to-teal-400',
    tag: '4채널 기본 설치',
  },
  {
    icon: 'solar:tablet-bold-duotone',
    title: '티오더·키오스크',
    desc: '테이블 오더·무인결제\n도입 컨설팅',
    href: '/business/torder',
    gradient: 'from-orange-500 to-amber-400',
    tag: '인건비 절감',
  },
]

const productHighlights = [
  {
    category: '사업자 인터넷',
    title: '매장 인터넷, 아직도\n비싸게 쓰고 계신가요?',
    desc: 'SKT, KT, LG U+ 사업자 전용 요금제를 한눈에 비교하세요. 기가 인터넷부터 결합할인까지, 매장에 최적화된 요금제를 전문 상담사가 찾아드립니다. 통신사별 현금사은품과 월 요금 할인까지 모두 비교해보세요.',
    features: ['전 통신사 요금제 비교', '현금사은품 최대 40만원', '기존 약정 위약금 분석', '결합할인 자동 적용'],
    icon: 'solar:wi-fi-router-bold-duotone',
    color: 'primary',
    href: '/internet',
  },
  {
    category: '결제단말기',
    title: '카드단말기, 수수료부터\n기기값까지 비교하세요',
    desc: '유선·무선·모바일 카드단말기를 업종과 매출 규모에 맞게 추천해드립니다. 소상공인 우대 수수료 적용은 기본이고, 배달앱 연동부터 POS 시스템까지 원스톱으로 세팅해드립니다.',
    features: ['업종별 맞춤 단말기 추천', '소상공인 우대 수수료', '배달앱·POS 연동', '무선단말기 당일 설치'],
    icon: 'solar:hand-money-bold-duotone',
    color: 'violet',
    href: '/business/terminal',
  },
  {
    category: 'CCTV 설치',
    title: 'CCTV, 설치부터\n유지보수까지 한번에',
    desc: '매장 규모와 구조에 맞는 CCTV 시스템을 설계해드립니다. 고화질 카메라 선정부터 녹화기 세팅, 모바일 원격 모니터링까지. 설치 후에도 정기점검과 AS를 책임집니다.',
    features: ['매장 맞춤 설계', '4K 고화질 카메라', '모바일 원격 모니터링', '정기점검·AS 포함'],
    icon: 'solar:shield-check-bold-duotone',
    color: 'emerald',
    href: '/business/cctv',
  },
]

const trustItems = [
  { icon: 'solar:buildings-bold-duotone', value: '10,000+', label: '누적 상담 건수' },
  { icon: 'solar:like-bold-duotone', value: '98%', label: '고객 만족도' },
  { icon: 'solar:graph-new-up-bold-duotone', value: '3사', label: '전 통신사 비교' },
  { icon: 'solar:wallet-money-bold-duotone', value: '0원', label: '상담·설치 비용' },
]

const processSteps = [
  {
    icon: 'solar:pen-new-square-bold-duotone',
    title: '상담 신청',
    desc: '간단한 매장 정보만 입력하세요.\n1분이면 충분합니다.',
  },
  {
    icon: 'solar:chart-square-bold-duotone',
    title: '맞춤 비교 분석',
    desc: '전문 상담사가 통신사별 요금제와\n혜택을 비교 분석해드립니다.',
  },
  {
    icon: 'solar:check-circle-bold-duotone',
    title: '설치 완료',
    desc: '합리적인 비용으로 빠르게\n설치까지 완료해드립니다.',
  },
]

const tips = [
  {
    category: '인터넷',
    title: '사업자 인터넷 가입 시 반드시 확인해야 할 5가지',
    excerpt: '통신사 영업사원이 알려주지 않는 약정 조건, 위약금 계산법, 결합할인 꿀팁까지 정리했습니다.',
    href: '/tips',
  },
  {
    category: '단말기',
    title: '2025년 카드단말기 수수료 비교 총정리',
    excerpt: '업종별 우대 수수료율부터 VAN사 선택 기준, 무선단말기 vs 유선단말기 장단점을 비교해보세요.',
    href: '/tips',
  },
  {
    category: 'CCTV',
    title: '소규모 매장 CCTV, 몇 채널이 적당할까?',
    excerpt: '매장 평수별 추천 채널 수, 카메라 화소 선택법, 야간 촬영 성능 체크 포인트를 알려드립니다.',
    href: '/tips',
  },
]

const faqs = [
  {
    q: '상담 비용이 있나요?',
    a: '아니요. 상담부터 설치까지 모든 과정이 무료입니다. 통신사 및 제조사와의 공식 파트너십을 통해 운영되므로 고객님께 별도 비용이 발생하지 않습니다.',
  },
  {
    q: '기존 통신사에서 변경할 수 있나요?',
    a: '네. 기존 계약 상태와 잔여 약정을 확인한 뒤, 위약금 대비 이동 시 받을 수 있는 혜택을 꼼꼼하게 분석해드립니다. 오히려 변경이 유리한 경우가 많습니다.',
  },
  {
    q: '설치까지 얼마나 걸리나요?',
    a: '인터넷은 신청 후 3~5 영업일, 카드단말기는 당일~1일, CCTV는 현장 실사 후 2~3일 내 설치가 가능합니다.',
  },
  {
    q: '사업자등록증이 꼭 필요한가요?',
    a: '사업자 전용 요금제와 단말기는 사업자등록증이 필요합니다. 개인 고객을 위한 가정용 인터넷과 렌탈 상품도 별도로 안내해드립니다.',
  },
  {
    q: '여러 상품을 한꺼번에 신청할 수 있나요?',
    a: '물론이죠. 인터넷 + 단말기 + CCTV를 한번에 신청하시면 결합 할인까지 적용되어 개별 신청 대비 더 큰 혜택을 받으실 수 있습니다.',
  },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   페이지
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function HomePage() {
  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative bg-gray-950 overflow-hidden min-h-[92vh] flex items-center">
        {/* 배경 오브 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-[10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[140px]" />
          <div className="absolute top-[60%] -left-20 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/8 blur-[100px]" />
        </div>

        {/* 그리드 패턴 오버레이 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        <div className="section-container relative w-full">
          <div className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-44 lg:pb-36">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-dark mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-small text-gray-400 font-medium">소상공인 편에 서는 유일한 파트너</span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-display-3 md:text-display-2 lg:text-display-1 text-white max-w-4xl !leading-[1.08]">
                인터넷, 단말기, CCTV
                <br />
                <span className="text-gradient">한번에 비교</span>하고
                <br />
                <span className="text-gradient">최대 혜택</span>으로
              </h1>
            </FadeIn>

            <FadeIn delay={250}>
              <p className="mt-7 text-body-1 text-gray-400 max-w-lg leading-relaxed">
                전 통신사 상품을 한 곳에서 비교하고,
                <br className="hidden md:block" />
                전문 상담사가 매장에 딱 맞는 솔루션을 찾아드립니다.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link href="/recommend" className="btn-primary group text-base px-8 py-4">
                  내 매장 최대혜택 확인
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:1234-5678"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4
                             text-body-2 font-semibold text-white
                             glass-dark hover:bg-white/[0.08] transition-all duration-300"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  1234-5678
                </a>
              </div>
            </FadeIn>

            {/* 히어로 하단 신뢰 마이크로카피 */}
            <FadeIn delay={550}>
              <div className="mt-14 flex flex-wrap items-center gap-6 text-small text-gray-500">
                <span className="flex items-center gap-2">
                  <Icon icon="solar:verified-check-bold" className="h-4 w-4 text-primary" />
                  무료 상담
                </span>
                <span className="flex items-center gap-2">
                  <Icon icon="solar:verified-check-bold" className="h-4 w-4 text-primary" />
                  전 통신사 공식 파트너
                </span>
                <span className="flex items-center gap-2">
                  <Icon icon="solar:verified-check-bold" className="h-4 w-4 text-primary" />
                  당일 설치 가능
                </span>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 하단 곡선 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 64h1440V32C1440 32 1140 0 720 0S0 32 0 32v32z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════ 카테고리 카드 ══════ */}
      <section className="section-container -mt-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <FadeIn key={cat.title} delay={i * 80} direction="up">
              <Link
                href={cat.href}
                className="group relative rounded-3xl bg-gray-50 p-6 md:p-7
                           transition-all duration-400 ease-toss
                           hover:bg-white hover:shadow-card-hover hover:-translate-y-1.5"
              >
                {/* 태그 */}
                <span className="absolute top-4 right-4 text-[11px] font-semibold text-primary bg-primary-50 px-2.5 py-1 rounded-full">
                  {cat.tag}
                </span>

                <div className={`
                  w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient}
                  flex items-center justify-center mb-5
                  transition-transform duration-400 ease-toss
                  group-hover:scale-110 group-hover:shadow-lg
                `}>
                  <Icon icon={cat.icon} className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-heading-3 text-gray-900">{cat.title}</h3>
                <p className="mt-2 text-caption text-gray-500 whitespace-pre-line leading-relaxed">{cat.desc}</p>
                <div className="mt-4 flex items-center text-caption font-medium text-gray-400 group-hover:text-primary transition-colors">
                  자세히 보기
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 상품별 SEO 콘텐츠 (교차 레이아웃) ══════ */}
      {productHighlights.map((product, idx) => (
        <section key={product.category} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
          <div className="section-container section-gap">
            <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${idx % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`}>
              {/* 텍스트 */}
              <div className={idx % 2 !== 0 ? 'lg:[direction:ltr]' : ''}>
                <FadeIn direction="up">
                  <span className={`text-small font-bold uppercase tracking-wider text-${product.color}-500`}>
                    {product.category}
                  </span>
                  <h2 className="mt-4 text-heading-1 md:text-display-3 text-gray-900 whitespace-pre-line !leading-tight">
                    {product.title}
                  </h2>
                  <p className="mt-5 text-body-2 text-gray-500 leading-relaxed">
                    {product.desc}
                  </p>

                  <ul className="mt-8 space-y-3.5">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-body-2 text-gray-700">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-lg bg-${product.color}-50 flex items-center justify-center`}>
                          <Icon icon="solar:check-read-bold" className={`h-3.5 w-3.5 text-${product.color}-500`} />
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <Link href={product.href} className="btn-primary group">
                      {product.category} 상담받기
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </FadeIn>
              </div>

              {/* 비주얼 카드 */}
              <FadeIn direction={idx % 2 === 0 ? 'right' : 'left'} delay={200}>
                <div className={`
                  relative rounded-3xl p-10 md:p-14
                  bg-gradient-to-br from-${product.color}-50 to-${product.color}-100/50
                  flex items-center justify-center min-h-[320px] lg:min-h-[400px]
                  ${idx % 2 !== 0 ? 'lg:[direction:ltr]' : ''}
                `}>
                  <Icon
                    icon={product.icon}
                    className={`h-32 w-32 md:h-40 md:w-40 text-${product.color}-200 opacity-60`}
                  />
                  {/* 플로팅 스탯 카드 */}
                  <div className="absolute bottom-6 left-6 glass rounded-2xl px-5 py-4 shadow-card">
                    <p className="text-small text-gray-500">평균 절감</p>
                    <p className="text-heading-2 text-gray-900 font-bold">
                      {idx === 0 ? '월 2.3만원' : idx === 1 ? '수수료 0.5%↓' : '월 1.8만원'}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      ))}

      {/* ══════ 신뢰 숫자 배너 ══════ */}
      <section className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="section-container section-gap-sm relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {trustItems.map((item, i) => (
              <FadeIn key={item.label} delay={i * 100} direction="up">
                <div className="text-center">
                  <Icon icon={item.icon} className="h-8 w-8 text-primary mx-auto mb-4 opacity-80" />
                  <p className="text-display-3 md:text-display-2 font-bold text-white">{item.value}</p>
                  <p className="mt-2 text-caption text-gray-400">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 프로세스 ══════ */}
      <section className="section-gap">
        <div className="section-container">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto">
              <span className="text-caption font-semibold text-primary">PROCESS</span>
              <h2 className="mt-3 text-heading-1 md:text-display-3 text-gray-900">
                3단계면 끝나요
              </h2>
              <p className="mt-4 text-body-2 text-gray-500">
                복잡한 절차 없이, 상담 신청 한 번이면 전문가가 알아서 비교해드립니다.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 md:mt-20 grid md:grid-cols-3 gap-6">
            {processSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 120} direction="up">
                <div className="relative rounded-3xl bg-gray-50 p-8 md:p-10
                               gradient-border
                               transition-all duration-400 ease-toss
                               hover:bg-white hover:shadow-card">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                    <Icon icon={step.icon} className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-display-2 font-bold text-gray-100 absolute top-6 right-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-heading-2 text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-body-2 text-gray-500 whitespace-pre-line leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 꿀팁 프리뷰 (SEO 블로그 콘텐츠) ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <span className="text-caption font-semibold text-primary">TIPS</span>
                <h2 className="mt-3 text-heading-1 md:text-display-3 text-gray-900">
                  사장님을 위한 꿀팁
                </h2>
                <p className="mt-3 text-body-2 text-gray-500">
                  매장 운영에 바로 써먹을 수 있는 실전 정보를 모았습니다.
                </p>
              </div>
              <Link href="/tips" className="btn-ghost shrink-0">
                전체 보기
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {tips.map((tip, i) => (
              <FadeIn key={tip.title} delay={i * 100} direction="up">
                <Link
                  href={tip.href}
                  className="group flex flex-col rounded-3xl bg-white p-7
                             transition-all duration-400 ease-toss
                             hover:shadow-card-hover hover:-translate-y-1"
                >
                  <span className="self-start text-[11px] font-bold text-primary bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wide">
                    {tip.category}
                  </span>
                  <h3 className="mt-5 text-heading-3 text-gray-900 group-hover:text-primary transition-colors leading-snug">
                    {tip.title}
                  </h3>
                  <p className="mt-3 text-caption text-gray-500 leading-relaxed flex-1">
                    {tip.excerpt}
                  </p>
                  <span className="mt-5 text-caption font-medium text-gray-400 group-hover:text-primary transition-colors flex items-center">
                    읽어보기
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="section-gap">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <span className="text-caption font-semibold text-primary">FAQ</span>
                <h2 className="mt-3 text-heading-1 md:text-display-3 text-gray-900">
                  자주 묻는 질문
                </h2>
              </div>
            </FadeIn>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FadeIn key={faq.q} delay={i * 60} direction="up">
                  <details className="group rounded-2xl bg-gray-50 transition-all duration-300 ease-toss hover:shadow-soft">
                    <summary className="flex items-center justify-between cursor-pointer p-6
                                        text-body-1 font-semibold text-gray-900
                                        select-none list-none [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-100
                                       flex items-center justify-center
                                       group-open:bg-primary group-open:text-white
                                       transition-all duration-300">
                        <svg className="w-3 h-3 transition-transform duration-300 group-open:rotate-45"
                          fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6 1v10M1 6h10" />
                        </svg>
                      </span>
                    </summary>
                    <p className="px-6 pb-6 text-body-2 text-gray-500 leading-relaxed">{faq.a}</p>
                  </details>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 최종 CTA ══════ */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[140px]" />
        </div>
        <div className="section-container section-gap text-center relative">
          <FadeIn>
            <Icon icon="solar:chat-round-call-bold-duotone" className="h-16 w-16 text-primary/40 mx-auto mb-8" />
            <h2 className="text-display-3 md:text-display-2 text-white max-w-2xl mx-auto !leading-tight">
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
              <Link href="/recommend" className="btn-primary group text-base px-8 py-4">
                무료 상담 신청하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:1234-5678"
                className="inline-flex items-center justify-center rounded-full px-8 py-4
                           text-body-2 font-semibold text-white
                           glass-dark hover:bg-white/[0.08] transition-all duration-300"
              >
                <Phone className="mr-2 h-4 w-4" />
                1234-5678
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}

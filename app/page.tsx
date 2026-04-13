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
    desc: 'SKT · KT · LG U+ 전 통신사 비교',
    href: '/internet',
    gradient: 'from-blue-500 to-cyan-400',
    tag: '최대 40만원 사은품',
  },
  {
    icon: 'solar:card-recive-bold-duotone',
    title: '결제단말기',
    desc: '유·무선 카드단말기 업종별 최저가',
    href: '/business/terminal',
    gradient: 'from-violet-500 to-purple-400',
    tag: '월 렌탈 0원부터',
  },
  {
    icon: 'solar:videocamera-record-bold-duotone',
    title: 'CCTV 설치',
    desc: '매장 맞춤 설치·유지보수 원스톱',
    href: '/business/cctv',
    gradient: 'from-emerald-500 to-teal-400',
    tag: '4채널 기본 설치',
  },
  {
    icon: 'solar:tablet-bold-duotone',
    title: '티오더·키오스크',
    desc: '테이블 오더·무인결제 도입 상담',
    href: '/business/torder',
    gradient: 'from-orange-500 to-amber-400',
    tag: '인건비 절감',
  },
]

/* Bento 그리드 피쳐 (수파노바: 3-column 금지, Bento 사용) */
const bentoFeatures = [
  {
    icon: 'solar:chart-square-bold-duotone',
    title: '전 통신사 실시간 비교',
    desc: 'SKT, KT, LG U+ 사업자 전용 요금제를 한눈에. 기가 인터넷부터 결합할인까지 매장에 최적화된 요금제를 찾아드립니다.',
    span: 'md:col-span-2',        // 넓은 카드
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  },
  {
    icon: 'solar:hand-money-bold-duotone',
    title: '수수료 최적화',
    desc: '매출 규모에 맞는 카드단말기와 우대 수수료를 비교 분석해드립니다.',
    span: '',
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
  },
  {
    icon: 'solar:shield-check-bold-duotone',
    title: 'CCTV 맞춤 설계',
    desc: '매장 구조에 맞는 최적의 카메라 배치와 4K 고화질 시스템을 제안합니다.',
    span: '',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
  },
  {
    icon: 'solar:gift-bold-duotone',
    title: '현금사은품·결합할인',
    desc: '인터넷 + 단말기 + CCTV 결합 시 현금사은품 최대 40만원과 월 요금 추가 할인까지 적용됩니다.',
    span: 'md:col-span-2',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
  },
]

/* 리얼 후기 (수파노바: 리얼한 한국 이름, 회사명) */
const testimonials = [
  {
    name: '하윤서',
    role: '카페 사장님 · 성수동',
    text: '인터넷이랑 CCTV 따로 알아보다 지쳐서 문의했는데, 한 번에 다 비교해주시고 결합할인까지 적용돼서 월 3만원 이상 절약하고 있어요.',
    avatar: 'https://i.pravatar.cc/150?u=hayunseo',
  },
  {
    name: '박도현',
    role: '음식점 운영 · 강남구',
    avatar: 'https://i.pravatar.cc/150?u=parkdohyun',
    text: '무선단말기 교체하면서 티오더도 같이 상담받았어요. 수수료도 낮춰주시고 설치도 하루만에 끝나서 영업에 지장 없었습니다.',
  },
  {
    name: '이서진',
    role: '미용실 원장 · 홍대',
    avatar: 'https://i.pravatar.cc/150?u=leeseojin',
    text: '사업자 인터넷 약정이 끝나서 알아보는데, 기존보다 속도는 올리고 요금은 내리는 조합을 찾아주셨어요. 상담 진짜 꼼꼼하세요.',
  },
]

const stats = [
  { icon: 'solar:buildings-bold-duotone', value: '47,200+', label: '누적 상담 건수' },
  { icon: 'solar:like-bold-duotone', value: '4.87', label: '고객 만족도' },
  { icon: 'solar:graph-new-up-bold-duotone', value: '3사', label: '전 통신사 비교' },
  { icon: 'solar:wallet-money-bold-duotone', value: '0원', label: '상담·설치 비용' },
]

const tips = [
  {
    category: '인터넷',
    title: '사업자 인터넷 가입 시 반드시 확인해야 할 5가지',
    excerpt: '통신사 영업사원이 알려주지 않는 약정 조건, 위약금 계산법, 결합할인 꿀팁까지 정리했습니다.',
    href: '/tips',
    icon: 'solar:document-text-bold-duotone',
  },
  {
    category: '단말기',
    title: '카드단말기 수수료 비교 총정리',
    excerpt: '업종별 우대 수수료율부터 VAN사 선택 기준, 무선단말기 vs 유선단말기 장단점을 비교해보세요.',
    href: '/tips',
    icon: 'solar:calculator-bold-duotone',
  },
  {
    category: 'CCTV',
    title: '소규모 매장 CCTV, 몇 채널이 적당할까?',
    excerpt: '매장 평수별 추천 채널 수, 카메라 화소 선택법, 야간 촬영 성능 체크 포인트를 알려드립니다.',
    href: '/tips',
    icon: 'solar:eye-bold-duotone',
  },
]

const faqs = [
  { q: '상담 비용이 있나요?', a: '아니요. 상담부터 설치까지 무료입니다. 통신사 및 제조사와의 공식 파트너십으로 운영되므로 별도 비용이 없습니다.' },
  { q: '기존 통신사에서 변경 가능한가요?', a: '네. 잔여 약정과 위약금을 확인한 뒤, 이동 시 받을 수 있는 혜택을 꼼꼼하게 분석해드립니다. 변경이 유리한 경우가 대부분입니다.' },
  { q: '설치까지 얼마나 걸리나요?', a: '인터넷 3~5 영업일, 카드단말기 당일~1일, CCTV 현장 실사 후 2~3일 내 설치 가능합니다.' },
  { q: '여러 상품 한꺼번에 신청할 수 있나요?', a: '물론이죠. 인터넷 + 단말기 + CCTV 동시 신청 시 결합할인이 적용되어 개별 신청보다 더 큰 혜택을 받으실 수 있습니다.' },
  { q: '사업자등록증이 꼭 필요한가요?', a: '사업자 전용 요금제와 단말기는 사업자등록증이 필요합니다. 개인 고객 상품도 별도 안내해드립니다.' },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   페이지
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function HomePage() {
  return (
    <>
      {/* ══ 그레인 텍스처 오버레이 (수파노바: 유기적 비디지털 느낌) ══ */}
      <div
        className="fixed inset-0 z-[60] pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ══════ 히어로 (비디오 Ready) ══════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-gray-950">
        {/* 비디오 배경 슬롯 — hero-video.mp4를 public/에 넣으면 자동 활성화 */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          poster=""
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* 그라데이션 메시 배경 (영상 없을 때 폴백) */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[5%] w-[700px] h-[700px] rounded-full bg-primary/20 blur-[160px]" />
          <div className="absolute top-[55%] -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
          <div className="absolute bottom-[10%] right-[30%] w-[300px] h-[300px] rounded-full bg-emerald-500/8 blur-[100px]" />
        </div>

        {/* 그리드 패턴 */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />

        {/* 하단 그라데이션 (수파노바: Full-Bleed Media Hero) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-950 to-transparent" />

        <div className="section-container relative w-full">
          <div className="pt-36 pb-28 md:pt-44 md:pb-36 lg:pt-48 lg:pb-40">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-dark mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-small text-gray-400 font-medium tracking-wide">소상공인 편에 서는 유일한 파트너</span>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl break-keep">
                인터넷, 단말기, CCTV
                <br />
                <span className="text-gradient">한번에 비교</span>하고
                <br />
                <span className="text-gradient">최대 혜택</span>으로
              </h1>
            </FadeIn>

            <FadeIn delay={280}>
              <p className="mt-7 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
                전 통신사 상품을 한 곳에서 비교하고,
                전문 상담사가 매장에 딱 맞는 솔루션을 찾아드립니다.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/recommend"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4
                             text-base font-semibold text-white
                             transition-all duration-400 ease-toss
                             hover:bg-primary-600 hover:shadow-[0_0_40px_rgba(49,130,246,0.3)]
                             hover:scale-[1.02] active:scale-[0.98]
                             group"
                >
                  내 매장 최대혜택 확인
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a href="tel:1234-5678"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4
                             text-base font-semibold text-white glass-dark
                             hover:bg-white/[0.08] transition-all duration-300"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  1234-5678
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={550}>
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-small text-gray-500">
                {['무료 상담', '전 통신사 공식 파트너', '당일 설치 가능'].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <Icon icon="solar:verified-check-bold" className="h-4 w-4 text-primary-400" />
                    {t}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 곡선 디바이더 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60h1440V30C1440 30 1140 0 720 0S0 30 0 30v30z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════ 카테고리 카드 ══════ */}
      <section className="section-container -mt-3 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <FadeIn key={cat.title} delay={i * 80}>
              <Link href={cat.href}
                className="group relative rounded-3xl bg-gray-50 p-6 md:p-7 overflow-hidden
                           transition-all duration-400 ease-toss
                           hover:bg-white hover:shadow-card-hover hover:-translate-y-1.5">
                <span className="absolute top-4 right-4 text-[11px] font-semibold text-primary bg-primary-50 px-2.5 py-1 rounded-full">
                  {cat.tag}
                </span>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-5 transition-transform duration-400 ease-toss group-hover:scale-110`}>
                  <Icon icon={cat.icon} className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 break-keep">{cat.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 break-keep">{cat.desc}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-primary transition-colors">
                  자세히 보기
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 신뢰 로고 마퀴 (수파노바: Logo Cloud) ══════ */}
      <section className="section-gap-sm overflow-hidden">
        <FadeIn>
          <p className="text-center text-sm text-gray-400 mb-8">전 통신사 공식 파트너로 함께합니다</p>
        </FadeIn>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="marquee-track">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-16 px-8">
                {['SK텔레콤', 'KT', 'LG U+', 'NICE정보통신', 'KIS정보통신', 'KICC', '한국정보통신', 'KG이니시스'].map((name) => (
                  <span key={`${setIdx}-${name}`} className="text-xl font-bold text-gray-200 whitespace-nowrap hover:text-gray-400 transition-colors cursor-default select-none">
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ Bento 그리드 피쳐 (수파노바: 3-column 금지, Bento 사용) ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="max-w-xl mb-14">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Features</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight break-keep">
                왜 사장님들이<br />우리편을 찾을까요?
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {bentoFeatures.map((feat, i) => (
              <FadeIn key={feat.title} delay={i * 100}>
                <div className={`${feat.span} ${feat.bg} rounded-3xl p-8 md:p-10
                                transition-all duration-400 ease-toss hover:shadow-card
                                gradient-border`}>
                  <Icon icon={feat.icon} className="h-10 w-10 text-gray-800 mb-5" />
                  <h3 className="text-xl font-semibold text-gray-900 break-keep">{feat.title}</h3>
                  <p className="mt-3 text-base text-gray-600 leading-relaxed max-w-[55ch] break-keep">{feat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 후기 (수파노바: Testimonial Masonry) ══════ */}
      <section className="section-gap">
        <div className="section-container">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Reviews</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                실제 사장님들의 후기
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 120}>
                <div className={`rounded-3xl bg-gray-50 p-7 md:p-8
                                transition-all duration-400 ease-toss hover:shadow-card hover:bg-white
                                ${i === 1 ? 'md:-mt-6' : ''}`}>
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, s) => (
                      <Icon key={s} icon="solar:star-bold" className="h-4 w-4 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed break-keep">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 숫자 배너 (수파노바: Metrics Bar, 유기적 숫자) ══════ */}
      <section className="bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="section-container section-gap-sm relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14">
            {stats.map((item, i) => (
              <FadeIn key={item.label} delay={i * 100}>
                <div className="text-center">
                  <Icon icon={item.icon} className="h-8 w-8 text-primary-400 mx-auto mb-4" />
                  <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">{item.value}</p>
                  <p className="mt-2 text-sm text-gray-400">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 프로세스 (수파노바: 각 섹션 다른 레이아웃) ══════ */}
      <section className="section-gap">
        <div className="section-container">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Process</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">3단계면 끝나요</h2>
              <p className="mt-4 text-base text-gray-500 break-keep">복잡한 절차 없이, 상담 신청 한 번이면 전문가가 알아서 비교해드립니다.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {processSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 120}>
                <div className="relative rounded-3xl bg-gray-50 p-8 md:p-10 gradient-border
                               transition-all duration-400 ease-toss hover:bg-white hover:shadow-card">
                  <span className="absolute top-7 right-8 text-5xl font-bold text-gray-100 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                    <Icon icon={step.icon} className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 break-keep">{step.title}</h3>
                  <p className="mt-3 text-base text-gray-500 whitespace-pre-line leading-relaxed break-keep">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 꿀팁 (SEO 블로그 콘텐츠) ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">Tips</span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">사장님을 위한 꿀팁</h2>
                <p className="mt-3 text-base text-gray-500 break-keep">매장 운영에 바로 써먹을 수 있는 실전 정보를 모았습니다.</p>
              </div>
              <Link href="/tips" className="btn-ghost shrink-0">전체 보기 <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {tips.map((tip, i) => (
              <FadeIn key={tip.title} delay={i * 100}>
                <Link href={tip.href}
                  className="group flex flex-col rounded-3xl bg-white p-7 transition-all duration-400 ease-toss hover:shadow-card-hover hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon icon={tip.icon} className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{tip.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug break-keep">{tip.title}</h3>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed flex-1 break-keep">{tip.excerpt}</p>
                  <span className="mt-5 text-sm font-medium text-gray-400 group-hover:text-primary transition-colors flex items-center">
                    읽어보기 <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
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
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">FAQ</span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">자주 묻는 질문</h2>
              </div>
            </FadeIn>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FadeIn key={faq.q} delay={i * 60}>
                  <details className="group rounded-2xl bg-gray-50 transition-all duration-300 ease-toss hover:shadow-soft">
                    <summary className="flex items-center justify-between cursor-pointer p-6 text-base md:text-lg font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden break-keep">
                      {faq.q}
                      <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center group-open:bg-primary group-open:text-white transition-all duration-300">
                        <svg className="w-3 h-3 transition-transform duration-300 group-open:rotate-45" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5"><path d="M6 1v10M1 6h10" /></svg>
                      </span>
                    </summary>
                    <p className="px-6 pb-6 text-base text-gray-500 leading-relaxed break-keep">{faq.a}</p>
                  </details>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 최종 CTA (수파노바: Full-Bleed CTA) ══════ */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap text-center relative">
          <FadeIn>
            <Icon icon="solar:chat-round-call-bold-duotone" className="h-16 w-16 text-primary/40 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto break-keep">
              지금 바로<br /><span className="text-gradient">최대 혜택</span>을 확인하세요
            </h2>
            <p className="mt-5 text-base md:text-lg text-gray-400 max-w-md mx-auto break-keep">
              1분이면 충분합니다. 전문 상담사가 최적의 조합을 찾아드릴게요.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/recommend"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all duration-400 ease-toss hover:bg-primary-600 hover:shadow-[0_0_40px_rgba(49,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98] group">
                무료 상담 신청하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a href="tel:1234-5678"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white glass-dark hover:bg-white/[0.08] transition-all duration-300">
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

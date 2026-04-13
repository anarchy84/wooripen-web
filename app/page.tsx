'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   데이터 — 3팀 합의 기반 개편 (2026-04-13)
   마케팅 + 개발 + 콘텐츠팀 통합 반영
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

/* 네이버페이 스타일 — 제품별 기능 쇼케이스 (GIF/영상 슬롯) */
const productShowcase = [
  {
    badge: '결제',
    title: '모든 결제를\n한 대로 해결',
    desc: '카드, QR, 간편결제, 애플페이까지\n하나의 단말기로 모든 결제가 가능해요.',
    media: '/showcase-terminal.gif', // Gemini 생성 후 교체
    fallbackIcon: 'solar:card-recive-bold-duotone',
    gradient: 'from-violet-500/10 to-purple-500/5',
    accentColor: 'text-violet-500',
  },
  {
    badge: '인터넷',
    title: '매장에 딱 맞는\n인터넷 요금제',
    desc: '3사 요금을 실시간 비교해서\n가장 빠르고 저렴한 조합을 찾아드려요.',
    media: '/showcase-internet.gif',
    fallbackIcon: 'solar:global-bold-duotone',
    gradient: 'from-blue-500/10 to-cyan-500/5',
    accentColor: 'text-blue-500',
  },
  {
    badge: '보안',
    title: '24시간 매장을\n안전하게',
    desc: '매장 구조에 맞는 CCTV 배치부터\n스마트폰 원격 확인까지 한 번에 설치해요.',
    media: '/showcase-cctv.gif',
    fallbackIcon: 'solar:videocamera-record-bold-duotone',
    gradient: 'from-emerald-500/10 to-teal-500/5',
    accentColor: 'text-emerald-500',
  },
  {
    badge: '효율',
    title: '키오스크로\n인건비 절감',
    desc: '테이블 오더와 무인 결제를 도입하면\n인건비는 줄이고 주문 효율은 올라가요.',
    media: '/showcase-kiosk.gif',
    fallbackIcon: 'solar:tablet-bold-duotone',
    gradient: 'from-orange-500/10 to-amber-500/5',
    accentColor: 'text-orange-500',
  },
]

/* 토스페이먼츠 스타일 — 가격 비교 카드 */
const pricingCards = [
  {
    label: '인터넷',
    icon: 'solar:global-bold-duotone',
    price: '월 22,000원~',
    note: '기가 인터넷 기준',
    benefit: '현금사은품 최대 40만원',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    label: '결제단말기',
    icon: 'solar:card-recive-bold-duotone',
    price: '월 0원~',
    note: '무선단말기 렌탈 기준',
    benefit: '카드 수수료 우대 적용',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
  },
  {
    label: 'CCTV',
    icon: 'solar:videocamera-record-bold-duotone',
    price: '설치비 0원',
    note: '4채널 기본 패키지',
    benefit: '24시간 원격 모니터링',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
]

/* 수평 타임라인 프로세스 (토스페이먼츠 스타일) */
const processSteps = [
  {
    step: 'STEP 1',
    icon: 'solar:chat-round-call-bold-duotone',
    title: '무료 상담 신청',
    desc: '전화 한 통이면 끝.\n매장 상황을 간단히 알려주세요.',
  },
  {
    step: 'STEP 2',
    icon: 'solar:document-text-bold-duotone',
    title: '맞춤 견적 비교',
    desc: '전 통신사·전 제조사 상품을\n한눈에 비교해드립니다.',
  },
  {
    step: 'STEP 3',
    icon: 'solar:check-circle-bold-duotone',
    title: '설치 완료',
    desc: '평균 3일 내 설치.\n영업에 지장 없도록 빠르게.',
  },
]

/* 리얼 후기 (수파노바: 리얼한 한국 이름) */
const testimonials = [
  {
    name: '하윤서',
    role: '카페 · 성수동',
    text: '인터넷이랑 CCTV 따로 알아보다 지쳐서 문의했는데, 한 번에 다 비교해주시고 결합할인까지 적용돼서 월 3만원 이상 절약하고 있어요.',
    avatar: 'https://i.pravatar.cc/150?u=hayunseo',
  },
  {
    name: '박도현',
    role: '음식점 · 강남구',
    avatar: 'https://i.pravatar.cc/150?u=parkdohyun',
    text: '무선단말기 교체하면서 티오더도 같이 상담받았어요. 수수료도 낮춰주시고 설치도 하루만에 끝나서 영업에 지장 없었습니다.',
  },
  {
    name: '이서진',
    role: '미용실 · 홍대',
    avatar: 'https://i.pravatar.cc/150?u=leeseojin',
    text: '사업자 인터넷 약정이 끝나서 알아보는데, 기존보다 속도는 올리고 요금은 내리는 조합을 찾아주셨어요. 상담 진짜 꼼꼼하세요.',
  },
]

const stats = [
  { icon: 'solar:buildings-bold-duotone', value: 47200, suffix: '+', label: '누적 상담 건수' },
  { icon: 'solar:like-bold-duotone', value: 4.87, suffix: '', label: '고객 만족도', decimals: 2 },
  { icon: 'solar:graph-new-up-bold-duotone', value: 3, suffix: '사', label: '전 통신사 비교' },
  { icon: 'solar:wallet-money-bold-duotone', value: 0, suffix: '원', label: '상담·설치 비용' },
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

const partnerLogos = ['SK텔레콤', 'KT', 'LG U+', 'NICE정보통신', 'KIS정보통신', 'KICC', '한국정보통신', 'KG이니시스']

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   컴포넌트
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 카운트업 애니메이션 (토스페이먼츠 스타일) */
function CountUp({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const duration = 1800
        const startTime = performance.now()
        const animate = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setCount(eased * value)
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  const display = decimals > 0
    ? count.toFixed(decimals)
    : value >= 1000
      ? Math.floor(count).toLocaleString()
      : String(Math.floor(count))

  return <span ref={ref}>{display}{suffix}</span>
}

/* 제품 쇼케이스 미디어 (정지 이미지 + CSS 애니메이션) */
function ShowcaseMedia({ src, fallbackIcon, accentColor }: { src: string; fallbackIcon: string; accentColor: string }) {
  const [hasMedia, setHasMedia] = useState(true)

  return hasMedia ? (
    <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 opacity-40">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full ${accentColor.replace('text-', 'bg-')} blur-[80px]`} />
      </div>
      {/* 떠다니는 이미지 + 쉬머 */}
      <div className="relative showcase-float showcase-shimmer rounded-2xl overflow-hidden shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="w-full max-h-[400px] object-contain rounded-2xl"
          onError={() => setHasMedia(false)}
        />
      </div>
    </div>
  ) : (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
      <div className="showcase-float">
        <Icon icon={fallbackIcon} className={`h-24 w-24 ${accentColor} opacity-20`} />
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   페이지
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function HomePage() {
  return (
    <>
      {/* ── 그레인 텍스처 오버레이 (수파노바: 유기적 비디지털 느낌) ── */}
      <div
        className="fixed inset-0 z-[60] pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ══════════════════════════════════════
          히어로 (비디오 Ready + 마케팅팀 카피 반영)
         ══════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-gray-950">
        {/* 비디오 배경 슬롯 */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
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

        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-950 to-transparent" />

        <div className="section-container relative w-full">
          <div className="pt-36 pb-28 md:pt-44 md:pb-36 lg:pt-48 lg:pb-40">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-dark mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-small text-gray-400 font-medium tracking-wide">따로 찾지 마세요. 우리편이 한 번에.</span>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <h1 className="text-4xl md:text-5xl lg:text-display-2 font-extrabold text-white tracking-tight leading-[1.12] max-w-4xl break-keep">
                인터넷부터 단말기·CCTV까지
                <br />
                <span className="text-gradient">매장의 모든 인프라</span>를
                <br />
                한 곳에서
              </h1>
            </FadeIn>

            <FadeIn delay={280}>
              <p className="mt-7 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
                전 통신사 비교부터 맞춤 견적, 설치까지.
                사장님은 상담만 받으세요. 나머지는 우리편이 알아서.
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
                  무료 견적 받아보기
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
                {['무료 상담', '전 통신사 공식 파트너', '평균 3일 내 설치'].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <Icon icon="solar:verified-check-bold" className="h-4 w-4 text-primary-400" />
                    {t}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

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
                className="group flex flex-col rounded-3xl bg-gray-50 p-5 md:p-7 overflow-hidden
                           transition-all duration-400 ease-toss
                           hover:bg-white hover:shadow-card-hover hover:-translate-y-1.5">
                {/* 태그 뱃지 — 상단 인라인 배치 */}
                <span className="self-start text-[11px] font-semibold text-primary bg-primary-50 px-2.5 py-1 rounded-full mb-4 whitespace-nowrap">
                  {cat.tag}
                </span>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shrink-0 mb-4 md:mb-5 transition-transform duration-400 ease-toss group-hover:scale-110`}>
                  <Icon icon={cat.icon} className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 break-keep">{cat.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 break-keep line-clamp-2">{cat.desc}</p>
                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-primary transition-colors">
                  자세히 보기
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 신뢰 로고 마퀴 ══════ */}
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
                {partnerLogos.map((name) => (
                  <span key={`${setIdx}-${name}`} className="text-xl font-bold text-gray-200 whitespace-nowrap hover:text-gray-400 transition-colors cursor-default select-none">
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          제품 쇼케이스 (네이버페이 커넥트 스타일)
          GIF/영상 슬롯 — Gemini 생성 후 교체
         ══════════════════════════════════════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="max-w-xl mb-16">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Products</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight break-keep">
                매장에 필요한 건<br />우리편이 다 해요
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                따로따로 알아보지 마세요. 상담 한 번이면 전부 비교해드립니다.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-8 md:space-y-12">
            {productShowcase.map((product, i) => (
              <FadeIn key={product.badge} delay={i * 100}>
                <div className={`rounded-[2rem] bg-white overflow-hidden shadow-soft
                                transition-all duration-500 ease-toss hover:shadow-card-hover
                                grid md:grid-cols-2 gap-0
                                ${i % 2 === 1 ? 'md:direction-rtl' : ''}`}>
                  {/* 텍스트 영역 */}
                  <div className={`p-8 md:p-12 lg:p-16 flex flex-col justify-center ${i % 2 === 1 ? 'md:order-2 md:direction-ltr' : ''}`}>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider w-fit
                                     ${product.accentColor} bg-gray-50`}>
                      {product.badge}
                    </span>
                    <h3 className="mt-5 text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight whitespace-pre-line break-keep">
                      {product.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-500 leading-relaxed whitespace-pre-line break-keep">
                      {product.desc}
                    </p>
                    <Link href="/recommend"
                      className="mt-8 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-600 transition-colors group w-fit">
                      상담 받기
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* 미디어 영역 (GIF/영상 슬롯) */}
                  <div className={`relative aspect-[4/3] md:aspect-auto bg-gradient-to-br ${product.gradient}
                                  ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                    <ShowcaseMedia
                      src={product.media}
                      fallbackIcon={product.fallbackIcon}
                      accentColor={product.accentColor}
                    />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          가격 비교 카드 (토스페이먼츠 수수료 테이블 스타일)
         ══════════════════════════════════════ */}
      <section className="section-gap">
        <div className="section-container">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Pricing</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                투명한 가격, 숨은 비용 없이
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                3사 비교견적으로 최적의 가격을 찾아드려요.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {pricingCards.map((card, i) => (
              <FadeIn key={card.label} delay={i * 100}>
                <div className="rounded-3xl bg-gray-50 p-8 md:p-10
                               transition-all duration-400 ease-toss
                               hover:bg-white hover:shadow-card-hover hover:-translate-y-1
                               group">
                  <div className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center mb-6
                                  transition-transform duration-400 ease-toss group-hover:scale-110`}>
                    <Icon icon={card.icon} className={`h-7 w-7 ${card.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">{card.label}</p>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{card.price}</p>
                  <p className="mt-1 text-sm text-gray-400">{card.note}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:verified-check-bold" className={`h-4 w-4 ${card.color}`} />
                      <span className="text-sm font-medium text-gray-700">{card.benefit}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300}>
            <div className="mt-10 text-center">
              <Link href="/recommend"
                className="btn-primary inline-flex items-center group">
                내 매장 맞춤 견적 받기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-sm text-gray-400">견적 비교는 무료, 부담 없이 확인하세요</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 후기 (수파노바: Testimonial Masonry) ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Reviews</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                사장님들이 직접 남긴 후기
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 120}>
                <div className={`rounded-3xl bg-white p-7 md:p-8
                                transition-all duration-400 ease-toss hover:shadow-card
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

      {/* ══════ 숫자 배너 (카운트업 애니메이션) ══════ */}
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
                  <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    <CountUp value={item.value} suffix={item.suffix} decimals={item.decimals ?? 0} />
                  </p>
                  <p className="mt-2 text-sm text-gray-400">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          프로세스 — 수평 타임라인 (토스페이먼츠 스타일)
         ══════════════════════════════════════ */}
      <section className="section-gap">
        <div className="section-container">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Process</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                3단계면 끝나요
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                복잡한 절차 없이, 상담 한 번이면 전문가가 알아서.
              </p>
            </div>
          </FadeIn>

          {/* 수평 타임라인 */}
          <div className="relative">
            {/* 연결선 (데스크톱) */}
            <div className="hidden md:block absolute top-[3.5rem] left-[16%] right-[16%] h-[2px] bg-gray-100" />

            <div className="grid md:grid-cols-3 gap-8 md:gap-6">
              {processSteps.map((step, i) => (
                <FadeIn key={step.title} delay={i * 150}>
                  <div className="text-center group">
                    {/* 스텝 넘버 */}
                    <div className="relative inline-flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full
                                    bg-white border-2 border-gray-100
                                    group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(49,130,246,0.15)]
                                    transition-all duration-400 ease-toss mb-6 z-10">
                      <Icon icon={step.icon} className="h-7 w-7 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <p className="text-xs font-bold text-primary tracking-widest mb-2">{step.step}</p>
                    <h3 className="text-xl font-semibold text-gray-900 break-keep">{step.title}</h3>
                    <p className="mt-3 text-sm text-gray-500 whitespace-pre-line leading-relaxed break-keep max-w-[28ch] mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
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

      {/* ══════════════════════════════════════
          상담 신청 폼 (네이버페이 커넥트 스타일 — 직접 내장)
         ══════════════════════════════════════ */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[160px]" />
        </div>

        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* 좌측: 카피 */}
            <FadeIn>
              <div>
                <Icon icon="solar:chat-round-call-bold-duotone" className="h-14 w-14 text-primary/40 mb-8" />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight break-keep">
                  지금 바로<br /><span className="text-gradient">무료 상담</span> 받으세요
                </h2>
                <p className="mt-5 text-base md:text-lg text-gray-400 max-w-md break-keep">
                  1분이면 충분해요. 전문 상담사가 연락드려서<br />
                  매장에 딱 맞는 최적 조합을 찾아드릴게요.
                </p>
                <div className="mt-8 space-y-3">
                  {['상담·설치 비용 무료', '전 통신사·제조사 비교', '평균 3일 내 설치 완료'].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-primary-400 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* 우측: 상담 폼 */}
            <FadeIn delay={200}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('상담 신청이 완료되었습니다!\n전문 상담사가 곧 연락드릴게요.')
                }}
                className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-8 md:p-10 space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">연락처 <span className="text-red-400">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5
                               text-white placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                               transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">매장명 <span className="text-gray-500">(선택)</span></label>
                  <input
                    type="text"
                    placeholder="예: 성수동 카페"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5
                               text-white placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                               transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 상품</label>
                  <div className="flex flex-wrap gap-2">
                    {['인터넷', '결제단말기', 'CCTV', '키오스크'].map((item) => (
                      <label key={item} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                                                    bg-white/[0.06] border border-white/[0.1]
                                                    text-sm text-gray-300
                                                    has-[:checked]:bg-primary/20 has-[:checked]:border-primary/40 has-[:checked]:text-primary-300
                                                    cursor-pointer transition-all duration-200">
                        <input type="checkbox" value={item} className="sr-only" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4
                             text-base font-semibold text-white
                             transition-all duration-400 ease-toss
                             hover:bg-primary-600 hover:shadow-[0_0_40px_rgba(49,130,246,0.3)]
                             active:scale-[0.98]"
                >
                  <Send className="mr-2 h-4 w-4" />
                  무료 상담 신청하기
                </button>
                <p className="text-center text-xs text-gray-500">
                  상담 신청 시 개인정보 처리방침에 동의합니다.
                </p>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

'use client'

// ─────────────────────────────────────────────
// 우리편 홈 페이지 — 페이히어(payhere.in) 벤치마크 리뉴얼
//  2026-04-20 리뉴얼: 이미지 MediaSlot 기반 재구성
//  - 상단 프로모바 → 히어로 캐러셀 → 신뢰마크 → 카테고리 4카드 →
//    제품 딥다이브 ×3 → 소셜프루프 → 업종 타일 → 뉴스룸 →
//    통계 → 프로세스 → FAQ → 상담 폼
//  - 이미지는 모두 MediaSlot 플레이스홀더 (manifest 연동 시 자동 채워짐)
// ─────────────────────────────────────────────

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import { useConsultation } from '@/lib/useConsultation'
import { useAttribution } from '@/lib/attribution'
import LiveTicker from '@/components/LiveTicker'

// ── 신규 섹션 컴포넌트 ──
// PromoBar는 Header 내부로 이동했으므로 홈 페이지 상단에서는 제거
import HeroCarousel from '@/components/sections/home/HeroCarousel'
import TrustMarks from '@/components/sections/home/TrustMarks'
import CategoryCards from '@/components/sections/home/CategoryCards'
import ProductDeepDive from '@/components/sections/home/ProductDeepDive'
import SocialProof from '@/components/sections/home/SocialProof'
import IndustryTiles from '@/components/sections/home/IndustryTiles'
import NewsroomCards from '@/components/sections/home/NewsroomCards'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   보조 데이터 (기존 페이지에서 유지)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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

const stats = [
  { icon: 'solar:buildings-bold-duotone', value: 47200, suffix: '+', label: '누적 상담 건수' },
  { icon: 'solar:like-bold-duotone', value: 4.87, suffix: '', label: '고객 만족도', decimals: 2 },
  { icon: 'solar:graph-new-up-bold-duotone', value: 3, suffix: '사', label: '전 통신사 비교' },
  { icon: 'solar:wallet-money-bold-duotone', value: 0, suffix: '원', label: '상담·설치 비용' },
]

const faqs = [
  { q: '상담 비용이 있나요?', a: '아니요. 상담부터 설치까지 무료입니다. 통신사 및 제조사와의 공식 파트너십으로 운영되므로 별도 비용이 없습니다.' },
  { q: '기존 통신사에서 변경 가능한가요?', a: '네. 잔여 약정과 위약금을 확인한 뒤, 이동 시 받을 수 있는 혜택을 꼼꼼하게 분석해드립니다. 변경이 유리한 경우가 대부분입니다.' },
  { q: '설치까지 얼마나 걸리나요?', a: '인터넷 3~5 영업일, 카드단말기 당일~1일, CCTV 현장 실사 후 2~3일 내 설치 가능합니다.' },
  { q: '여러 상품 한꺼번에 신청할 수 있나요?', a: '물론이죠. 인터넷 + 단말기 + CCTV 동시 신청 시 결합할인이 적용되어 개별 신청보다 더 큰 혜택을 받으실 수 있습니다.' },
  { q: '사업자등록증이 꼭 필요한가요?', a: '사업자 전용 요금제와 단말기는 사업자등록증이 필요합니다. 개인 고객 상품도 별도 안내해드립니다.' },
]

/* 카운트업 애니메이션 (기존 유지) */
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   페이지 컴포넌트
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function HomePage() {
  // ─── 상담 폼 상태 ─────────────────────────
  useAttribution()
  const { submitting, error: submitError, submitConsultation } = useConsultation()
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formShop, setFormShop] = useState('')
  const [formProducts, setFormProducts] = useState<string[]>([])
  const [privacyConsent, setPrivacyConsent] = useState(true)
  const [marketingConsent, setMarketingConsent] = useState(true)

  const toggleProduct = (item: string) => {
    setFormProducts((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    )
  }

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitConsultation(
      {
        name: formName,
        phone: formPhone,
        product_category: formProducts[0] || 'general',
        business_address: formShop || undefined,
        interested_products: formProducts,
        privacy_consent: privacyConsent,
        third_party_consent: privacyConsent,
        marketing_consent: marketingConsent,
      },
      'home'
    )
  }

  return (
    <>
      {/* 1. 히어로 캐러셀 (5슬라이드 자동재생) — PromoBar는 Header 내부로 통합됨 */}
      <HeroCarousel />

      {/* 2-1. 실시간 상담 티커 (히어로 바로 아래, 흰 배경) */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex justify-center">
          <LiveTicker dark={false} />
        </div>
      </div>

      {/* 3. 신뢰마크 바 (파트너/인증 8개) */}
      <TrustMarks />

      {/* 4. 카테고리 4카드 (BEST/EVENT/HOT/NEW) */}
      <CategoryCards />

      {/* 5. 제품 딥다이브 — 카드 단말기 */}
      <ProductDeepDive
        id="terminal"
        eyebrow="카드 단말기"
        title={
          <>
            모든 결제를
            <br className="hidden sm:inline" />
            {' '}
            <span className="text-primary">단말기 한 대로</span>
          </>
        }
        vendor="tossplace"
        mainSubject="terminal-hero"
        mainLabel="카드단말기 대표컷"
        mainHint="단독 제품 실사 · 4:3"
        mainIcon="solar:card-recive-bold-duotone"
        features={[
          {
            title: '카드 · QR · 간편결제 통합',
            desc: '애플페이, 삼성페이, 카카오페이까지 단말기 1대로.',
            icon: 'solar:card-bold-duotone',
          },
          {
            title: '업종별 최저 수수료',
            desc: '카페 · 음식점 · 소매 업종별 VAN 수수료 우대 적용.',
            icon: 'solar:tag-price-bold-duotone',
          },
          {
            title: '무선 · 유선 모두 가능',
            desc: '매장 구조에 맞는 단말기 타입을 골라드려요.',
            icon: 'solar:wi-fi-router-bold-duotone',
          },
          {
            title: '수리 · 교체 평생 무상',
            desc: '렌탈 기간 중 고장나면 언제든 무상 교체해드립니다.',
            icon: 'solar:shield-check-bold-duotone',
          },
        ]}
        specs={[
          { label: '467g', value: '초경량 휴대' },
          { label: '8시간', value: '1회 충전 사용' },
          { label: 'Wi-Fi + LTE', value: '이중 통신' },
          { label: 'EMV 인증', value: '글로벌 표준' },
        ]}
        ctaLabel="카드 단말기 상담"
        ctaHref="/business/terminal"
        bgClass="bg-white"
      />

      {/* 6. 제품 딥다이브 — 키오스크 (reverse) */}
      <ProductDeepDive
        id="kiosk"
        eyebrow="키오스크"
        title={
          <>
            인건비는 줄이고
            <br className="hidden sm:inline" />
            {' '}
            <span className="text-primary">주문 회전율은 올리고</span>
          </>
        }
        vendor="tossplace"
        mainSubject="kiosk-hero"
        mainLabel="키오스크 대표컷"
        mainHint="매장 키오스크 실사 · 4:3"
        mainIcon="solar:monitor-smartphone-bold-duotone"
        features={[
          {
            title: '터치 주문 + 자동 결제',
            desc: '고객이 직접 주문 → 결제까지, 매장 직원 부담 절감.',
            icon: 'solar:hand-money-bold-duotone',
          },
          {
            title: '포스 · 주방 프린터 연동',
            desc: '주문 내역이 바로 주방으로 전달되어 운영 지연 없음.',
            icon: 'solar:printer-bold-duotone',
          },
          {
            title: '메뉴 이미지 관리 쉬움',
            desc: '어드민에서 이미지 · 가격 · 품절 실시간 변경.',
            icon: 'solar:gallery-edit-bold-duotone',
          },
          {
            title: '카드 · 현금 · 포인트',
            desc: '모든 결제 수단 지원 + 할인쿠폰 · 멤버십 연동.',
            icon: 'solar:ticket-sale-bold-duotone',
          },
        ]}
        specs={[
          { label: '21.5inch', value: '대형 터치' },
          { label: '평균 35%', value: '인건비 절감' },
          { label: '스탠드 · 벽걸이', value: '설치 자유' },
          { label: 'A/S 24시간', value: '원격 대응' },
        ]}
        ctaLabel="키오스크 상담"
        ctaHref="/business/kiosk"
        bgClass="bg-gray-50"
        reverse
      />

      {/* 7. 제품 딥다이브 — CCTV */}
      <ProductDeepDive
        id="cctv"
        eyebrow="CCTV 설치"
        title={
          <>
            4K 화질로
            <br className="hidden sm:inline" />
            {' '}
            <span className="text-primary">매장을 24시간 지키다</span>
          </>
        }
        vendor="wooripen"
        mainSubject="cctv-hero"
        mainLabel="CCTV 설치 현장"
        mainHint="매장 천장 CCTV 실사 · 4:3"
        mainIcon="solar:videocamera-record-bold-duotone"
        features={[
          {
            title: '4K UHD 초고화질',
            desc: '사람 얼굴 · 번호판까지 선명하게 식별.',
            icon: 'solar:eye-scan-bold-duotone',
          },
          {
            title: '스마트폰 원격 감시',
            desc: '외출 중에도 앱으로 매장 실시간 확인.',
            icon: 'solar:smartphone-bold-duotone',
          },
          {
            title: '30일 자동 녹화 보관',
            desc: '사건 발생 시 즉시 영상 확인 · 추출 가능.',
            icon: 'solar:database-bold-duotone',
          },
          {
            title: '야간 적외선 촬영',
            desc: '조명 없어도 컬러에 가까운 야간 촬영.',
            icon: 'solar:moon-bold-duotone',
          },
        ]}
        specs={[
          { label: '4K UHD', value: '800만 화소' },
          { label: '30m 적외선', value: '야간 선명' },
          { label: 'IP67', value: '방수 · 방진' },
          { label: '설치비 0원', value: '4채널 기본' },
        ]}
        ctaLabel="CCTV 상담"
        ctaHref="/business/cctv"
        bgClass="bg-white"
      />

      {/* 8. 소셜프루프 (8장 슬라이더) */}
      <SocialProof />

      {/* 9. 업종별 타일 4개 */}
      <IndustryTiles />

      {/* 10. 뉴스룸 카드 그리드 */}
      <NewsroomCards />

      {/* 11. 숫자 배너 (카운트업) — 기존 유지 */}
      <section className="bg-gray-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
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

      {/* 12. 프로세스 3단계 — 기존 유지 */}
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
          <div className="relative">
            <div className="hidden md:block absolute top-[3.5rem] left-[16%] right-[16%] h-[2px] bg-gray-100" />
            <div className="grid md:grid-cols-3 gap-8 md:gap-6">
              {processSteps.map((step, i) => (
                <FadeIn key={step.title} delay={i * 150}>
                  <div className="text-center group">
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

      {/* 13. FAQ — 기존 유지 */}
      <section className="section-gap bg-gray-50">
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
                  <details className="group rounded-2xl bg-white transition-all duration-300 ease-toss hover:shadow-soft">
                    <summary className="flex items-center justify-between cursor-pointer p-6 text-base md:text-lg font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden break-keep">
                      {faq.q}
                      <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center group-open:bg-primary group-open:text-white transition-all duration-300">
                        <svg className="w-3 h-3 transition-transform duration-300 group-open:rotate-45" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6 1v10M1 6h10" />
                        </svg>
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

      {/* 14. 상담 신청 폼 (Supabase 연동 — 그대로 유지) */}
      <section id="consult" className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[160px]" />
        </div>

        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn>
              <div>
                <Icon icon="solar:chat-round-call-bold-duotone" className="h-14 w-14 text-primary/40 mb-8" />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight break-keep">
                  지금 바로<br />
                  <span className="text-gradient">무료 상담</span> 받으세요
                </h2>
                <p className="mt-5 text-base md:text-lg text-gray-400 max-w-md break-keep">
                  1분이면 충분해요. 전문 상담사가 연락드려서
                  <br />
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
                <a
                  href="tel:1600-6116"
                  className="mt-8 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  전화 상담 1600-6116
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <form
                onSubmit={handleConsultSubmit}
                className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-8 md:p-10 space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    이름 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    연락처 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    매장명 <span className="text-gray-500">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={formShop}
                    onChange={(e) => setFormShop(e.target.value)}
                    placeholder="예: 성수동 카페"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 상품</label>
                  <div className="flex flex-wrap gap-2">
                    {['인터넷', '결제단말기', 'CCTV', '키오스크'].map((item) => (
                      <label
                        key={item}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm cursor-pointer transition-all duration-200 ${
                          formProducts.includes(item)
                            ? 'bg-primary/20 border-primary/40 text-primary-300'
                            : 'bg-white/[0.06] border-white/[0.1] text-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formProducts.includes(item)}
                          onChange={() => toggleProduct(item)}
                          className="sr-only"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 rounded border-gray-600"
                      required
                    />
                    <span>
                      [필수] 개인정보 수집·이용 및 제3자 제공에 동의합니다.{' '}
                      <Link href="/privacy" className="text-primary-400 underline">자세히 보기</Link>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 rounded border-gray-600"
                    />
                    <span>[선택] 마케팅 정보 수신에 동의합니다.</span>
                  </label>
                </div>
                {submitError && <p className="text-sm text-red-400 text-center">{submitError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white transition-all duration-400 ease-toss hover:bg-primary-600 hover:shadow-[0_0_40px_rgba(49,130,246,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      접수 중...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      무료 상담 신청하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

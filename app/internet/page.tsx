'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send, Check } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import { useConsultation } from '@/lib/useConsultation'
import { useAttribution } from '@/lib/attribution'

/* ── 통신사 요금 데이터 ── */
const carriers = ['SKT', 'KT', 'LG U+'] as const
type Carrier = (typeof carriers)[number]

const carrierColors: Record<Carrier, { bg: string; text: string; accent: string; icon: string }> = {
  'SKT': { bg: 'bg-red-50', text: 'text-red-600', accent: 'bg-red-500', icon: 'solar:letter-bold-duotone' },
  'KT': { bg: 'bg-sky-50', text: 'text-sky-600', accent: 'bg-sky-500', icon: 'solar:planet-bold-duotone' },
  'LG U+': { bg: 'bg-pink-50', text: 'text-pink-600', accent: 'bg-pink-500', icon: 'solar:atom-bold-duotone' },
}

interface Plan {
  carrier: Carrier
  name: string
  speed: string
  monthlyPrice: string
  originalPrice: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  // SKT
  { carrier: 'SKT', name: 'Biz 광랜 베이직', speed: '100M', monthlyPrice: '22,000', originalPrice: '33,000', features: ['고정IP 1개', '기본 Wi-Fi', '약정 3년'] },
  { carrier: 'SKT', name: 'Biz 광랜 스탠다드', speed: '500M', monthlyPrice: '27,500', originalPrice: '38,500', features: ['고정IP 1개', '기업용 Wi-Fi', '약정 3년'], popular: true },
  { carrier: 'SKT', name: 'Biz 기가 프리미엄', speed: '1G', monthlyPrice: '33,000', originalPrice: '44,000', features: ['고정IP 2개', 'AI Wi-Fi 6', '약정 3년'] },

  // KT
  { carrier: 'KT', name: '올레 Biz 라이트', speed: '100M', monthlyPrice: '22,000', originalPrice: '33,000', features: ['고정IP 1개', '기본 Wi-Fi', '약정 3년'] },
  { carrier: 'KT', name: '올레 Biz 에센셜', speed: '500M', monthlyPrice: '27,500', originalPrice: '38,500', features: ['고정IP 1개', 'GiGA Wi-Fi', '약정 3년'], popular: true },
  { carrier: 'KT', name: '올레 Biz 프리미엄', speed: '1G', monthlyPrice: '33,000', originalPrice: '44,000', features: ['고정IP 2개', 'Wi-Fi 6E', '약정 3년'] },

  // LG U+
  { carrier: 'LG U+', name: 'U+ Biz 광랜', speed: '100M', monthlyPrice: '22,000', originalPrice: '33,000', features: ['고정IP 1개', '기본 Wi-Fi', '약정 3년'] },
  { carrier: 'LG U+', name: 'U+ Biz 기가슬림', speed: '500M', monthlyPrice: '27,500', originalPrice: '38,500', features: ['고정IP 1개', 'U+ AI Wi-Fi', '약정 3년'], popular: true },
  { carrier: 'LG U+', name: 'U+ Biz 기가 프로', speed: '1G', monthlyPrice: '33,000', originalPrice: '44,000', features: ['고정IP 2개', 'Wi-Fi 6', '약정 3년'] },
]

export default function InternetPage() {
  useAttribution()
  const { submitting, error: submitError, submitConsultation } = useConsultation()
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formShop, setFormShop] = useState('')
  const [formProducts, setFormProducts] = useState<string[]>([])
  const [privacyConsent, setPrivacyConsent] = useState(true)
  const [marketingConsent, setMarketingConsent] = useState(true)
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | 'all'>('all')

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
        product_category: 'internet',
        business_address: formShop || undefined,
        interested_products: formProducts,
        privacy_consent: privacyConsent,
        third_party_consent: privacyConsent,
        marketing_consent: marketingConsent,
      },
      'internet'
    )
  }

  const filteredPlans = selectedCarrier === 'all'
    ? plans
    : plans.filter((p) => p.carrier === selectedCarrier)

  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[160px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-sky-500/10 blur-[120px]" />
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
              <Icon icon="solar:global-bold-duotone" className="h-4 w-4 text-sky-400" />
              <span className="text-small text-gray-400">사업자 인터넷</span>
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              SKT · KT · LG U+<br />
              <span className="text-gradient">사업자 인터넷 요금</span><br />
              한눈에 비교
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
              3사 사업자 전용 요금제를 비교하고,
              매장에 가장 유리한 조건을 찾아드려요.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#plans"
                className="btn-primary group">
                요금제 비교하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="tel:1234-5678"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white glass-dark hover:bg-white/[0.08] transition-all duration-300">
                <Phone className="mr-2 h-4 w-4" />
                1234-5678
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 왜 사업자 인터넷? ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">Why Biz Internet</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              가정용과 뭐가 다른가요?
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: 'solar:lock-keyhole-bold-duotone',
              title: '고정 IP 제공',
              desc: 'CCTV 원격 접속, POS 연동, 서버 운영에 필수인 고정 IP를 제공합니다. 가정용은 유동 IP라 매번 바뀌어요.',
            },
            {
              icon: 'solar:shield-check-bold-duotone',
              title: '안정적인 회선',
              desc: '사업자 전용 회선은 트래픽 우선 처리가 되어 피크타임에도 속도 저하가 적어요. 끊김 없는 결제·주문 처리가 가능합니다.',
            },
            {
              icon: 'solar:wallet-money-bold-duotone',
              title: '세금계산서 발행',
              desc: '사업자 인터넷 요금은 부가세 환급이 가능해요. 연간 수만 원의 절세 효과를 볼 수 있습니다.',
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="rounded-3xl bg-gray-50 p-8 md:p-10 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card">
                <Icon icon={item.icon} className="h-10 w-10 text-primary mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-3 text-base text-gray-500 leading-relaxed break-keep">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 요금제 비교 ══════ */}
      <section id="plans" className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Plans</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                3사 요금제 비교
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                통신사별 사업자 인터넷 요금을 한눈에 비교해보세요.
              </p>
            </div>
          </FadeIn>

          {/* 통신사 필터 탭 */}
          <FadeIn delay={100}>
            <div className="flex justify-center gap-2 mb-10">
              <button
                onClick={() => setSelectedCarrier('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCarrier === 'all'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
              >
                전체
              </button>
              {carriers.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCarrier(c)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCarrier === c
                      ? `${carrierColors[c].accent} text-white shadow-md`
                      : 'bg-white text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* 요금 카드 그리드 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlans.map((plan, i) => {
              const color = carrierColors[plan.carrier]
              return (
                <FadeIn key={`${plan.carrier}-${plan.name}`} delay={i * 60}>
                  <div className={`relative rounded-3xl bg-white p-8 transition-all duration-400 ease-toss hover:shadow-card-hover hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-primary/30' : ''}`}>
                    {plan.popular && (
                      <span className="absolute -top-3 left-8 text-[11px] font-bold text-white bg-primary px-3 py-1 rounded-full shadow-sm">
                        인기
                      </span>
                    )}

                    {/* 통신사 뱃지 */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.text}`}>
                        <Icon icon={color.icon} className="h-3.5 w-3.5" />
                        {plan.carrier}
                      </span>
                      <span className="text-xs text-gray-400">{plan.speed}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 break-keep">{plan.name}</h3>

                    {/* 가격 */}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900 tracking-tight">월 {plan.monthlyPrice}</span>
                      <span className="text-sm text-gray-400">원</span>
                    </div>
                    <p className="text-sm text-gray-400 line-through">정상가 {plan.originalPrice}원</p>

                    {/* 포함 항목 */}
                    <ul className="mt-5 space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a href="#consult"
                      className={`mt-6 w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                      상담 받기
                    </a>
                  </div>
                </FadeIn>
              )
            })}
          </div>

          <FadeIn delay={400}>
            <p className="mt-8 text-center text-sm text-gray-400 break-keep">
              * 요금은 부가세 별도 기준이며, 약정·결합·프로모션에 따라 달라질 수 있습니다.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 업종별 추천 ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">Recommend</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              우리 매장엔 어떤 속도가 맞을까?
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            {
              icon: 'solar:cup-hot-bold-duotone',
              title: '카페 · 음식점',
              speed: '100M~500M',
              reason: 'POS 결제 + 손님 Wi-Fi 정도면 100M이면 충분해요. 테이블 오더까지 쓴다면 500M 추천.',
            },
            {
              icon: 'solar:shop-bold-duotone',
              title: '편의점 · 소매점',
              speed: '100M',
              reason: 'POS + CCTV 기본 운영은 100M으로 안정적이에요. 고정IP 1개면 CCTV 원격 접속도 가능.',
            },
            {
              icon: 'solar:buildings-2-bold-duotone',
              title: '사무실 · 학원',
              speed: '500M~1G',
              reason: '다수 PC·태블릿 동시 접속이 많으면 500M 이상을 권장해요. 영상 수업이 있다면 1G가 안정적.',
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="rounded-3xl bg-gray-50 p-8 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card group">
                <Icon icon={item.icon} className="h-10 w-10 text-primary mb-4 transition-transform duration-400 group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-1 text-2xl font-bold text-primary tracking-tight">{item.speed}</p>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed break-keep">{item.reason}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 설치 프로세스 ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Process</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                신청부터 개통까지, 3일이면 끝
              </h2>
            </div>
          </FadeIn>

          <div className="relative max-w-3xl mx-auto">
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-0.5 bg-blue-200" />
            <div className="grid md:grid-cols-3 gap-8 md:gap-5">
              {[
                { step: '01', title: '요금제 상담', desc: '매장 환경·사용량을 확인하고 3사 중 최적의 요금제를 비교해드려요.', icon: 'solar:phone-calling-bold-duotone' },
                { step: '02', title: '서류 접수', desc: '사업자등록증만 있으면 끝. 복잡한 서류 없이 간편하게 신청할 수 있어요.', icon: 'solar:document-bold-duotone' },
                { step: '03', title: '설치 완료', desc: '기사님이 방문해서 회선 설치 + Wi-Fi 세팅까지. 영업에 지장 없는 시간에 진행합니다.', icon: 'solar:check-circle-bold-duotone' },
              ].map((item, i) => (
                <FadeIn key={item.step} delay={i * 150}>
                  <div className="text-center">
                    <div className="relative mx-auto w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 transition-transform duration-400 ease-toss hover:scale-105">
                      <Icon icon={item.icon} className="h-9 w-9 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary tracking-widest">STEP {item.step}</span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 break-keep">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="section-container section-gap">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">FAQ</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">자주 묻는 질문</h2>
            </div>
          </FadeIn>
          <div className="space-y-3">
            {[
              { q: '가정용 인터넷으로 매장을 운영하면 안 되나요?', a: '불가능하진 않지만, 가정용은 고정IP가 안 되고 약관상 상업 목적 사용이 제한될 수 있어요. CCTV 원격 접속, POS 연동이 필요하면 사업자 인터넷이 필수입니다.' },
              { q: '기존 인터넷을 사업자용으로 전환할 수 있나요?', a: '네, 가정용에서 사업자용으로 전환이 가능합니다. 통신사에 따라 약정 승계 또는 신규 가입 방식이 달라지며, 상담 시 가장 유리한 방법을 안내해드려요.' },
              { q: '인터넷이랑 전화를 같이 쓰면 할인 되나요?', a: '네, 인터넷 + 전화 + IPTV 결합 할인이 있어요. 사업자 전화까지 포함하면 통신비를 상당히 줄일 수 있습니다. 3사 결합 상품도 비교해드립니다.' },
              { q: 'Wi-Fi가 잘 안 터지는데, 인터넷 문제인가요?', a: '인터넷 속도와 Wi-Fi 커버리지는 별개의 문제예요. 매장이 넓으면 공유기 추가 설치나 메시 Wi-Fi 구성이 필요할 수 있습니다. 현장 상황에 맞게 안내해드려요.' },
              { q: '약정 중간에 해지하면 위약금이 있나요?', a: '네, 통상 잔여 약정 개월 × 할인 금액 기준의 위약금이 발생합니다. 하지만 신규 가입 시 혜택으로 상쇄할 수 있는 경우도 있으니 상담 시 확인해드릴게요.' },
            ].map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 60}>
                <details className="group rounded-2xl bg-gray-50 transition-all duration-300 ease-toss hover:shadow-soft">
                  <summary className="flex items-center justify-between cursor-pointer p-6 text-base font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden break-keep">
                    {faq.q}
                    <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-open:bg-primary group-open:text-white transition-all duration-300">
                      <svg className="w-3 h-3 transition-transform duration-300 group-open:rotate-45" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5"><path d="M6 1v10M1 6h10" /></svg>
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-base text-gray-500 leading-relaxed break-keep">{faq.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 상담 CTA (네이버페이 스타일 폼) ══════ */}
      <section id="consult" className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn>
              <div>
                <Icon icon="solar:global-bold-duotone" className="h-14 w-14 text-sky-400/40 mb-8" />
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight break-keep">
                  3사 비교해서<br /><span className="text-gradient">가장 유리한 요금제</span><br />찾아드릴게요
                </h2>
                <p className="mt-5 text-base text-gray-400 break-keep">
                  매장 위치, 사용량, 기존 통신사를 고려해서 최적의 요금제를 추천해드려요.
                </p>
                <div className="mt-8 space-y-3">
                  {['SKT · KT · LG U+ 3사 비교', '결합 할인 최적화', '설치비 무료 프로모션'].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-sky-400 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <form onSubmit={handleConsultSubmit}
                className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-8 md:p-10 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">이름 <span className="text-red-400">*</span></label>
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="홍길동" className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">연락처 <span className="text-red-400">*</span></label>
                  <input type="tel" required value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="010-0000-0000"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">매장명 <span className="text-gray-500">(선택)</span></label>
                  <input type="text" value={formShop} onChange={(e) => setFormShop(e.target.value)} placeholder="예: 강남역 카페"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 상품</label>
                  <div className="flex flex-wrap gap-2">
                    {['인터넷', '전화', 'IPTV', '결합할인'].map((item) => (
                      <label key={item} className={`inline-flex items-center px-4 py-2 rounded-full border text-sm cursor-pointer transition-all ${
                        formProducts.includes(item)
                          ? 'bg-primary/20 border-primary/40 text-blue-300'
                          : 'bg-white/[0.06] border-white/[0.1] text-gray-300'
                      }`}>
                        <input type="checkbox" checked={formProducts.includes(item)} onChange={() => toggleProduct(item)} className="sr-only" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} className="mt-0.5 rounded border-gray-600" required />
                    <span>[필수] 개인정보 수집·이용 및 제3자 제공에 동의합니다. <Link href="/privacy" className="text-primary-400 underline">자세히 보기</Link></span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} className="mt-0.5 rounded border-gray-600" />
                    <span>[선택] 마케팅 정보 수신에 동의합니다.</span>
                  </label>
                </div>
                {submitError && <p className="text-sm text-red-400 text-center">{submitError}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(49,130,246,0.3)] active:scale-[0.98] transition-all duration-400 ease-toss disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      접수 중...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      무료 상담 신청하기
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

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send, Loader2 } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import { useConsultation } from '@/lib/useConsultation'
import { useAttribution } from '@/lib/attribution'

/* ── 렌탈 카테고리 ── */
type Category = 'all' | 'water' | 'air' | 'multi' | 'ice'

interface RentalProduct {
  category: Category
  icon: string
  title: string
  desc: string
  monthlyPrice: string
  features: string[]
  popular?: boolean
  tag: string
}

const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: '전체', icon: 'solar:widget-6-bold-duotone' },
  { id: 'water', label: '정수기', icon: 'solar:waterdrop-bold-duotone' },
  { id: 'air', label: '공기청정기', icon: 'solar:wind-bold-duotone' },
  { id: 'multi', label: '복합기', icon: 'solar:printer-bold-duotone' },
  { id: 'ice', label: '제빙기·냉온수기', icon: 'solar:snowflake-bold-duotone' },
]

const products: RentalProduct[] = [
  // 정수기
  {
    category: 'water',
    icon: 'solar:waterdrop-bold-duotone',
    title: '직수형 정수기',
    desc: '필터를 거쳐 바로 나오는 신선한 물. 탱크 없이 위생적이고 공간도 절약돼요.',
    monthlyPrice: '25,900',
    features: ['직수 정수 방식', '냉·온·정수 3온도', '6개월 무료 필터 교체'],
    popular: true,
    tag: '가장 인기',
  },
  {
    category: 'water',
    icon: 'solar:waterdrop-bold-duotone',
    title: '대용량 정수기',
    desc: '직원·손님이 많은 매장에 적합한 대용량 모델. 시간당 출수량이 넉넉해요.',
    monthlyPrice: '33,000',
    features: ['시간당 7L 이상 출수', '스테인리스 직수관', 'UV 자동 살균'],
    tag: '대형매장',
  },
  {
    category: 'water',
    icon: 'solar:waterdrop-bold-duotone',
    title: '카운터탑 정수기',
    desc: '싱크대 위에 올리는 소형 정수기. 좁은 카페·사무실에서 공간 효율이 좋아요.',
    monthlyPrice: '19,900',
    features: ['컴팩트 디자인', '냉·정수 2온도', '간편 셀프 설치'],
    tag: '소형매장',
  },

  // 공기청정기
  {
    category: 'air',
    icon: 'solar:wind-bold-duotone',
    title: '업소용 공기청정기',
    desc: '매장·사무실 전용 대면적 공기청정기. 미세먼지·냄새·바이러스까지 잡아줘요.',
    monthlyPrice: '29,900',
    features: ['적용면적 60평+', 'HEPA 13 필터', '실시간 공기질 표시'],
    popular: true,
    tag: '추천',
  },
  {
    category: 'air',
    icon: 'solar:wind-bold-duotone',
    title: '탈취·환기 공기청정기',
    desc: '음식점·고깃집 전용. 기름 냄새·연기를 강력하게 흡입하는 탈취 특화 모델이에요.',
    monthlyPrice: '35,000',
    features: ['4중 탈취 필터', '강력 흡입 모드', '주방 설치 가능'],
    tag: '음식점 특화',
  },

  // 복합기
  {
    category: 'multi',
    icon: 'solar:printer-bold-duotone',
    title: '컬러 복합기',
    desc: '인쇄·복사·스캔·팩스 올인원. 사무실·학원에서 업무 효율을 높여줘요.',
    monthlyPrice: '39,000',
    features: ['컬러/흑백 인쇄', '자동 양면 인쇄', '월 3,000매 토너 포함'],
    popular: true,
    tag: '사무실 추천',
  },
  {
    category: 'multi',
    icon: 'solar:printer-bold-duotone',
    title: '흑백 복합기',
    desc: '흑백 문서 위주라면 가성비 좋은 선택. 유지비가 저렴해요.',
    monthlyPrice: '25,000',
    features: ['고속 흑백 인쇄', '분당 30매', '월 5,000매 토너 포함'],
    tag: '가성비',
  },

  // 제빙기·냉온수기
  {
    category: 'ice',
    icon: 'solar:snowflake-bold-duotone',
    title: '업소용 제빙기',
    desc: '카페·음식점 필수 장비. 일일 제빙량에 따라 매장에 맞는 모델을 추천해드려요.',
    monthlyPrice: '45,000',
    features: ['일 50kg 제빙', '자동 세척 기능', '스테인리스 바디'],
    popular: true,
    tag: '카페 필수',
  },
  {
    category: 'ice',
    icon: 'solar:snowflake-bold-duotone',
    title: '냉온수기',
    desc: '사무실·대기실에 딱 맞는 스탠드형 냉온수기. 컵 디스펜서 옵션도 가능해요.',
    monthlyPrice: '18,000',
    features: ['냉·온·정수 3온도', '스탠드/카운터 선택', '자동 절전 모드'],
    tag: '사무실',
  },
]

const accentColor: Record<Category, string> = {
  all: 'text-primary',
  water: 'text-cyan-500',
  air: 'text-teal-500',
  multi: 'text-indigo-500',
  ice: 'text-sky-500',
}

export default function RentalPage() {
  useAttribution()
  const { submitting, error: submitError, submitConsultation } = useConsultation()
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formShop, setFormShop] = useState('')
  const [formProducts, setFormProducts] = useState<string[]>([])
  const [privacyConsent, setPrivacyConsent] = useState(true)
  const [marketingConsent, setMarketingConsent] = useState(true)

  const toggleProduct = (item: string) => {
    setFormProducts((prev) => prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item])
  }

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitConsultation({
      name: formName,
      phone: formPhone,
      product_category: 'rental',
      business_address: formShop || undefined,
      interested_products: formProducts,
      privacy_consent: privacyConsent,
      third_party_consent: privacyConsent,
      marketing_consent: marketingConsent,
    }, 'rental')
  }

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory)

  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[160px]" />
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
              <Icon icon="solar:hand-money-bold-duotone" className="h-4 w-4 text-cyan-400" />
              <span className="text-small text-gray-400">매장 렌탈</span>
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              초기 비용 0원,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400">매장에 필요한 건</span><br />
              전부 렌탈로
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
              정수기·공기청정기·복합기·제빙기까지.
              매장 운영에 필요한 장비를 부담 없이 렌탈하세요.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#products"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-4 text-base font-semibold text-white hover:bg-cyan-600 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] active:scale-[0.97] transition-all duration-300 ease-toss group">
                렌탈 상품 보기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="tel:1600-6116"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white glass-dark hover:bg-white/[0.08] transition-all duration-300">
                <Phone className="mr-2 h-4 w-4" />
                1600-6116
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 왜 렌탈? ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm font-semibold text-cyan-500 tracking-wider uppercase">Why Rental</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              구매보다 렌탈이 유리한 이유
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: 'solar:wallet-money-bold-duotone', title: '초기 비용 0원', desc: '목돈 없이 월 렌탈료만으로 시작. 매장 오픈 초기 자금 부담을 확 줄여줘요.' },
            { icon: 'solar:refresh-circle-bold-duotone', title: '무상 A/S + 필터 교체', desc: '렌탈 기간 동안 고장 수리, 필터·소모품 교체가 전부 무료. 유지비 걱정이 없어요.' },
            { icon: 'solar:arrow-up-bold-duotone', title: '최신 모델 교체', desc: '약정 만료 후 최신 모델로 무료 교체 가능. 항상 좋은 장비를 쓸 수 있어요.' },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="rounded-3xl bg-gray-50 p-8 md:p-10 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card">
                <Icon icon={item.icon} className="h-10 w-10 text-cyan-500 mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-3 text-base text-gray-500 leading-relaxed break-keep">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 렌탈 상품 목록 ══════ */}
      <section id="products" className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-sm font-semibold text-cyan-500 tracking-wider uppercase">Products</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                매장 렌탈 상품
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                카테고리별로 필요한 장비를 확인해보세요.
              </p>
            </div>
          </FadeIn>

          {/* 카테고리 필터 */}
          <FadeIn delay={100}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-white text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon icon={cat.icon} className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* 상품 카드 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product, i) => (
              <FadeIn key={`${product.category}-${product.title}`} delay={i * 60}>
                <div className={`relative rounded-3xl bg-white p-8 transition-all duration-400 ease-toss hover:shadow-card-hover hover:-translate-y-1 ${product.popular ? 'ring-2 ring-cyan-400/30' : ''}`}>
                  {product.popular && (
                    <span className="absolute -top-3 left-8 text-[11px] font-bold text-white bg-cyan-500 px-3 py-1 rounded-full shadow-sm">
                      {product.tag}
                    </span>
                  )}
                  {!product.popular && (
                    <span className="absolute top-6 right-6 text-[11px] font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {product.tag}
                    </span>
                  )}

                  <Icon icon={product.icon} className={`h-10 w-10 mb-5 ${accentColor[product.category]}`} />
                  <h3 className="text-lg font-semibold text-gray-900 break-keep">{product.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed break-keep line-clamp-2">{product.desc}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">월 {product.monthlyPrice}</span>
                    <span className="text-sm text-gray-400">원~</span>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                        <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-cyan-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a href="#consult"
                    className={`mt-5 w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                      product.popular
                        ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    상담 받기
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <p className="mt-8 text-center text-sm text-gray-400 break-keep">
              * 렌탈료는 약정 기간·모델에 따라 달라질 수 있습니다. 정확한 금액은 상담 시 안내해드려요.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 렌탈 프로세스 ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm font-semibold text-cyan-500 tracking-wider uppercase">Process</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              렌탈 신청, 이렇게 쉬워요
            </h2>
          </div>
        </FadeIn>

        <div className="relative max-w-3xl mx-auto">
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-0.5 bg-cyan-200" />
          <div className="grid md:grid-cols-3 gap-8 md:gap-5">
            {[
              { step: '01', title: '상품 상담', desc: '매장 환경과 필요에 맞는 렌탈 상품을 추천해드려요.', icon: 'solar:phone-calling-bold-duotone' },
              { step: '02', title: '설치 예약', desc: '원하시는 날짜에 전문 기사님이 방문 설치해드려요.', icon: 'solar:calendar-bold-duotone' },
              { step: '03', title: '사용 시작', desc: '설치 완료! 필터 교체·A/S까지 알아서 챙겨드려요.', icon: 'solar:check-circle-bold-duotone' },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 150}>
                <div className="text-center">
                  <div className="relative mx-auto w-20 h-20 rounded-2xl bg-cyan-50 flex items-center justify-center mb-5 transition-transform duration-400 ease-toss hover:scale-105">
                    <Icon icon={item.icon} className="h-9 w-9 text-cyan-500" />
                  </div>
                  <span className="text-xs font-bold text-cyan-500 tracking-widest">STEP {item.step}</span>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 break-keep">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <span className="text-sm font-semibold text-cyan-500 tracking-wider uppercase">FAQ</span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">자주 묻는 질문</h2>
              </div>
            </FadeIn>
            <div className="space-y-3">
              {[
                { q: '렌탈 약정 기간은 얼마나 되나요?', a: '보통 3년(36개월) 또는 5년(60개월) 약정이 일반적이에요. 약정 기간이 길수록 월 렌탈료가 낮아집니다. 상담 시 두 가지 모두 비교해드려요.' },
                { q: '중간에 해지하면 위약금이 있나요?', a: '네, 잔여 약정 기간에 따라 위약금이 발생합니다. 다만 이전 렌탈 상품이 있으면 승계나 상쇄가 가능한 경우도 있어 상담 시 확인해드려요.' },
                { q: '설치비가 따로 있나요?', a: '대부분의 렌탈 상품은 설치비가 무료예요. 특수 배관이나 전기 공사가 필요한 경우에만 별도 비용이 발생할 수 있어요.' },
                { q: '필터 교체는 어떻게 되나요?', a: '정기적으로 전문 기사가 방문해서 무상으로 필터를 교체해드려요. 정수기는 보통 2~6개월, 공기청정기는 6~12개월 주기입니다.' },
                { q: '사업자등록증이 꼭 필요한가요?', a: '사업자 렌탈의 경우 사업자등록증이 필요해요. 부가세 환급 혜택도 받으실 수 있습니다.' },
              ].map((faq, i) => (
                <FadeIn key={faq.q} delay={i * 60}>
                  <details className="group rounded-2xl bg-white transition-all duration-300 ease-toss hover:shadow-soft">
                    <summary className="flex items-center justify-between cursor-pointer p-6 text-base font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden break-keep">
                      {faq.q}
                      <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-open:bg-cyan-500 group-open:text-white transition-all duration-300">
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

      {/* ══════ 상담 CTA 폼 ══════ */}
      <section id="consult" className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn>
              <div>
                <Icon icon="solar:hand-money-bold-duotone" className="h-14 w-14 text-cyan-400/40 mb-8" />
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight break-keep">
                  매장에 필요한 장비,<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">부담 없이 렌탈</span>하세요
                </h2>
                <p className="mt-5 text-base text-gray-400 break-keep">
                  정수기·공기청정기·복합기·제빙기, 매장에 딱 맞는 장비를 추천해드려요.
                </p>
                <div className="mt-8 space-y-3">
                  {['초기 비용 0원', '무상 A/S + 필터 교체', '약정 만료 시 최신 모델 교체'].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-cyan-400 shrink-0" />
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
                  <input type="text" required placeholder="홍길동"
                    value={formName} onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">연락처 <span className="text-red-400">*</span></label>
                  <input type="tel" required placeholder="010-0000-0000"
                    value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">매장명 <span className="text-gray-500">(선택)</span></label>
                  <input type="text" placeholder="예: 강남역 카페"
                    value={formShop} onChange={(e) => setFormShop(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 상품</label>
                  <div className="flex flex-wrap gap-2">
                    {['정수기', '공기청정기', '복합기', '제빙기', '냉온수기'].map((item) => (
                      <label key={item} className="inline-flex items-center px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-sm text-gray-300 has-[:checked]:bg-cyan-500/20 has-[:checked]:border-cyan-400/40 has-[:checked]:text-cyan-300 cursor-pointer transition-all">
                        <input type="checkbox" checked={formProducts.includes(item)} onChange={() => toggleProduct(item)} className="sr-only" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} className="mt-0.5 rounded border-gray-600" required />
                    <span>[필수] 개인정보 수집·이용 및 제3자 제공에 동의합니다. <Link href="/privacy" className="text-cyan-400 underline">자세히 보기</Link></span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} className="mt-0.5 rounded border-gray-600" />
                    <span>[선택] 마케팅 정보 수신에 동의합니다.</span>
                  </label>
                </div>
                {submitError && <p className="text-sm text-red-400 text-center">{submitError}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-4 text-base font-semibold text-white hover:bg-cyan-600 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] active:scale-[0.98] transition-all duration-400 ease-toss disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
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

'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { ArrowRight, Send, Phone } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import Link from 'next/link'
import { useConsultation } from '@/lib/useConsultation'
import { useAttribution } from '@/lib/attribution'

/* ── 업종 데이터 ── */
interface BusinessType {
  id: string
  icon: string
  label: string
  desc: string
  recommended: { product: string; reason: string; link: string; color: string }[]
}

const businessTypes: BusinessType[] = [
  {
    id: 'cafe',
    icon: 'solar:cup-hot-bold-duotone',
    label: '카페',
    desc: '커피·디저트 전문점, 브런치 카페',
    recommended: [
      { product: '사업자 인터넷 100M', reason: '기본 POS + 손님 Wi-Fi면 충분', link: '/internet', color: 'bg-blue-50 text-blue-600' },
      { product: '무선 단말기', reason: '테이블 결제·배달 주문 처리', link: '/business/terminal', color: 'bg-violet-50 text-violet-600' },
      { product: '실내 돔 CCTV 4ch', reason: '소형 매장 기본 보안', link: '/business/cctv', color: 'bg-emerald-50 text-emerald-600' },
      { product: '테이블 오더', reason: '추가 주문 편의 → 객단가↑', link: '/business/torder', color: 'bg-orange-50 text-orange-600' },
    ],
  },
  {
    id: 'restaurant',
    icon: 'solar:chef-hat-bold-duotone',
    label: '음식점',
    desc: '한식·중식·일식·양식·분식',
    recommended: [
      { product: '사업자 인터넷 500M', reason: 'POS + 키오스크 + CCTV 동시 운용', link: '/internet', color: 'bg-blue-50 text-blue-600' },
      { product: 'POS 시스템', reason: '주문·결제·매출 통합 관리', link: '/business/terminal', color: 'bg-violet-50 text-violet-600' },
      { product: '실내 CCTV 8ch', reason: '주방·홀 분리 감시', link: '/business/cctv', color: 'bg-emerald-50 text-emerald-600' },
      { product: '스탠드 키오스크', reason: '인건비 절감 + 주문 속도↑', link: '/business/torder', color: 'bg-orange-50 text-orange-600' },
    ],
  },
  {
    id: 'retail',
    icon: 'solar:shop-bold-duotone',
    label: '편의점 · 소매점',
    desc: '편의점, 마트, 슈퍼, 문구점',
    recommended: [
      { product: '사업자 인터넷 100M', reason: 'POS + CCTV 기본 운영', link: '/internet', color: 'bg-blue-50 text-blue-600' },
      { product: '유선 단말기', reason: '고정 카운터, 안정적 결제', link: '/business/terminal', color: 'bg-violet-50 text-violet-600' },
      { product: '실내+실외 CCTV 8ch', reason: '매장 내부 + 출입구 감시', link: '/business/cctv', color: 'bg-emerald-50 text-emerald-600' },
    ],
  },
  {
    id: 'office',
    icon: 'solar:buildings-2-bold-duotone',
    label: '사무실 · 학원',
    desc: '사무실, 공유오피스, 학원, 교습소',
    recommended: [
      { product: '사업자 인터넷 1G', reason: '다수 PC 동시 접속 + 화상회의', link: '/internet', color: 'bg-blue-50 text-blue-600' },
      { product: '무선 단말기', reason: '수강료·이용료 현장 결제', link: '/business/terminal', color: 'bg-violet-50 text-violet-600' },
      { product: '실내 CCTV 4~8ch', reason: '사무공간·강의실 보안', link: '/business/cctv', color: 'bg-emerald-50 text-emerald-600' },
    ],
  },
  {
    id: 'beauty',
    icon: 'solar:magic-stick-3-bold-duotone',
    label: '미용실 · 네일샵',
    desc: '헤어, 네일, 속눈썹, 피부관리',
    recommended: [
      { product: '사업자 인터넷 100M', reason: '예약 시스템 + 손님 Wi-Fi', link: '/internet', color: 'bg-blue-50 text-blue-600' },
      { product: '무선 단말기', reason: '시술석에서 바로 결제', link: '/business/terminal', color: 'bg-violet-50 text-violet-600' },
      { product: '실내 돔 CCTV 4ch', reason: '인테리어에 어울리는 깔끔한 디자인', link: '/business/cctv', color: 'bg-emerald-50 text-emerald-600' },
    ],
  },
  {
    id: 'delivery',
    icon: 'solar:delivery-bold-duotone',
    label: '배달 전문점',
    desc: '배달 음식점, 공유주방, 포장 전문',
    recommended: [
      { product: '사업자 인터넷 500M', reason: '배달앱 다수 동시 운용', link: '/internet', color: 'bg-blue-50 text-blue-600' },
      { product: '키인 단말기', reason: '전화 주문 비대면 결제', link: '/business/terminal', color: 'bg-violet-50 text-violet-600' },
      { product: '실내 CCTV 4ch', reason: '주방 위생·안전 관리', link: '/business/cctv', color: 'bg-emerald-50 text-emerald-600' },
    ],
  },
]

export default function RecommendPage() {
  const [selected, setSelected] = useState<string>('cafe')
  const current = businessTypes.find((b) => b.id === selected) || businessTypes[0]

  // 어트리뷰션 캡처 + 상담 폼 훅
  useAttribution()
  const { submitting, error: submitError, submitConsultation } = useConsultation()
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formBizType, setFormBizType] = useState('')
  const [formProducts, setFormProducts] = useState<string[]>([])
  const [privacyConsent, setPrivacyConsent] = useState(true)
  const [marketingConsent, setMarketingConsent] = useState(true)

  const toggleProduct = (product: string) => {
    setFormProducts((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    )
  }

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitConsultation(
      {
        name: formName,
        phone: formPhone,
        product_category: formProducts[0] || 'general',
        business_type: formBizType || undefined,
        interested_products: formProducts,
        privacy_consent: privacyConsent,
        third_party_consent: privacyConsent,
        marketing_consent: marketingConsent,
      },
      'recommend'
    )
  }

  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[160px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
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
              <Icon icon="solar:magic-stick-3-bold-duotone" className="h-4 w-4 text-indigo-400" />
              <span className="text-small text-gray-400">맞춤 추천</span>
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              우리 매장에<br />
              <span className="text-gradient">딱 맞는 상품</span>을<br />
              찾아드려요
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
              업종을 선택하면, 인터넷·단말기·CCTV·키오스크까지
              필요한 상품을 한 번에 추천해드려요.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#recommend"
                className="btn-primary group">
                추천 받기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#consult"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white glass-dark hover:bg-white/[0.08] transition-all duration-300">
                <Phone className="mr-2 h-4 w-4" />
                바로 상담하기
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 업종 선택 + 추천 결과 ══════ */}
      <section id="recommend" className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">Step 1</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              업종을 선택해주세요
            </h2>
          </div>
        </FadeIn>

        {/* 업종 선택 버튼 */}
        <FadeIn delay={100}>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto mb-14">
            {businessTypes.map((bt) => (
              <button
                key={bt.id}
                onClick={() => setSelected(bt.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ease-toss ${
                  selected === bt.id
                    ? 'bg-primary/10 ring-2 ring-primary/30 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Icon icon={bt.icon} className={`h-8 w-8 ${selected === bt.id ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-xs font-semibold break-keep ${selected === bt.id ? 'text-primary' : 'text-gray-600'}`}>
                  {bt.label}
                </span>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* 추천 결과 */}
        <FadeIn delay={200}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Icon icon={current.icon} className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{current.label} 추천 상품</h3>
                <p className="text-sm text-gray-500">{current.desc}</p>
              </div>
            </div>

            <div className="space-y-3">
              {current.recommended.map((item) => (
                <Link
                  key={item.product}
                  href={item.link}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-card transition-all duration-300 ease-toss group"
                >
                  <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${item.color}`}>
                    {item.product}
                  </span>
                  <span className="text-base text-gray-600 break-keep">{item.reason}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════ 한 번에 상담 ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">One-Stop</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                하나하나 알아볼 필요 없어요
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                인터넷부터 단말기·CCTV·키오스크까지, 한 번의 상담으로 전부 해결돼요.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {[
              { icon: 'solar:global-bold-duotone', title: '인터넷', desc: '3사 비교 · 최저가', color: 'text-sky-500' },
              { icon: 'solar:card-recive-bold-duotone', title: '단말기', desc: 'VAN 비교 · 수수료↓', color: 'text-violet-500' },
              { icon: 'solar:videocamera-record-bold-duotone', title: 'CCTV', desc: '맞춤 채널 · 원격확인', color: 'text-emerald-500' },
              { icon: 'solar:tablet-bold-duotone', title: '키오스크', desc: '인건비↓ · 객단가↑', color: 'text-orange-500' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="rounded-3xl bg-white p-7 text-center transition-all duration-400 ease-toss hover:shadow-card group">
                  <Icon icon={item.icon} className={`h-10 w-10 mx-auto mb-3 ${item.color} transition-transform duration-400 group-hover:scale-110`} />
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 상담 CTA 폼 ══════ */}
      <section id="consult" className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn>
              <div>
                <Icon icon="solar:magic-stick-3-bold-duotone" className="h-14 w-14 text-indigo-400/40 mb-8" />
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight break-keep">
                  업종만 알려주시면<br /><span className="text-gradient">최적의 조합</span>을<br />찾아드릴게요
                </h2>
                <p className="mt-5 text-base text-gray-400 break-keep">
                  인터넷·단말기·CCTV·키오스크, 필요한 것만 골라서 한 번에 상담받으세요.
                </p>
                <div className="mt-8 space-y-3">
                  {['업종 맞춤 상품 조합', '3사 + 전 VAN사 비교', '설치까지 원스톱'].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-indigo-400 shrink-0" />
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
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">연락처 <span className="text-red-400">*</span></label>
                  <input type="tel" required placeholder="010-0000-0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">업종 <span className="text-gray-500">(선택)</span></label>
                  <input type="text" placeholder="예: 카페, 음식점, 미용실"
                    value={formBizType}
                    onChange={(e) => setFormBizType(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 상품</label>
                  <div className="flex flex-wrap gap-2">
                    {['인터넷', '카드단말기', 'CCTV', '키오스크/티오더'].map((item) => (
                      <label key={item} className="inline-flex items-center px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-sm text-gray-300 has-[:checked]:bg-indigo-500/20 has-[:checked]:border-indigo-400/40 has-[:checked]:text-indigo-300 cursor-pointer transition-all">
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

                {/* Consent checkboxes */}
                <div className="space-y-3 border-t border-white/[0.1] pt-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-xs text-gray-400">
                      <Link href="/privacy" className="text-indigo-400 hover:underline">개인정보 처리방침</Link>에 동의합니다 <span className="text-red-400">*</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-xs text-gray-400">
                      마케팅 정보 수신에 동의합니다 <span className="text-gray-500">(선택)</span>
                    </span>
                  </label>
                </div>

                {submitError && (
                  <p className="text-sm text-red-400 text-center">{submitError}</p>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(49,130,246,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-400 ease-toss">
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      접수 중...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      맞춤 상담 신청하기
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

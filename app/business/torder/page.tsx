'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import { useConsultation } from '@/lib/useConsultation'
import { useAttribution } from '@/lib/attribution'

export default function TorderPage() {
  useAttribution()
  const { submitting, error: submitError, submitConsultation } = useConsultation()
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
      name: formName, phone: formPhone,
      product_category: 'kiosk',
      business_address: formShop || undefined,
      interested_products: formProducts,
      privacy_consent: privacyConsent,
      third_party_consent: privacyConsent,
      marketing_consent: marketingConsent,
    }, 'torder')
  }

  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-orange-500/15 blur-[160px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[120px]" />
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
              <Icon icon="solar:tablet-bold-duotone" className="h-4 w-4 text-orange-400" />
              <span className="text-small text-gray-400">키오스크 · 티오더</span>
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              인건비는 줄이고<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400">매출은 올리는</span><br />
              스마트 주문
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
              키오스크부터 테이블 오더까지.
              비대면 주문 시스템으로 매장 효율을 높여보세요.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#consult"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white hover:bg-orange-600 hover:shadow-[0_0_40px_rgba(249,115,22,0.25)] active:scale-[0.97] transition-all duration-300 ease-toss group">
                무료 상담 받기
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

      {/* ══════ 제품 종류 ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="max-w-xl mb-14">
            <span className="text-sm font-semibold text-orange-500 tracking-wider uppercase">Products</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight break-keep">
              매장에 맞는<br />주문 시스템을 선택하세요
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: 'solar:monitor-bold-duotone',
              title: '스탠드형 키오스크',
              desc: '입구·카운터에 설치하는 대형 터치 스크린. 고객이 직접 메뉴를 선택하고 결제까지 완료할 수 있어요.',
              features: ['21.5~27인치 터치 디스플레이', '카드·QR·간편결제 통합', '프린터 내장형'],
              tag: '가장 인기',
              highlight: true,
            },
            {
              icon: 'solar:tablet-bold-duotone',
              title: '테이블 오더 (티오더)',
              desc: '각 테이블에 놓인 태블릿이나 QR코드로 주문. 직원 호출 없이 추가 주문도 편하게 할 수 있어요.',
              features: ['QR코드 / 태블릿 선택', '추가 주문 자유', '주방 자동 연동'],
              tag: '비대면',
              highlight: false,
            },
            {
              icon: 'solar:widget-6-bold-duotone',
              title: '벽걸이형 키오스크',
              desc: '공간이 좁은 매장에 적합한 벽부착형. 별도 스탠드 없이 콤팩트하게 설치할 수 있어요.',
              features: ['공간 절약형', '벽면 고정 설치', '15.6인치 터치'],
              tag: '소형매장',
              highlight: false,
            },
            {
              icon: 'solar:smartphone-bold-duotone',
              title: '모바일 오더',
              desc: '고객 스마트폰에서 바로 주문·결제. 앱 설치 없이 QR코드 하나로 시작할 수 있어 진입장벽이 낮아요.',
              features: ['앱 설치 불필요', 'QR코드 스캔 주문', '원격 사전 주문'],
              tag: '초간편',
              highlight: false,
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className={`relative rounded-3xl p-8 md:p-10 transition-all duration-400 ease-toss
                              hover:shadow-card-hover hover:-translate-y-1
                              ${item.highlight ? 'bg-orange-50 gradient-border' : 'bg-gray-50'}`}>
                {item.highlight && (
                  <span className="absolute top-6 right-6 text-[11px] font-bold text-white bg-orange-500 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                {!item.highlight && (
                  <span className="absolute top-6 right-6 text-[11px] font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                <Icon icon={item.icon} className="h-10 w-10 text-orange-500 mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-3 text-base text-gray-600 leading-relaxed break-keep">{item.desc}</p>
                <ul className="mt-5 space-y-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-orange-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 도입 효과 (수치 강조) ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-sm font-semibold text-orange-500 tracking-wider uppercase">Effect</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                도입하면 이렇게 달라져요
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                실제 도입 매장의 평균 효과예요.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {[
              { value: '30%', label: '인건비 절감', icon: 'solar:wallet-money-bold-duotone' },
              { value: '25%', label: '객단가 상승', icon: 'solar:chart-bold-duotone' },
              { value: '40%', label: '주문 속도 향상', icon: 'solar:clock-circle-bold-duotone' },
              { value: '0원', label: '초기 설치비', icon: 'solar:tag-price-bold-duotone' },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 100}>
                <div className="rounded-3xl bg-white p-6 md:p-8 text-center transition-all duration-400 ease-toss hover:shadow-card group">
                  <Icon icon={item.icon} className="h-8 w-8 text-orange-400 mx-auto mb-3 transition-transform duration-400 group-hover:scale-110" />
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{item.value}</p>
                  <p className="mt-1 text-sm text-gray-500 break-keep">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <p className="mt-8 text-center text-sm text-gray-400 break-keep">
              * 업종, 매장 규모에 따라 효과는 달라질 수 있습니다.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 왜 우리편? ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm font-semibold text-orange-500 tracking-wider uppercase">Why Us</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              키오스크, 제대로 도입하세요
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: 'solar:palette-bold-duotone', title: '메뉴 디자인 지원', desc: '매장 메뉴를 키오스크용 고해상도 이미지로 세팅해드려요. 사진이 없어도 기본 템플릿으로 깔끔하게 구성합니다.' },
            { icon: 'solar:settings-bold-duotone', title: 'POS 연동 설정', desc: '기존 POS와 자동 연동해서 주문→조리→결제 흐름이 끊기지 않도록 세팅합니다. 주요 POS 전부 지원해요.' },
            { icon: 'solar:headphones-round-bold-duotone', title: '운영 교육 + A/S', desc: '설치 후 직원분들께 사용법을 교육해드리고, 고장·오류 시 원격 또는 방문 AS를 제공합니다.' },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="rounded-3xl bg-gray-50 p-8 md:p-10 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card">
                <Icon icon={item.icon} className="h-10 w-10 text-orange-500 mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-3 text-base text-gray-500 leading-relaxed break-keep">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <span className="text-sm font-semibold text-orange-500 tracking-wider uppercase">FAQ</span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">자주 묻는 질문</h2>
              </div>
            </FadeIn>
            <div className="space-y-3">
              {[
                { q: '키오스크 도입 비용이 부담되는데, 월 렌탈이 되나요?', a: '네, 월 렌탈 방식으로 초기 비용 0원에 도입할 수 있어요. 약정 기간에 따라 월 비용이 달라지며, 상담 시 정확한 금액을 안내해드립니다.' },
                { q: '우리 매장 POS랑 연동이 되나요?', a: '만나, 포스뱅크, 오케이포스, 포스피드 등 주요 POS 시스템과 연동 가능합니다. 매장에서 사용 중인 POS를 알려주시면 호환 여부를 바로 확인해드려요.' },
                { q: '메뉴가 바뀌면 직접 수정할 수 있나요?', a: '관리자 페이지에서 메뉴 추가·수정·삭제를 직접 하실 수 있어요. 사진 변경이나 가격 변경도 실시간 반영됩니다.' },
                { q: '테이블 오더와 키오스크, 뭐가 더 좋나요?', a: '카페·패스트푸드처럼 카운터 주문이 많으면 키오스크, 음식점·술집처럼 테이블에서 추가 주문이 잦으면 테이블 오더가 유리해요. 두 가지 병행도 가능합니다.' },
                { q: '인터넷이 안 되면 주문이 안 되나요?', a: '인터넷이 끊겨도 오프라인 모드로 기본 주문은 가능해요. 네트워크가 복구되면 자동으로 데이터가 동기화됩니다.' },
              ].map((faq, i) => (
                <FadeIn key={faq.q} delay={i * 60}>
                  <details className="group rounded-2xl bg-white transition-all duration-300 ease-toss hover:shadow-soft">
                    <summary className="flex items-center justify-between cursor-pointer p-6 text-base font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden break-keep">
                      {faq.q}
                      <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-open:bg-orange-500 group-open:text-white transition-all duration-300">
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

      {/* ══════ 상담 CTA (네이버페이 스타일 폼) ══════ */}
      <section id="consult" className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn>
              <div>
                <Icon icon="solar:tablet-bold-duotone" className="h-14 w-14 text-orange-400/40 mb-8" />
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight break-keep">
                  매장 효율을 높이는<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">스마트 주문</span> 시작하세요
                </h2>
                <p className="mt-5 text-base text-gray-400 break-keep">
                  업종과 매장 구조에 맞는 최적의 주문 시스템을 제안해드려요.
                </p>
                <div className="mt-8 space-y-3">
                  {['메뉴 디자인 무료 세팅', 'POS 연동 지원', '설치비 0원 프로모션'].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-orange-400 shrink-0" />
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
                  <input type="text" required placeholder="이름"
                    value={formName} onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">연락처 <span className="text-red-400">*</span></label>
                  <input type="tel" required placeholder="010-0000-0000"
                    value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">매장명 <span className="text-gray-500">(선택)</span></label>
                  <input type="text" placeholder="예: 강남역 카페"
                    value={formShop} onChange={(e) => setFormShop(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 제품</label>
                  <div className="flex flex-wrap gap-2">
                    {['스탠드 키오스크', '벽걸이 키오스크', '테이블 오더', '모바일 오더'].map((item) => (
                      <label key={item} className={`inline-flex items-center px-4 py-2 rounded-full border text-sm cursor-pointer transition-all ${formProducts.includes(item) ? 'bg-orange-500/20 border-orange-400/40 text-orange-300' : 'bg-white/[0.06] border-white/[0.1] text-gray-300'}`}>
                        <input type="checkbox" checked={formProducts.includes(item)} onChange={() => toggleProduct(item)} className="sr-only" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} className="mt-0.5 rounded border-gray-600" required />
                    <span>[필수] 개인정보 수집·이용 및 제3자 제공에 동의합니다. <Link href="/privacy" className="text-orange-400 underline">자세히 보기</Link></span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} className="mt-0.5 rounded border-gray-600" />
                    <span>[선택] 마케팅 정보 수신에 동의합니다.</span>
                  </label>
                </div>
                {submitError && <p className="text-sm text-red-400 text-center">{submitError}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-4 text-base font-semibold text-white hover:bg-orange-600 hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-all duration-400 ease-toss disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? '전송 중...' : '무료 상담 신청하기'}
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

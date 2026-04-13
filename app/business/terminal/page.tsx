'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'

export default function TerminalPage() {
  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/15 blur-[160px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
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
              <Icon icon="solar:card-recive-bold-duotone" className="h-4 w-4 text-violet-400" />
              <span className="text-small text-gray-400">결제단말기</span>
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              매출은 올리고<br />
              <span className="text-gradient">수수료는 낮추는</span><br />
              카드단말기
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
              유선·무선·키인 단말기부터 POS까지.
              업종과 매출에 맞는 최적의 단말기를 비교해드려요.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#consult"
                className="btn-primary group">
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

      {/* ══════ 단말기 종류 비교 ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="max-w-xl mb-14">
            <span className="text-sm font-semibold text-violet-500 tracking-wider uppercase">Products</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight break-keep">
              매장에 딱 맞는<br />단말기를 찾아드려요
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: 'solar:smartphone-bold-duotone',
              title: '무선 단말기',
              desc: '배터리 내장, Wi-Fi/LTE 지원. 테이블 결제나 배달 매장에 최적. 이동하면서 결제할 수 있어 활용도가 높아요.',
              features: ['Wi-Fi + LTE 듀얼', '배터리 8시간+', 'NFC / QR / IC칩'],
              tag: '가장 인기',
              highlight: true,
            },
            {
              icon: 'solar:monitor-bold-duotone',
              title: '유선 단말기',
              desc: '유선 인터넷 연결 방식. 고정 카운터 매장에 적합하고 안정적인 연결을 보장합니다.',
              features: ['유선 연결 안정성', '설치 간편', '저렴한 렌탈비'],
              tag: '가성비',
              highlight: false,
            },
            {
              icon: 'solar:card-transfer-bold-duotone',
              title: '키인(수기) 단말기',
              desc: '카드번호 직접 입력 방식. 전화 주문이나 배달 매장에서 비대면 결제에 활용돼요.',
              features: ['비대면 결제', '전화주문 처리', '소형 경량'],
              tag: '비대면',
              highlight: false,
            },
            {
              icon: 'solar:laptop-bold-duotone',
              title: 'POS 시스템',
              desc: '주문·결제·재고·매출 관리 통합 시스템. 프랜차이즈나 여러 메뉴를 관리하는 매장에 추천합니다.',
              features: ['올인원 매장관리', '매출 리포트', '메뉴/재고 연동'],
              tag: '올인원',
              highlight: false,
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className={`relative rounded-3xl p-8 md:p-10 transition-all duration-400 ease-toss
                              hover:shadow-card-hover hover:-translate-y-1
                              ${item.highlight ? 'bg-violet-50 gradient-border' : 'bg-gray-50'}`}>
                {item.highlight && (
                  <span className="absolute top-6 right-6 text-[11px] font-bold text-white bg-violet-500 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                {!item.highlight && (
                  <span className="absolute top-6 right-6 text-[11px] font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                <Icon icon={item.icon} className="h-10 w-10 text-violet-500 mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-3 text-base text-gray-600 leading-relaxed break-keep">{item.desc}</p>
                <ul className="mt-5 space-y-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-violet-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 수수료 안내 (토스페이먼츠 스타일) ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-sm font-semibold text-violet-500 tracking-wider uppercase">Fee</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                투명한 수수료, 숨은 비용 없이
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                매출 규모에 따라 우대 수수료가 적용돼요.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { label: '영세 가맹점', rate: '0.5%', note: '연 매출 3억 이하', icon: 'solar:shop-bold-duotone' },
              { label: '중소 가맹점', rate: '1.1%', note: '연 매출 3~5억', icon: 'solar:buildings-bold-duotone' },
              { label: '일반 가맹점', rate: '1.5%~', note: '연 매출 5억 초과', icon: 'solar:city-bold-duotone' },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 100}>
                <div className="rounded-3xl bg-white p-8 text-center transition-all duration-400 ease-toss hover:shadow-card group">
                  <Icon icon={item.icon} className="h-10 w-10 text-violet-400 mx-auto mb-4 transition-transform duration-400 group-hover:scale-110" />
                  <p className="text-sm font-semibold text-gray-500 mb-1">{item.label}</p>
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">{item.rate}</p>
                  <p className="mt-1 text-sm text-gray-400">{item.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300}>
            <p className="mt-8 text-center text-sm text-gray-400 break-keep">
              * 카드 수수료는 여신금융협회 기준이며, VAN사·카드사에 따라 달라질 수 있습니다.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 왜 우리편? ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm font-semibold text-violet-500 tracking-wider uppercase">Why Us</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              단말기, 아무데서나 받지 마세요
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: 'solar:chart-square-bold-duotone', title: '전 VAN사 비교', desc: 'NICE, KIS, KICC, 한국정보통신 등 주요 VAN사를 한눈에 비교하고, 매장에 유리한 조건을 찾아드려요.' },
            { icon: 'solar:delivery-bold-duotone', title: '당일 설치 가능', desc: '재고 보유 모델은 당일 설치. 영업에 지장 없도록 매장 운영 시간에 맞춰 방문합니다.' },
            { icon: 'solar:shield-check-bold-duotone', title: 'AS·유지보수 포함', desc: '설치 후에도 걱정 없이. 고장·교체·수수료 변경 등 운영 중 생기는 문제를 끝까지 케어해요.' },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="rounded-3xl bg-gray-50 p-8 md:p-10 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card">
                <Icon icon={item.icon} className="h-10 w-10 text-violet-500 mb-5" />
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
                <span className="text-sm font-semibold text-violet-500 tracking-wider uppercase">FAQ</span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">자주 묻는 질문</h2>
              </div>
            </FadeIn>
            <div className="space-y-3">
              {[
                { q: '단말기 렌탈과 구매, 뭐가 유리한가요?', a: '월 매출과 사용 기간에 따라 다릅니다. 보통 3년 이상 사용 시 구매가, 단기 운영이면 렌탈이 유리해요. 상담 시 두 가지 모두 비교해드립니다.' },
                { q: 'VAN사는 어떻게 선택해야 하나요?', a: 'VAN사마다 수수료·정산 주기·부가서비스가 다릅니다. 매출 규모와 업종에 맞는 VAN사를 분석해서 추천해드려요.' },
                { q: '기존 단말기 교체도 되나요?', a: '네, 기존 VAN사 해지 + 새 단말기 설치까지 원스톱으로 처리합니다. 위약금이 있는 경우 혜택으로 상쇄할 수 있는지도 확인해드려요.' },
                { q: '애플페이·삼성페이도 되나요?', a: '최신 무선단말기는 NFC를 기본 지원하므로 애플페이, 삼성페이 모두 결제 가능합니다.' },
              ].map((faq, i) => (
                <FadeIn key={faq.q} delay={i * 60}>
                  <details className="group rounded-2xl bg-white transition-all duration-300 ease-toss hover:shadow-soft">
                    <summary className="flex items-center justify-between cursor-pointer p-6 text-base font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden break-keep">
                      {faq.q}
                      <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-open:bg-violet-500 group-open:text-white transition-all duration-300">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn>
              <div>
                <Icon icon="solar:card-recive-bold-duotone" className="h-14 w-14 text-violet-400/40 mb-8" />
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight break-keep">
                  매장에 딱 맞는<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">단말기 추천</span> 받으세요
                </h2>
                <p className="mt-5 text-base text-gray-400 break-keep">
                  업종, 매출, 결제 방식에 맞는 최적의 단말기를 찾아드려요.
                </p>
                <div className="mt-8 space-y-3">
                  {['VAN사 수수료 비교 분석', '렌탈 vs 구매 견적 제공', '당일 설치 가능'].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-violet-400 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <form onSubmit={(e) => { e.preventDefault(); alert('상담 신청이 완료되었습니다!') }}
                className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-8 md:p-10 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">연락처 <span className="text-red-400">*</span></label>
                  <input type="tel" required placeholder="010-0000-0000"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">매장명 <span className="text-gray-500">(선택)</span></label>
                  <input type="text" placeholder="예: 강남역 카페"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 단말기</label>
                  <div className="flex flex-wrap gap-2">
                    {['무선단말기', '유선단말기', 'POS', '키인단말기'].map((item) => (
                      <label key={item} className="inline-flex items-center px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-sm text-gray-300 has-[:checked]:bg-violet-500/20 has-[:checked]:border-violet-400/40 has-[:checked]:text-violet-300 cursor-pointer transition-all">
                        <input type="checkbox" value={item} className="sr-only" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-violet-500 px-6 py-4 text-base font-semibold text-white hover:bg-violet-600 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] active:scale-[0.98] transition-all duration-400 ease-toss">
                  <Send className="mr-2 h-4 w-4" />
                  무료 상담 신청하기
                </button>
                <p className="text-center text-xs text-gray-500">상담 신청 시 개인정보 처리방침에 동의합니다.</p>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

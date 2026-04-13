'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'

export default function CCTVPage() {
  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[160px]" />
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
              <Icon icon="solar:videocamera-record-bold-duotone" className="h-4 w-4 text-emerald-400" />
              <span className="text-small text-gray-400">CCTV 설치</span>
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              매장을 24시간<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400">스마트하게 지키는</span><br />
              CCTV
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep">
              매장 크기와 구조에 맞는 CCTV를 추천해드려요.
              스마트폰으로 언제든 실시간 확인할 수 있어요.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#consult"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-600 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] active:scale-[0.97] transition-all duration-300 ease-toss group">
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

      {/* ══════ CCTV 종류 ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="max-w-xl mb-14">
            <span className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">Products</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight break-keep">
              용도에 맞는<br />CCTV를 골라보세요
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: 'solar:camera-bold-duotone',
              title: '실내 돔 카메라',
              desc: '천장 부착형 반구 디자인. 매장·사무실 실내 감시에 최적이에요. 깔끔한 외관으로 인테리어를 해치지 않습니다.',
              features: ['200만~500만 화소', '야간 적외선 자동 전환', '넓은 시야각 120°'],
              tag: '실내 추천',
              highlight: true,
            },
            {
              icon: 'solar:camera-minimalistic-bold-duotone',
              title: '실외 불릿 카메라',
              desc: '방수·방진(IP67) 설계로 야외 설치 가능. 주차장, 출입구, 건물 외벽 감시에 적합합니다.',
              features: ['IP67 방수방진', '야간 30m 감시', '알루미늄 하우징'],
              tag: '실외 추천',
              highlight: false,
            },
            {
              icon: 'solar:global-bold-duotone',
              title: 'PTZ 카메라',
              desc: '상하좌우 회전 + 줌 기능. 넓은 공간을 하나의 카메라로 커버할 수 있어 대형 매장·창고에 효율적이에요.',
              features: ['360° 회전', '최대 30배 줌', '자동 추적 기능'],
              tag: '대형매장',
              highlight: false,
            },
            {
              icon: 'solar:wifi-router-bold-duotone',
              title: '무선(Wi-Fi) 카메라',
              desc: '배선 공사 없이 Wi-Fi만으로 설치. 소규모 매장이나 사무실에서 간편하게 시작할 수 있어요.',
              features: ['배선 공사 불필요', '앱으로 간편 설치', '양방향 오디오'],
              tag: '간편설치',
              highlight: false,
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className={`relative rounded-3xl p-8 md:p-10 transition-all duration-400 ease-toss
                              hover:shadow-card-hover hover:-translate-y-1
                              ${item.highlight ? 'bg-emerald-50 gradient-border' : 'bg-gray-50'}`}>
                {item.highlight && (
                  <span className="absolute top-6 right-6 text-[11px] font-bold text-white bg-emerald-500 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                {!item.highlight && (
                  <span className="absolute top-6 right-6 text-[11px] font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                <Icon icon={item.icon} className="h-10 w-10 text-emerald-500 mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-3 text-base text-gray-600 leading-relaxed break-keep">{item.desc}</p>
                <ul className="mt-5 space-y-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 채널 수 가이드 ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">Guide</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                매장 크기별 추천 채널 수
              </h2>
              <p className="mt-4 text-base text-gray-500 break-keep">
                매장 면적과 구조에 따라 필요한 카메라 수가 달라져요.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { label: '소형 매장', channels: '4채널', note: '10평 이하 · 카페, 네일샵', icon: 'solar:shop-bold-duotone' },
              { label: '중형 매장', channels: '8채널', note: '10~30평 · 음식점, 미용실', icon: 'solar:buildings-bold-duotone' },
              { label: '대형 매장', channels: '16채널+', note: '30평 이상 · 마트, 학원', icon: 'solar:city-bold-duotone' },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 100}>
                <div className="rounded-3xl bg-white p-8 text-center transition-all duration-400 ease-toss hover:shadow-card group">
                  <Icon icon={item.icon} className="h-10 w-10 text-emerald-400 mx-auto mb-4 transition-transform duration-400 group-hover:scale-110" />
                  <p className="text-sm font-semibold text-gray-500 mb-1">{item.label}</p>
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">{item.channels}</p>
                  <p className="mt-1 text-sm text-gray-400 break-keep">{item.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300}>
            <p className="mt-8 text-center text-sm text-gray-400 break-keep">
              * 정확한 채널 수는 매장 방문 후 구조를 확인하고 안내해드립니다.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 핵심 기능 ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">Features</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
              설치하면 이런 게 돼요
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: 'solar:smartphone-bold-duotone', title: '스마트폰 원격 확인', desc: '전용 앱 하나로 언제 어디서든 매장 CCTV를 실시간 확인할 수 있어요. 여러 매장도 한 앱에서 관리됩니다.' },
            { icon: 'solar:cloud-storage-bold-duotone', title: '클라우드 저장', desc: 'NVR 로컬 저장 + 클라우드 백업 선택 가능. 영상 유실 걱정 없이 30일~90일 저장할 수 있어요.' },
            { icon: 'solar:bell-bing-bold-duotone', title: '이상 감지 알림', desc: '움직임 감지, 침입 알림, 소리 감지 기능으로 이상 상황 발생 시 즉시 스마트폰 푸시 알림을 보내드려요.' },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="rounded-3xl bg-gray-50 p-8 md:p-10 transition-all duration-400 ease-toss hover:bg-white hover:shadow-card">
                <Icon icon={item.icon} className="h-10 w-10 text-emerald-500 mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 break-keep">{item.title}</h3>
                <p className="mt-3 text-base text-gray-500 leading-relaxed break-keep">{item.desc}</p>
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
              <span className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">Process</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                상담부터 설치까지, 3단계면 끝
              </h2>
            </div>
          </FadeIn>

          <div className="relative max-w-3xl mx-auto">
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-0.5 bg-emerald-200" />
            <div className="grid md:grid-cols-3 gap-8 md:gap-5">
              {[
                { step: '01', title: '전화 상담', desc: '매장 규모·구조·예산을 확인하고 최적의 구성을 안내해드려요.', icon: 'solar:phone-calling-bold-duotone' },
                { step: '02', title: '현장 방문', desc: '설치 가능한 위치와 사각지대를 직접 확인한 뒤 정확한 견적을 드려요.', icon: 'solar:map-point-wave-bold-duotone' },
                { step: '03', title: '설치 완료', desc: '깔끔한 배선 + 앱 연동까지. 영업에 지장 없는 시간에 설치합니다.', icon: 'solar:check-circle-bold-duotone' },
              ].map((item, i) => (
                <FadeIn key={item.step} delay={i * 150}>
                  <div className="text-center">
                    <div className="relative mx-auto w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 transition-transform duration-400 ease-toss hover:scale-105">
                      <Icon icon={item.icon} className="h-9 w-9 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-emerald-500 tracking-widest">STEP {item.step}</span>
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
              <span className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">FAQ</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">자주 묻는 질문</h2>
            </div>
          </FadeIn>
          <div className="space-y-3">
            {[
              { q: 'CCTV 설치비는 얼마인가요?', a: '매장 규모와 카메라 수에 따라 다르지만, 4채널 기본 설치 시 설치비 무료 프로모션을 진행하는 경우가 많아요. 상담 시 정확한 견적을 안내해드립니다.' },
              { q: '녹화 영상은 얼마나 저장되나요?', a: 'NVR 하드디스크 용량에 따라 다릅니다. 보통 4채널 1TB 기준 약 30일, 2TB 기준 약 60일 저장이 가능해요. 클라우드 옵션도 선택할 수 있습니다.' },
              { q: '야간에도 잘 보이나요?', a: '적외선 IR LED 내장 카메라는 완전히 어두운 환경에서도 선명하게 촬영됩니다. 야간 감시 거리는 모델에 따라 15m~30m 정도예요.' },
              { q: '기존 CCTV를 교체할 수 있나요?', a: '네, 기존 배선을 최대한 활용해서 교체 설치하므로 추가 비용을 줄일 수 있어요. 현장 방문 시 기존 환경을 확인한 뒤 안내해드립니다.' },
              { q: 'AS나 고장 시 어떻게 하나요?', a: '설치 후 1년 무상 AS를 제공하며, 원격 점검으로 빠르게 해결해드려요. 카메라 고장 시 대체 장비를 즉시 배송해드립니다.' },
            ].map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 60}>
                <details className="group rounded-2xl bg-gray-50 transition-all duration-300 ease-toss hover:shadow-soft">
                  <summary className="flex items-center justify-between cursor-pointer p-6 text-base font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden break-keep">
                    {faq.q}
                    <span className="ml-6 flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-open:bg-emerald-500 group-open:text-white transition-all duration-300">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeIn>
              <div>
                <Icon icon="solar:videocamera-record-bold-duotone" className="h-14 w-14 text-emerald-400/40 mb-8" />
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight break-keep">
                  우리 매장에 맞는<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">CCTV 구성</span> 받아보세요
                </h2>
                <p className="mt-5 text-base text-gray-400 break-keep">
                  매장 면적, 구조, 예산에 맞춰 최적의 CCTV를 제안해드려요.
                </p>
                <div className="mt-8 space-y-3">
                  {['무료 현장 방문 상담', '설치비 0원 프로모션', 'A/S 1년 무상 보증'].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-emerald-400 shrink-0" />
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
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">매장명 <span className="text-gray-500">(선택)</span></label>
                  <input type="text" placeholder="예: 강남역 카페"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">관심 항목</label>
                  <div className="flex flex-wrap gap-2">
                    {['실내 CCTV', '실외 CCTV', '무선 카메라', '기존 교체'].map((item) => (
                      <label key={item} className="inline-flex items-center px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-sm text-gray-300 has-[:checked]:bg-emerald-500/20 has-[:checked]:border-emerald-400/40 has-[:checked]:text-emerald-300 cursor-pointer transition-all">
                        <input type="checkbox" value={item} className="sr-only" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white hover:bg-emerald-600 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all duration-400 ease-toss">
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

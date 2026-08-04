'use client'

import { Icon } from '@iconify/react'
import { ArrowRight, Phone, Send } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import Link from 'next/link'
import { EditableText } from '@/components/editable/EditableText'
import { useBlocks } from '@/components/editable/BlocksProvider'
import { pickTextOrUndef, pickImageOrUndef } from '@/lib/content-blocks'
import { EditableImage } from '@/components/editable/EditableImage'

const PAGE = '/about'
const k = (s: string) => `about.${s}`

export default function AboutClient() {
  const blocks = useBlocks()
  return (
    <>
      {/* ══════ 히어로 ══════ */}
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 md:pt-40 md:pb-28">
        {/* 어드민이 업로드한 hero 배경 이미지 (선택) — 미업로드 시 다크 그대로 */}
        <EditableImage
          blockKey={k('hero.background')}
          fallback={{ url: '', alt: '회사소개 배경' }}
          value={pickImageOrUndef(blocks, k('hero.background'))}
          pagePath={PAGE}
          className="absolute inset-0 [&_img]:absolute [&_img]:inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:opacity-90"
          imgClassName=""
          sizes="100vw"
          priority
        />
        {/* 배경 사진 위 가독성 확보 — 하단만 살짝 어둡게 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/10 to-gray-950/40 pointer-events-none" />
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
              <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-4 w-4 text-blue-400" />
              <EditableText
                as="span"
                blockKey={k('hero.eyebrow')}
                fallback="회사소개"
                value={pickTextOrUndef(blocks, k('hero.eyebrow'))}
                pagePath={PAGE}
                className="text-small text-gray-400"
              />
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl break-keep">
              <EditableText
                as="span"
                blockKey={k('hero.title.line1')}
                fallback="사장님 옆에 서서"
                value={pickTextOrUndef(blocks, k('hero.title.line1'))}
                pagePath={PAGE}
              /><br />
              <span className="text-gradient">
                <EditableText
                  as="span"
                  blockKey={k('hero.title.highlight')}
                  fallback="같이 고민하는 팀"
                  value={pickTextOrUndef(blocks, k('hero.title.highlight'))}
                  pagePath={PAGE}
                />
              </span>,<br />
              <EditableText
                as="span"
                blockKey={k('hero.title.line3')}
                fallback="우리편"
                value={pickTextOrUndef(blocks, k('hero.title.line3'))}
                pagePath={PAGE}
              />
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <EditableText
              as="p"
              blockKey={k('hero.description')}
              fallback="매장 인프라를 가장 쉽고 합리적으로. 인터넷부터 단말기·CCTV·키오스크까지, 사장님의 편에서 답을 찾아드려요."
              value={pickTextOrUndef(blocks, k('hero.description'))}
              pagePath={PAGE}
              className="mt-6 text-base md:text-lg text-gray-400 max-w-lg leading-relaxed break-keep"
            />
          </FadeIn>
        </div>
      </section>

      {/* ══════ 미션 / 비전 ══════ */}
      <section className="section-container section-gap">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <FadeIn>
            <div>
              <EditableText as="span" blockKey={k('mission.eyebrow')} fallback="Our Mission"
                value={pickTextOrUndef(blocks, k('mission.eyebrow'))} pagePath={PAGE}
                className="text-sm font-semibold text-primary tracking-wider uppercase" />
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight break-keep">
                <EditableText as="span" blockKey={k('mission.title.line1')} fallback="매장 인프라,"
                  value={pickTextOrUndef(blocks, k('mission.title.line1'))} pagePath={PAGE} /><br />
                <EditableText as="span" blockKey={k('mission.title.line2')} fallback="더 이상 어렵지 않게"
                  value={pickTextOrUndef(blocks, k('mission.title.line2'))} pagePath={PAGE} />
              </h2>
              <EditableText as="p" blockKey={k('mission.paragraph.0')}
                fallback="신규 매장을 열든, 기존 장비를 교체하든, 사장님들은 인터넷·단말기·CCTV·키오스크를 각각 다른 곳에서 알아봐야 했어요. 가격 비교도 어렵고, 어디가 좋은지 판단하기도 힘들죠."
                value={pickTextOrUndef(blocks, k('mission.paragraph.0'))} pagePath={PAGE}
                className="mt-5 text-base text-gray-500 leading-relaxed break-keep" />
              <EditableText as="p" blockKey={k('mission.paragraph.1')}
                fallback="우리편은 이 과정을 하나로 합쳤어요. 한 번의 상담으로 필요한 인프라를 전부 비교하고, 업종과 매장 상황에 맞는 최적의 조합을 찾아드립니다."
                value={pickTextOrUndef(blocks, k('mission.paragraph.1'))} pagePath={PAGE}
                className="mt-4 text-base text-gray-500 leading-relaxed break-keep" />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '47,200+', label: '상담 건수', icon: 'solar:chat-round-dots-bold-duotone' },
                { value: '4.87', label: '고객 만족도', icon: 'solar:star-bold-duotone' },
                { value: '3사+', label: '통신사 비교', icon: 'solar:global-bold-duotone' },
                { value: '0원', label: '상담비용', icon: 'solar:wallet-money-bold-duotone' },
              ].map((item, i) => (
                <div key={item.label} className="rounded-2xl bg-gray-50 p-6 text-center">
                  <Icon icon={item.icon} className="h-7 w-7 text-primary mx-auto mb-2" />
                  <EditableText as="p" blockKey={k(`stats.${i}.value`)} fallback={item.value}
                    value={pickTextOrUndef(blocks, k(`stats.${i}.value`))} pagePath={PAGE}
                    className="text-2xl font-bold text-gray-900 tracking-tight" />
                  <EditableText as="p" blockKey={k(`stats.${i}.label`)} fallback={item.label}
                    value={pickTextOrUndef(blocks, k(`stats.${i}.label`))} pagePath={PAGE}
                    className="text-xs text-gray-500 mt-1" />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 우리가 다른 점 ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14">
              <EditableText as="span" blockKey={k('different.eyebrow')} fallback="Why Different"
                value={pickTextOrUndef(blocks, k('different.eyebrow'))} pagePath={PAGE}
                className="text-sm font-semibold text-primary tracking-wider uppercase" />
              <EditableText as="h2" blockKey={k('different.title')} fallback="우리편이 다른 점"
                value={pickTextOrUndef(blocks, k('different.title'))} pagePath={PAGE}
                className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep" />
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: 'solar:scale-bold-duotone', title: '중립적 비교', desc: '특정 통신사·VAN사에 치우치지 않고 모든 옵션을 공정하게 비교해드려요. 사장님에게 유리한 조건이 우선입니다.' },
              { icon: 'solar:hand-shake-bold-duotone', title: '원스톱 상담', desc: '인터넷·단말기·CCTV·키오스크를 여기저기 알아보실 필요 없어요. 한 번의 상담으로 필요한 인프라를 전부 해결합니다.' },
              { icon: 'solar:heart-bold-duotone', title: '설치 후 케어', desc: '설치하고 끝이 아니에요. 장비 고장, 수수료 변경, 요금제 재검토까지 계속 챙겨드립니다.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="rounded-3xl bg-white p-8 md:p-10 transition-all duration-400 ease-toss hover:shadow-card">
                  <Icon icon={item.icon} className="h-10 w-10 text-primary mb-5" />
                  <EditableText as="h3" blockKey={k(`different.card.${i}.title`)} fallback={item.title}
                    value={pickTextOrUndef(blocks, k(`different.card.${i}.title`))} pagePath={PAGE}
                    className="text-xl font-semibold text-gray-900 break-keep" />
                  <EditableText as="p" blockKey={k(`different.card.${i}.desc`)} fallback={item.desc}
                    value={pickTextOrUndef(blocks, k(`different.card.${i}.desc`))} pagePath={PAGE}
                    className="mt-3 text-base text-gray-500 leading-relaxed break-keep" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 취급 상품 ══════ */}
      <section className="section-container section-gap">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-14">
            <EditableText as="span" blockKey={k('products.eyebrow')} fallback="Products"
              value={pickTextOrUndef(blocks, k('products.eyebrow'))} pagePath={PAGE}
              className="text-sm font-semibold text-primary tracking-wider uppercase" />
            <EditableText as="h2" blockKey={k('products.title')} fallback="매장에 필요한 건 다 있어요"
              value={pickTextOrUndef(blocks, k('products.title'))} pagePath={PAGE}
              className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep" />
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: 'solar:global-bold-duotone', title: '사업자 인터넷', desc: 'SKT·KT·LG U+ 3사 비교', link: '/internet', color: 'text-sky-500' },
            { icon: 'solar:card-recive-bold-duotone', title: '카드단말기', desc: '무선·유선·POS·키인', link: '/business/terminal', color: 'text-violet-500' },
            { icon: 'solar:videocamera-record-bold-duotone', title: 'CCTV', desc: '실내·실외·원격 감시', link: '/business/cctv', color: 'text-emerald-500' },
            { icon: 'solar:tablet-bold-duotone', title: '키오스크·티오더', desc: '스탠드·벽걸이·테이블', link: '/business/torder', color: 'text-orange-500' },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <Link href={item.link}
                className="group rounded-3xl bg-gray-50 p-7 flex flex-col items-center text-center transition-all duration-400 ease-toss hover:bg-white hover:shadow-card-hover hover:-translate-y-1">
                <Icon icon={item.icon} className={`h-12 w-12 ${item.color} mb-4 transition-transform duration-400 group-hover:scale-110`} />
                <EditableText as="h3" blockKey={k(`products.card.${i}.title`)} fallback={item.title}
                  value={pickTextOrUndef(blocks, k(`products.card.${i}.title`))} pagePath={PAGE}
                  className="text-lg font-semibold text-gray-900" />
                <EditableText as="p" blockKey={k(`products.card.${i}.desc`)} fallback={item.desc}
                  value={pickTextOrUndef(blocks, k(`products.card.${i}.desc`))} pagePath={PAGE}
                  className="mt-1 text-sm text-gray-500" />
                <span className="mt-4 text-sm font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  자세히 보기
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ 연혁 타임라인 ══════ */}
      <section className="bg-gray-50">
        <div className="section-container section-gap">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14">
              <EditableText as="span" blockKey={k('history.eyebrow')} fallback="History"
                value={pickTextOrUndef(blocks, k('history.eyebrow'))} pagePath={PAGE}
                className="text-sm font-semibold text-primary tracking-wider uppercase" />
              <EditableText as="h2" blockKey={k('history.title')} fallback="우리편의 걸어온 길"
                value={pickTextOrUndef(blocks, k('history.title'))} pagePath={PAGE}
                className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep" />
            </div>
          </FadeIn>

          <div className="max-w-xl mx-auto">
            <div className="relative pl-8 border-l-2 border-gray-200 space-y-10">
              {[
                { year: '2024', title: '우리편 서비스 런칭', desc: '매장 인프라 통합 상담 서비스 시작' },
                { year: '2024', title: '3사 인터넷 비교 서비스', desc: 'SKT·KT·LG U+ 사업자 인터넷 비교 도입' },
                { year: '2025', title: '단말기·CCTV 라인업 확장', desc: '전 VAN사 비교 + CCTV 설치 서비스 추가' },
                { year: '2025', title: '키오스크·티오더 도입', desc: '비대면 주문 솔루션까지 원스톱 상담 확대' },
                { year: '2026', title: '누적 상담 47,000건 돌파', desc: '전국 사업자 대상 인프라 컨설팅 확대 중' },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary" />
                    <EditableText as="span" blockKey={k(`history.item.${i}.year`)} fallback={item.year}
                      value={pickTextOrUndef(blocks, k(`history.item.${i}.year`))} pagePath={PAGE}
                      className="text-xs font-bold text-primary tracking-widest" />
                    <EditableText as="h3" blockKey={k(`history.item.${i}.title`)} fallback={item.title}
                      value={pickTextOrUndef(blocks, k(`history.item.${i}.title`))} pagePath={PAGE}
                      className="mt-1 text-base font-semibold text-gray-900 break-keep" />
                    <EditableText as="p" blockKey={k(`history.item.${i}.desc`)} fallback={item.desc}
                      value={pickTextOrUndef(blocks, k(`history.item.${i}.desc`))} pagePath={PAGE}
                      className="mt-1 text-sm text-gray-500 break-keep" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[160px]" />
        </div>
        <div className="section-container section-gap relative">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight break-keep">
                <EditableText as="span" blockKey={k('cta.title.line1')} fallback="매장 인프라,"
                  value={pickTextOrUndef(blocks, k('cta.title.line1'))} pagePath={PAGE} /><br />
                <span className="text-gradient">
                  <EditableText as="span" blockKey={k('cta.title.highlight')} fallback="우리편에게 맡겨보세요"
                    value={pickTextOrUndef(blocks, k('cta.title.highlight'))} pagePath={PAGE} />
                </span>
              </h2>
              <EditableText as="p" blockKey={k('cta.description')} fallback="한 번의 전화로 인터넷·단말기·CCTV·키오스크까지 전부 상담받을 수 있어요."
                value={pickTextOrUndef(blocks, k('cta.description'))} pagePath={PAGE}
                className="mt-5 text-base text-gray-400 break-keep" />
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/recommend"
                  className="btn-primary group">
                  맞춤 추천 받기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a href="tel:1600-6116"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white glass-dark hover:bg-white/[0.08] transition-all duration-300">
                  <Phone className="mr-2 h-4 w-4" />
                  1600-6116
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}

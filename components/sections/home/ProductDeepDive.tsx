'use client'

// ─────────────────────────────────────────────
// 제품 딥다이브 섹션 (페이히어 "페이히어 터미널" 포맷 벤치마크)
//  - 제품 1개 × 특징 4~5개 × 스펙 이미지 1~2개 = 섹션당 5슬롯
//  - 홈에서 3개 제품 반복 사용 (카드단말기 / 키오스크 / CCTV)
//
// 인라인 편집 지원 (2026-04-21 추가) :
//   - keyPrefix prop 을 지정하면 EditableText/Link 로 래핑 → admin 이 ✏️ 눌러 편집
//   - keyPrefix 미지정 시 기존 방식 그대로 렌더 (재사용성 유지)
//   - 의미 기반 키 사용 : features/specs 에 keyBase 필드 추가해서
//     순서 바꿔도 DB 값 안 꼬이게 함
//   - title 은 JSX 직접 받지 않고 titleParts {line1, line2} 로 받아
//     line2 를 primary 강조로 자동 렌더 (편집 시에도 구조 유지)
// ─────────────────────────────────────────────

import Link from 'next/link'
import { Icon } from '@iconify/react'
import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'
import { EditableText } from '@/components/editable/EditableText'
import { EditableLink } from '@/components/editable/EditableLink'
import { useBlocks } from '@/components/editable/BlocksProvider'
import { pickTextOrUndef, pickLinkOrUndef } from '@/lib/content-blocks'

// -------------------------------------------------------------
// 데이터 타입 — 인라인 편집용 keyBase 필드 추가
// -------------------------------------------------------------
export interface ProductFeature {
  /** 블록키 묶음용 (예: "integrated", "lowfee") — keyPrefix 지정 시 필수 */
  keyBase?: string
  title: string
  desc: string
  icon: string
  // 각 특징당 작은 이미지 슬롯 (선택)
  subject?: string
  vendor?: 'wooripen' | 'tossplace' | 'torder'
}

export interface ProductSpec {
  /** 블록키 묶음용 (예: "weight", "battery") — keyPrefix 지정 시 필수 */
  keyBase?: string
  label: string       // "467g"
  value: string       // "초경량 휴대"
}

export interface ProductDeepDiveProps {
  eyebrow: string       // 섹션 상단 뱃지
  /** title 을 JSX 로 직접 받는 "레거시" 경로 — keyPrefix 지정 시 무시됨 */
  title?: React.ReactNode
  /** keyPrefix 지정 시 사용 — line1(일반) + line2(primary 강조) */
  titleParts?: { line1: string; line2: string }
  accentClass?: string  // 제목 강조 색 (기본: primary)
  // 메인 히어로컷 (왼쪽 대형 이미지)
  vendor: 'wooripen' | 'tossplace' | 'torder'
  mainSubject: string
  mainLabel: string
  mainHint: string
  mainIcon: string
  // 특징 카드 4~5개
  features: ProductFeature[]
  // 스펙 하이라이트 (선택)
  specs?: ProductSpec[]
  // CTA
  ctaLabel: string
  ctaHref: string
  // 배경 테마
  bgClass?: string
  // 섹션 앵커 id (링크용)
  id?: string
  // 레이아웃 방향 (좌↔우 교대 연출용)
  reverse?: boolean

  // ━━━ 인라인 편집 모드 (2026-04-21 추가) ━━━
  /** 블록키 prefix (예: "home.product.terminal")
   *  지정 시 : EditableText/Link 로 래핑되어 admin 이 ✏️ 로 편집 가능
   *  미지정 시 : 기존 방식 그대로 렌더
   */
  keyPrefix?: string
  /** 저장 후 revalidate 할 페이지 경로 (예: "/") — keyPrefix 와 세트 */
  pagePath?: string
}

export default function ProductDeepDive({
  eyebrow,
  title,
  titleParts,
  accentClass = 'text-primary',
  vendor,
  mainSubject,
  mainLabel,
  mainHint,
  mainIcon,
  features,
  specs,
  ctaLabel,
  ctaHref,
  bgClass = 'bg-gray-50',
  id,
  reverse = false,
  keyPrefix,
  pagePath,
}: ProductDeepDiveProps) {
  // keyPrefix 가 있으면 편집 모드 — BlocksProvider 의 Context 값을 읽어 DB 저장값 우선 사용
  const blocks = useBlocks()
  const isEditable = !!keyPrefix

  return (
    <section id={id} className={`py-16 md:py-28 ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* 상단 헤드 */}
        <FadeIn>
          <div className={`max-w-3xl ${reverse ? 'md:ml-auto md:text-right' : ''}`}>
            {/* ── Eyebrow ── */}
            {isEditable ? (
              <EditableText
                blockKey={`${keyPrefix}.eyebrow`}
                as="span"
                value={pickTextOrUndef(blocks, `${keyPrefix}.eyebrow`)}
                fallback={eyebrow}
                pagePath={pagePath}
                className={`inline-block px-3 py-1 text-xs md:text-sm font-semibold ${accentClass} bg-white/80 rounded-full mb-4`}
              />
            ) : (
              <span
                className={`inline-block px-3 py-1 text-xs md:text-sm font-semibold ${accentClass} bg-white/80 rounded-full mb-4`}
              >
                {eyebrow}
              </span>
            )}

            {/* ── Title ── */}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight break-keep">
              {isEditable && titleParts ? (
                <>
                  {/* h2 는 바깥에서 이미 감싸고 있어서 내부는 span 으로 렌더 → SEO 영향 X */}
                  <EditableText
                    blockKey={`${keyPrefix}.title_line1`}
                    as="span"
                    value={pickTextOrUndef(blocks, `${keyPrefix}.title_line1`)}
                    fallback={titleParts.line1}
                    pagePath={pagePath}
                  />
                  <br className="hidden sm:inline" />
                  {' '}
                  <EditableText
                    blockKey={`${keyPrefix}.title_line2`}
                    as="span"
                    value={pickTextOrUndef(blocks, `${keyPrefix}.title_line2`)}
                    fallback={titleParts.line2}
                    pagePath={pagePath}
                    className="text-primary"
                  />
                </>
              ) : (
                title
              )}
            </h2>
          </div>
        </FadeIn>

        {/* 메인 영역: 좌 이미지 / 우 특징 */}
        <div
          className={`mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          {/* 좌: 메인 제품컷 */}
          <FadeIn delay={60} direction={reverse ? 'right' : 'left'}>
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <MediaSlot
                vendor={vendor}
                usage="product"
                subject={mainSubject}
                number="01"
                aspect="4/3"
                label={mainLabel}
                hint={mainHint}
                icon={mainIcon}
                sizes="(max-width: 1024px) 100vw, 50vw"
                fit="cover"
              />
            </div>

            {/* 스펙 하이라이트 (선택) */}
            {specs && specs.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {specs.map((spec, i) => {
                  // 편집 모드 : keyBase 기반 블록키 사용
                  const specKey = isEditable && spec.keyBase
                    ? `${keyPrefix}.spec.${spec.keyBase}`
                    : null

                  return (
                    <div
                      key={spec.keyBase ?? i}
                      className="p-3 md:p-4 rounded-2xl bg-white border border-gray-100"
                    >
                      {specKey ? (
                        <>
                          <EditableText
                            blockKey={`${specKey}.label`}
                            as="div"
                            value={pickTextOrUndef(blocks, `${specKey}.label`)}
                            fallback={spec.label}
                            pagePath={pagePath}
                            className="text-base md:text-lg font-bold text-gray-900 leading-tight break-keep"
                          />
                          <EditableText
                            blockKey={`${specKey}.value`}
                            as="div"
                            value={pickTextOrUndef(blocks, `${specKey}.value`)}
                            fallback={spec.value}
                            pagePath={pagePath}
                            className="mt-1 text-xs md:text-sm text-gray-500 leading-tight break-keep"
                          />
                        </>
                      ) : (
                        <>
                          <div className="text-base md:text-lg font-bold text-gray-900 leading-tight break-keep">
                            {spec.label}
                          </div>
                          <div className="mt-1 text-xs md:text-sm text-gray-500 leading-tight break-keep">
                            {spec.value}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </FadeIn>

          {/* 우: 특징 리스트 */}
          <FadeIn delay={120} direction={reverse ? 'left' : 'right'}>
            <ul className="space-y-5 md:space-y-6">
              {features.map((f, i) => {
                // 편집 모드 : keyBase 기반 블록키 사용
                const featureKey = isEditable && f.keyBase
                  ? `${keyPrefix}.feature.${f.keyBase}`
                  : null

                return (
                  <li key={f.keyBase ?? i} className="flex gap-4">
                    <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon icon={f.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      {featureKey ? (
                        <>
                          <EditableText
                            blockKey={`${featureKey}.title`}
                            as="h3"
                            value={pickTextOrUndef(blocks, `${featureKey}.title`)}
                            fallback={f.title}
                            pagePath={pagePath}
                            className="text-base md:text-lg font-bold text-gray-900 break-keep"
                          />
                          <EditableText
                            blockKey={`${featureKey}.desc`}
                            as="p"
                            value={pickTextOrUndef(blocks, `${featureKey}.desc`)}
                            fallback={f.desc}
                            pagePath={pagePath}
                            className="mt-1 text-sm md:text-base text-gray-600 leading-relaxed break-keep"
                          />
                        </>
                      ) : (
                        <>
                          <h3 className="text-base md:text-lg font-bold text-gray-900 break-keep">
                            {f.title}
                          </h3>
                          <p className="mt-1 text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                            {f.desc}
                          </p>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* CTA — 편집 모드에서는 label + href 둘 다 편집 가능 */}
            <div className="mt-8">
              {isEditable ? (
                <EditableLink
                  blockKey={`${keyPrefix}.cta`}
                  fallback={{ label: ctaLabel, href: ctaHref, target: '_self' }}
                  value={pickLinkOrUndef(blocks, `${keyPrefix}.cta`)}
                  pagePath={pagePath}
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  {/* children 을 넘기면 label 대신 이 내용이 렌더됨 → 아이콘까지 포함해서 직접 구성 */}
                  <span>
                    {pickLinkOrUndef(blocks, `${keyPrefix}.cta`)?.label ?? ctaLabel}
                  </span>
                  <Icon icon="solar:arrow-right-linear" className="ml-1 w-5 h-5" />
                </EditableLink>
              ) : (
                <Link
                  href={ctaHref}
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  {ctaLabel}
                  <Icon icon="solar:arrow-right-linear" className="ml-1 w-5 h-5" />
                </Link>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

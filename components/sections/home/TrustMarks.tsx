'use client'

// ─────────────────────────────────────────────
// 신뢰마크 바 (페이히어 "파트너사/인증 스트립" 벤치마크)
//  - 통신사·제조사·인증 로고 6~8개를 grayscale로 나열
//  - MediaSlot usage="logo" + vendor="wooripen"로 플레이스홀더
//  - 데스크탑: 한 줄 가로 배열 / 모바일: 2열 그리드
// ─────────────────────────────────────────────

import FadeIn from '@/components/ui/FadeIn'
import MediaSlot from '@/components/ui/MediaSlot'
import { EditableText } from '@/components/editable/EditableText'
import { useBlocks } from '@/components/editable/BlocksProvider'
import { pickTextOrUndef, pickImageOrUndef } from '@/lib/content-blocks'

interface TrustMark {
  subject: string     // media key suffix
  label: string       // 사용자에게 보일 설명
  icon: string
}

const MARKS: TrustMark[] = [
  { subject: 'logo-skt', label: 'SKT 공식 파트너', icon: 'solar:signal-bold-duotone' },
  { subject: 'logo-kt', label: 'KT 공식 파트너', icon: 'solar:signal-bold-duotone' },
  { subject: 'logo-lgu', label: 'LG U+ 공식 파트너', icon: 'solar:signal-bold-duotone' },
  { subject: 'logo-tossplace', label: '토스플레이스 파트너', icon: 'solar:card-recive-bold-duotone' },
  { subject: 'logo-torder', label: '티오더 파트너', icon: 'solar:tablet-bold-duotone' },
  { subject: 'logo-sbiz', label: '소상공인연합회 파트너', icon: 'solar:shield-check-bold-duotone' },
  { subject: 'logo-pg', label: '금융감독원 등록 PG', icon: 'solar:shield-star-bold-duotone' },
  { subject: 'logo-iso', label: 'ISO 27001 정보보호', icon: 'solar:verified-check-bold-duotone' },
]

export default function TrustMarks() {
  // BlocksProvider 로 주입된 홈 페이지 블록 맵 — Context 한 줄로 접근
  const blocks = useBlocks()

  return (
    <section className="py-10 md:py-14 bg-gray-50 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeIn>
          <EditableText
            blockKey="home.trustmarks.title"
            as="p"
            value={pickTextOrUndef(blocks, 'home.trustmarks.title')}
            fallback="전국 사장님이 안심할 수 있는 이유 — 공식 파트너 & 인증"
            pagePath="/"
            className="text-center text-xs md:text-sm font-semibold text-gray-500 tracking-wide mb-6 md:mb-8 break-keep"
          />
        </FadeIn>

        <FadeIn delay={60}>
          {/* 로고 8개: 모바일 2열·태블릿 4열·데스크톱 4열(2줄) — 너무 좁아지지 않게 4열 최대 */}
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 items-center">
            {MARKS.map((m) => {
              // subject 에서 'logo-' 접두어 제거한 키 (home.trustmarks.skt.logo 형태)
              const partnerKey = m.subject.replace(/^logo-/, '')
              const blockKey = `home.trustmarks.${partnerKey}.logo`
              return (
                <li
                  key={m.subject}
                  className="group relative grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                  title={m.label}
                >
                  <MediaSlot
                    blockKey={blockKey}
                    value={pickImageOrUndef(blocks, blockKey)}
                    pagePath="/"
                    vendor="wooripen"
                    usage="logo"
                    subject={m.subject}
                    number="01"
                    aspect="3/2"
                    label={m.label}
                    hint="로고 PNG · 배경 투명"
                    icon={m.icon}
                    fit="contain"
                    sizes="(max-width: 768px) 40vw, (max-width: 1280px) 20vw, 150px"
                    className="bg-white rounded-xl border border-gray-100"
                  />
                </li>
              )
            })}
          </ul>
        </FadeIn>
      </div>
    </section>
  )
}

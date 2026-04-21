'use client'

// ─────────────────────────────────────────────
// MediaSlot — 이미지 슬롯 컴포넌트
//
// 1) lib/media-manifest.json 에 해당 파일이 등록되어 있으면 → next/image 렌더
// 2) 아직 업로드 안 됐으면 → "어떤 이미지가 들어갈 자리인지" 표시하는
//    블루 그라디언트 플레이스홀더 (페이히어 톤)
//
// 사용 예:
//   <MediaSlot
//     vendor="wooripen"
//     usage="scene"
//     subject="hero-cafe"
//     number="01"
//     aspect="16/9"
//     label="히어로 슬라이드 1 — 카페 창업"
//     hint="매장 실사 / 1920x1080+"
//     priority
//   />
// ─────────────────────────────────────────────

import Image from 'next/image'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils/cn'
import { makeMediaKey, resolveMedia } from '@/lib/media'

type MediaUsage = 'logo' | 'product' | 'scene' | 'case' | 'docs'

interface MediaSlotProps {
  /** 벤더 코드 (wooripen / tossplace / torder 등) */
  vendor: string
  /** 용도 — 5개 중 하나 */
  usage: MediaUsage
  /** 주제 (영소문자+하이픈) */
  subject: string
  /** 번호 — 숫자(자동 2자리 패딩) 또는 "01" 같은 문자열 */
  number: string | number
  /** 비율 — "16/9" | "4/3" | "1/1" | "3/4" 등 CSS aspect-ratio 문자열 */
  aspect?: string
  /** 대체 텍스트 / 플레이스홀더 상단 라벨 */
  label: string
  /** 플레이스홀더 하단 힌트 (권장 사이즈 등) */
  hint?: string
  /** 이미지 로딩 우선순위 (히어로용) */
  priority?: boolean
  /** next/image sizes 속성 */
  sizes?: string
  /** 부모에 채울지 여부 (default: true) */
  fill?: boolean
  /** 이미지 object-fit */
  fit?: 'cover' | 'contain'
  /** 아이콘 오버라이드 (플레이스홀더에 표시될 아이콘) */
  icon?: string
  /** 추가 className (컨테이너) */
  className?: string
  /** 이미지 자체에 적용할 className */
  imgClassName?: string
  /** 플레이스홀더 테마 (light: 흰 배경용, dark: 어두운 배경용) */
  theme?: 'light' | 'dark'
}

/**
 * 이미지 슬롯.
 * 매니페스트에 등록돼 있으면 실제 이미지, 아니면 "채울 자리" 플레이스홀더.
 */
export default function MediaSlot({
  vendor,
  usage,
  subject,
  number,
  aspect = '16/9',
  label,
  hint,
  priority = false,
  sizes,
  fill = true,
  fit = 'cover',
  icon,
  className,
  imgClassName,
  theme = 'light',
}: MediaSlotProps) {
  const key = makeMediaKey(vendor, usage, subject, number)
  const media = resolveMedia(key)

  // 용도별 기본 아이콘
  const defaultIcon = icon ?? getDefaultIcon(usage)

  // 번호 2자리로 정규화
  const normalizedNumber =
    typeof number === 'number' ? String(number).padStart(2, '0') : number
  const expectedFilename = `${vendor}-${usage}-${subject}-${normalizedNumber}`

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        !fill && 'inline-block',
        className,
      )}
      style={{ aspectRatio: aspect }}
      data-media-key={key}
    >
      {media ? (
        // ── 실제 이미지 렌더 ────────────────────
        <Image
          src={media.webp_available && media.webp_url ? media.webp_url : media.public_url}
          alt={label}
          fill={fill}
          sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'}
          priority={priority}
          className={cn(
            fit === 'cover' ? 'object-cover' : 'object-contain',
            imgClassName,
          )}
        />
      ) : (
        // ── 플레이스홀더 (페이히어 톤 블루 그라디언트) ──
        <Placeholder
          label={label}
          hint={hint}
          icon={defaultIcon}
          filename={expectedFilename}
          theme={theme}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 플레이스홀더 내부 구현
// ─────────────────────────────────────────────

interface PlaceholderProps {
  label: string
  hint?: string
  icon: string
  filename: string
  theme: 'light' | 'dark'
}

function Placeholder({ label, hint, icon, filename, theme }: PlaceholderProps) {
  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center',
        'text-center px-4 py-6 overflow-hidden',
        // 블루 그라디언트 배경 (페이히어 톤, 우리편 primary #3182F6 기반)
        isDark
          ? 'bg-gradient-to-br from-[#1B4FD1] via-[#2663EA] to-[#3182F6]'
          : 'bg-gradient-to-br from-primary-50 via-primary-100 to-white',
      )}
      aria-label={`이미지 예정: ${label}`}
    >
      {/* 배경 장식 — 은은한 도트/글로우 */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          isDark ? 'opacity-[0.12]' : 'opacity-[0.25]',
        )}
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)'
            : 'radial-gradient(circle at 20% 30%, #3182F6 1px, transparent 1px), radial-gradient(circle at 70% 80%, #3182F6 1px, transparent 1px)',
          backgroundSize: '40px 40px, 60px 60px',
        }}
      />

      {/* 아이콘 */}
      <div
        className={cn(
          'relative w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3',
          isDark
            ? 'bg-white/15 backdrop-blur-sm'
            : 'bg-primary/10',
        )}
      >
        <Icon
          icon={icon}
          className={cn(
            'w-6 h-6 md:w-8 md:h-8',
            isDark ? 'text-white' : 'text-primary',
          )}
        />
      </div>

      {/* 라벨 */}
      <div
        className={cn(
          'relative font-semibold text-sm md:text-base leading-tight line-clamp-2',
          isDark ? 'text-white' : 'text-primary-700',
        )}
      >
        {label}
      </div>

      {/* 힌트 */}
      {hint && (
        <div
          className={cn(
            'relative text-xs md:text-sm mt-1.5 leading-tight line-clamp-2',
            isDark ? 'text-white/70' : 'text-gray-500',
          )}
        >
          {hint}
        </div>
      )}

      {/* 파일명 힌트 (배포 환경에선 숨김, 개발 환경에서만 노출) */}
      {process.env.NODE_ENV !== 'production' && (
        <div
          className={cn(
            'relative mt-3 px-2 py-0.5 rounded text-[10px] md:text-xs font-mono',
            isDark
              ? 'bg-white/10 text-white/60'
              : 'bg-white/60 text-primary-600/70',
          )}
        >
          {filename}
        </div>
      )}
    </div>
  )
}

// 용도별 기본 아이콘 (Solar icon set)
function getDefaultIcon(usage: MediaUsage): string {
  switch (usage) {
    case 'logo':
      return 'solar:star-bold-duotone'
    case 'product':
      return 'solar:box-bold-duotone'
    case 'scene':
      return 'solar:gallery-wide-bold-duotone'
    case 'case':
      return 'solar:shop-bold-duotone'
    case 'docs':
      return 'solar:document-bold-duotone'
    default:
      return 'solar:gallery-wide-bold-duotone'
  }
}

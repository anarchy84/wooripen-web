// ─────────────────────────────────────────────
// 인라인 편집 — hover 시 뜨는 편집 버튼 오버레이
//
// 역할 :
//   - admin 에게만 보이는 ✏️ 버튼
//   - 래퍼(EditableText/Image/Link) children 위에 absolute 로 겹침
//   - 클릭하면 EditorProvider 의 openEditor 호출
//
// 스타일 :
//   - 보통 상태에선 투명, hover/focus 시 나타남
//   - 우측 상단에 작게 표시 (컨텐츠 가리지 않게)
//   - 브랜드 primary 컬러 배지
//
// 접근성 :
//   - role="button" + aria-label
//   - 키보드 포커스로도 열 수 있게 tabIndex
// ─────────────────────────────────────────────

'use client'

import React from 'react'
import { useAdminGuard } from '@/hooks/useAdminGuard'
import { useEditor, type EditSession } from './EditorProvider'

interface EditOverlayProps {
  /** 편집 모달에 전달할 세션 정보 */
  session: EditSession
  /** 래퍼 내부 컨텐츠 — 자식을 감싸는 구조 */
  children: React.ReactNode
  /** 오버레이 위치 조정 (기본 top-right) — 긴 블록일 때 유용 */
  position?: 'top-right' | 'top-left'
  /** 추가 CSS class (래퍼 자체 스타일링 상속 용도) */
  className?: string
  /** 감싸는 태그 — 블록 레이아웃 보존 위해 div/span 전환 필요 */
  as?: 'div' | 'span'
  /** 인라인 스타일 (예: aspectRatio) — MediaSlot 처럼 비율 보장이 필요한 곳용 */
  style?: React.CSSProperties
}

export function EditOverlay({
  session,
  children,
  position = 'top-right',
  className = '',
  as: Wrapper = 'div',
  style,
}: EditOverlayProps) {
  const { isAdmin } = useAdminGuard()
  const { openEditor } = useEditor()

  // admin 아니면 오버레이는 생략하되, 비율·레이아웃(style/className)은 유지해야
  // 함. style 없이 바로 children 을 반환하면 MediaSlot 의 aspect-ratio 가 사라져
  // 이미지가 수직으로 찌그러짐.
  if (!isAdmin) {
    if (!style && !className) return <>{children}</>
    return (
      <Wrapper
        className={className}
        style={style}
      >
        {children}
      </Wrapper>
    )
  }

  const posClass =
    position === 'top-right'
      ? 'top-1 right-1'
      : 'top-1 left-1'

  // wrapper 의 display 는 감싸는 태그에 맞춰 자동 분기
  //   - span 래퍼 → inline-block (텍스트 흐름 유지)
  //   - div 래퍼  → block      (h1/h2/p 의 mt·mx·max-w 유지)
  // 이렇게 해야 block 요소를 래핑해도 가운데정렬·여백이 깨지지 않음
  const displayClass = Wrapper === 'span' ? 'inline-block' : 'block'

  // ⚠️ position 충돌 방지 (2026-08-04)
  //   편집 버튼을 붙이려면 래퍼가 positioned 여야 해서 'relative' 를 넣어왔는데,
  //   호출부가 이미 absolute/fixed/sticky 를 넘긴 경우 두 유틸리티가 함께 붙었다.
  //   Tailwind 는 클래스 나열 순서가 아니라 CSS 선언 순서로 승자가 정해지고
  //   .relative 가 .absolute 보다 뒤에 있어 relative 가 이긴다.
  //   → 히어로 배경처럼 'absolute inset-0' 로 꽉 채우려던 래퍼가 일반 흐름으로
  //     돌아가 높이 0 으로 collapse, 자식 img(h-full)도 0 이 되어 안 보였다.
  //     (비어드민 경로는 relative 를 안 붙이므로 방문자 화면은 정상이었고,
  //      어드민 화면에서만 이미지가 사라져 '저장은 되는데 안 보인다' 로 보였다)
  //   호출부가 position 을 지정했으면 그쪽을 존중한다. absolute 래퍼도 그 자체로
  //   positioned 라 편집 버튼 위치 계산에는 문제가 없다.
  const hasPositionClass = /(^|\s)(absolute|fixed|sticky|relative)(\s|$)/.test(className)
  const positionClass = hasPositionClass ? '' : 'relative'

  return (
    <Wrapper
      className={`group ${positionClass} ${displayClass} ${className}`}
      style={style}
    >
      {children}

      {/* ✏️ 편집 버튼 — hover/focus 시 노출 */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openEditor(session)
        }}
        aria-label={`${session.blockKey} 편집`}
        className={`
          absolute ${posClass} z-20
          opacity-0 group-hover:opacity-100 focus:opacity-100
          transition-opacity duration-150
          bg-[#1A1A2E] text-white text-xs
          rounded-md shadow-md
          px-2 py-1
          flex items-center gap-1
          hover:bg-[#E94560]
        `}
      >
        <span aria-hidden="true">✏️</span>
        <span className="hidden sm:inline">편집</span>
      </button>

      {/* 점선 outline — 편집 가능 영역 힌트 (hover 시) */}
      <span
        aria-hidden="true"
        className="
          absolute inset-0 z-10 pointer-events-none
          outline-dashed outline-1 outline-transparent
          group-hover:outline-[#E94560]/60
          rounded-sm
          transition-[outline-color] duration-150
        "
      />
    </Wrapper>
  )
}

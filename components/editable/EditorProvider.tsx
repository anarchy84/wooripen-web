// ─────────────────────────────────────────────
// 인라인 편집 — 전역 편집 상태 컨텍스트
//
// 역할 :
//   - "지금 어떤 블록을 편집 중인가"를 전역으로 관리
//   - EditableText/Image/Link 가 ✏️ 눌렀을 때 이 컨텍스트에 "편집 요청" 띄움
//   - <EditorModal /> 은 이 컨텍스트를 구독해서 단일 모달을 렌더링
//
// 왜 전역인가 :
//   - 모달은 페이지당 1개만 뜸 (동시 편집 방지)
//   - 여러 래퍼가 각자 모달 갖고 있으면 z-index 난장판
//   - 저장 후 router.refresh() 도 여기서 1회만 실행
//
// 사용 :
//   app/layout.tsx 에서 <EditorProvider><body>...</body></EditorProvider>
//
// 주의 :
//   - 비로그인 사용자에게도 렌더링은 되지만, 모달 자체는 admin 만 열 수 있음
//     (EditableX 래퍼에서 useAdminGuard 로 가드)
// ─────────────────────────────────────────────

'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { BlockValue } from '@/lib/content-blocks'

// -------------------------------------------------------------
// 편집 세션 타입
// -------------------------------------------------------------
export type BlockType = 'text' | 'image' | 'link'

export interface EditSession {
  blockKey:     string
  blockType:    BlockType
  /** 현재 렌더되는 값 (fallback 포함) — before 비교용 */
  currentValue: BlockValue
  /** SEO 보호용 태그 (예: 'h1') — UI 에선 readonly 로 표시 */
  semanticTag?: string | null
  /** 저장 후 revalidate 대상 경로 */
  pagePath?:    string | null
}

interface EditorContextValue {
  /** 편집 중인 세션 (없으면 null) */
  session: EditSession | null
  /** 래퍼가 ✏️ 눌렀을 때 호출 */
  openEditor: (s: EditSession) => void
  /** 모달 닫기 (저장이든 취소든) */
  closeEditor: () => void
}

const EditorContext = createContext<EditorContextValue | null>(null)

// -------------------------------------------------------------
// Provider
// -------------------------------------------------------------
export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<EditSession | null>(null)

  const openEditor = useCallback((s: EditSession) => {
    setSession(s)
  }, [])

  const closeEditor = useCallback(() => {
    setSession(null)
  }, [])

  const value = useMemo<EditorContextValue>(
    () => ({ session, openEditor, closeEditor }),
    [session, openEditor, closeEditor]
  )

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

// -------------------------------------------------------------
// Hook
// -------------------------------------------------------------
export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext)
  if (!ctx) {
    // Provider 없이 사용돼도 래퍼가 깨지지 않게 no-op fallback 제공
    // (관리자 아닌 일반 방문자 페이지는 EditorProvider 미주입 가능)
    return {
      session: null,
      openEditor: () => {},
      closeEditor: () => {},
    }
  }
  return ctx
}

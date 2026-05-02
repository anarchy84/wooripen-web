// ─────────────────────────────────────────────
// 어드민 다크/라이트 테마 컨텍스트
//
// 사용법 :
//   1) admin 레이아웃 root 를 <ThemeProvider> 로 감싼다
//   2) <ThemeToggle /> 컴포넌트로 토글 UI 노출
//   3) Tailwind dark:* 변형이 root .dark class 따라 자동 활성
//
// 저장 :
//   - localStorage('admin-theme') 에 'dark' | 'light' 보관
//   - 첫 방문 시 시스템 prefers-color-scheme 으로 초기화
//
// 다른 프로젝트(ozlab/네이버커넥트) 이식 시 :
//   이 파일 + ThemeToggle.tsx 만 복사하면 됨. 의존성 없음.
// ─────────────────────────────────────────────
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

const STORAGE_KEY = 'admin-theme'
const DEFAULT_THEME: Theme = 'dark'

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  toggle: () => {},
  setTheme: () => {},
})

export function useAdminTheme() {
  return useContext(ThemeContext)
}

interface ProviderProps {
  children: ReactNode
  /** 첫 마운트 시 'class'를 부여할 root element. 기본은 <html>. */
  rootElement?: 'html' | 'body' | 'self'
  /** 외부 컴포넌트가 default를 'dark'/'light' 중 강제하고 싶을 때 */
  defaultTheme?: Theme
}

export function AdminThemeProvider({
  children,
  rootElement = 'html',
  defaultTheme = DEFAULT_THEME,
}: ProviderProps) {
  // SSR 시점에서는 default — hydration 시 localStorage 로 보정
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [hydrated, setHydrated] = useState(false)

  // 1) 첫 mount : localStorage > prefers-color-scheme > defaultTheme
  useEffect(() => {
    let initial: Theme = defaultTheme
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') {
        initial = stored
      } else if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
        initial = 'light'
      }
    } catch {
      /* 시크릿 모드 등 storage 차단 → default */
    }
    setThemeState(initial)
    setHydrated(true)
  }, [defaultTheme])

  // 2) theme 변경 시 root 에 class 부여 + storage 저장
  useEffect(() => {
    if (!hydrated) return
    const target =
      rootElement === 'html'
        ? document.documentElement
        : rootElement === 'body'
        ? document.body
        : null
    if (target) {
      target.classList.toggle('dark', theme === 'dark')
      target.classList.toggle('light', theme === 'light')
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme, hydrated, rootElement])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggle = useCallback(
    () => setThemeState((p) => (p === 'dark' ? 'light' : 'dark')),
    []
  )

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

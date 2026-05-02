// ─────────────────────────────────────────────
// 어드민 다크/라이트 모드 토글 버튼
// 해/달 아이콘 — 클릭 시 모드 전환
// ─────────────────────────────────────────────
'use client'

import { useAdminTheme } from './ThemeProvider'

export function AdminThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useAdminTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className={
        // 기본 스타일 — 다크 / 라이트 모두 어울리게
        'inline-flex items-center justify-center w-9 h-9 rounded-lg ' +
        'text-gray-400 hover:text-white hover:bg-gray-800 ' +
        'dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 ' +
        'transition-colors ' +
        className
      }
    >
      {isDark ? (
        // 라이트로 전환 — 해 아이콘
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // 다크로 전환 — 달 아이콘
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import type { NavMenu } from '@/types/database'

// 트리 구조 — 하위 children 포함
interface NavNode extends NavMenu {
  children?: NavMenu[]
}

// fetch 실패 시 기본 메뉴 (네트워크 오류/DB 다운 시 fallback)
const FALLBACK_NAV: NavNode[] = [
  { id: 'fb-1', parent_id: null, label: '인터넷', url: '/internet', is_external: false, is_visible: true, sort_order: 0, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
  { id: 'fb-2', parent_id: null, label: '단말기', url: '/business/terminal', is_external: false, is_visible: true, sort_order: 1, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
  { id: 'fb-3', parent_id: null, label: 'CCTV', url: '/business/cctv', is_external: false, is_visible: true, sort_order: 2, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
  { id: 'fb-4', parent_id: null, label: '키오스크', url: '/business/torder', is_external: false, is_visible: true, sort_order: 3, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
  { id: 'fb-5', parent_id: null, label: '렌탈', url: '/rental', is_external: false, is_visible: true, sort_order: 4, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
  { id: 'fb-6', parent_id: null, label: '맞춤추천', url: '/recommend', is_external: false, is_visible: true, sort_order: 5, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
  { id: 'fb-7', parent_id: null, label: '꿀팁', url: '/tips', is_external: false, is_visible: true, sort_order: 6, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
  { id: 'fb-8', parent_id: null, label: 'Q&A', url: '/qna', is_external: false, is_visible: true, sort_order: 7, icon: null, badge_label: null, badge_color: null, updated_at: '', children: [] },
]

// 뱃지 색상 맵핑 (Tailwind JIT가 동적 class를 못 잡으므로 safelist처럼 고정)
const BADGE_BG: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [nav, setNav] = useState<NavNode[]>(FALLBACK_NAV)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // 스크롤 상태
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GNB 동적 로드 — nav_menus 테이블 기반
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/nav-menus', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setNav(data as NavNode[])
        }
      } catch {
        // fallback 유지
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // 링크 렌더링 — 외부 링크면 새 창
  const renderLink = (item: NavMenu, extraClass = '', onClick?: () => void) => {
    const targetProps = item.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    const badge = item.badge_label ? (
      <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded text-white ${BADGE_BG[item.badge_color || 'red'] || 'bg-red-500'}`}>
        {item.badge_label}
      </span>
    ) : null

    return (
      <Link
        key={item.id}
        href={item.url}
        onClick={onClick}
        {...targetProps}
        className={extraClass}
      >
        {item.label}
        {badge}
      </Link>
    )
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-toss
        ${scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-soft'
          : 'bg-transparent'
        }
      `}
    >
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="relative z-10">
            <span className={`
              text-xl font-bold tracking-tight transition-colors duration-300
              ${scrolled ? 'text-gray-900' : 'text-white'}
            `}>
              우리편
            </span>
          </Link>

          {/* 데스크톱 네비 — 하위 메뉴 있으면 hover 드롭다운 */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((root) => {
              const hasChildren = root.children && root.children.length > 0
              const baseClass = `
                px-4 py-2 rounded-full text-caption font-medium inline-flex items-center
                transition-all duration-200 ease-toss
                ${scrolled
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `

              if (!hasChildren) {
                return renderLink(root, baseClass)
              }

              // 드롭다운 컨테이너 — hover 시 children 표시
              return (
                <div
                  key={root.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(root.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {renderLink(root, baseClass)}
                  <ChevronDown className={`inline w-3 h-3 ml-0.5 -translate-y-1 transition-transform ${openDropdown === root.id ? 'rotate-180' : ''} ${scrolled ? 'text-gray-600' : 'text-white/70'}`} />
                  {openDropdown === root.id && (
                    <div className="absolute top-full left-0 pt-1 min-w-[200px]">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                        {root.children!.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            {...(child.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <span>{child.label}</span>
                            {child.badge_label && (
                              <span className={`text-[9px] px-1 py-0.5 rounded text-white ${BADGE_BG[child.badge_color || 'red'] || 'bg-red-500'}`}>
                                {child.badge_label}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/recommend"
              className={`
                rounded-full px-5 py-2 text-caption font-semibold
                transition-all duration-300 ease-toss
                ${scrolled
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              무료 상담
            </Link>
          </div>

          {/* 모바일 토글 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`
              lg:hidden relative z-10 p-2 rounded-full
              transition-colors duration-200
              ${mobileOpen
                ? 'text-gray-900'
                : scrolled ? 'text-gray-700' : 'text-white'
              }
            `}
            aria-label="메뉴"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 풀스크린 메뉴 */}
      <div
        className={`
          fixed inset-0 bg-white z-40 overflow-y-auto
          transition-all duration-300 ease-toss
          lg:hidden
          ${mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        <nav className="flex flex-col items-start justify-start pt-24 pb-12 px-8 gap-1">
          {nav.map((root) => (
            <div key={root.id} className="w-full">
              <Link
                href={root.url}
                onClick={() => setMobileOpen(false)}
                {...(root.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center text-2xl font-bold text-gray-900 hover:text-primary transition-colors py-2"
              >
                {root.label}
                {root.badge_label && (
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded text-white ${BADGE_BG[root.badge_color || 'red'] || 'bg-red-500'}`}>
                    {root.badge_label}
                  </span>
                )}
              </Link>
              {root.children && root.children.length > 0 && (
                <div className="pl-4 space-y-1 mb-2">
                  {root.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      onClick={() => setMobileOpen(false)}
                      {...(child.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block text-sm text-gray-500 hover:text-gray-900 py-1"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-8 pt-8 border-t border-gray-100 w-full">
            <Link
              href="/recommend"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full text-center"
            >
              무료 상담 신청하기
            </Link>
            <a
              href="tel:1234-5678"
              className="mt-3 block text-center text-body-2 text-gray-500"
            >
              전화 상담 1234-5678
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: '인터넷', href: '/internet' },
  { name: '단말기', href: '/business/terminal' },
  { name: 'CCTV', href: '/business/cctv' },
  { name: '키오스크', href: '/business/torder' },
  { name: '렌탈', href: '/rental' },
  { name: '맞춤추천', href: '/recommend' },
  { name: '꿀팁', href: '/tips' },
  { name: 'Q&A', href: '/qna' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

          {/* 데스크톱 네비 */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  px-4 py-2 rounded-full text-caption font-medium
                  transition-all duration-200 ease-toss
                  ${scrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
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
          fixed inset-0 bg-white z-40
          transition-all duration-300 ease-toss
          lg:hidden
          ${mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        <nav className="flex flex-col items-start justify-center h-full px-8 gap-2">
          {navigation.map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-display-3 font-bold text-gray-900 hover:text-primary transition-colors"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {item.name}
            </Link>
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

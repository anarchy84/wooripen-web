'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'

const navigation = [
  { name: '인터넷 가입', href: '/internet' },
  { name: '사업자 상품', href: '/business' },
  { name: '렌탈·가전', href: '/rental' },
  { name: '사업자 최대혜택', href: '/recommend' },
  { name: '꿀팁', href: '/tips' },
  { name: 'FAQ', href: '/faq' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">우리편</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA 버튼 */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:1234-5678"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              <Phone className="h-4 w-4" />
              1234-5678
            </a>
            <Link href="/business/terminal" className="btn-primary text-sm py-2 px-4">
              무료 상담 신청
            </Link>
          </div>

          {/* 모바일 메뉴 토글 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-700"
            aria-label="메뉴 열기"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 모바일 네비게이션 */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-gray-100 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 px-3">
              <Link
                href="/business/terminal"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center text-sm py-2.5"
              >
                무료 상담 신청
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

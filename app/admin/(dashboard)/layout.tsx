'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const navItems = [
  { name: '대시보드', href: '/admin', icon: '📊' },
  { name: '상품 관리', href: '/admin/products', icon: '📦' },
  { name: '꿀팁 관리', href: '/admin/tips', icon: '📝' },
  { name: '상담 신청', href: '/admin/consultations', icon: '📞' },
  { name: '미디어', href: '/admin/media', icon: '🖼️' },
  { name: 'SEO 관리', href: '/admin/seo', icon: '🔍' },
  { name: '스크립트', href: '/admin/scripts', icon: '⚙️' },
  { name: '사이트 설정', href: '/admin/settings', icon: '🛠️' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 로고 */}
        <div className="h-14 flex items-center px-4 border-b border-gray-800">
          <Link href="/admin" className="text-lg font-bold text-white">
            우리편 <span className="text-blue-400 text-sm font-normal">Admin</span>
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 하단 */}
        <div className="p-3 border-t border-gray-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ↗ 사이트 보기
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
          >
            🚪 로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 모바일 헤더 */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-800 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-white">우리편 Admin</span>
          <div className="w-6" />
        </header>

        {/* 콘텐츠 */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

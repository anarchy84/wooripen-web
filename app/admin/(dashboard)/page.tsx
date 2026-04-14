'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Stats {
  products: number
  tips: number
  consultations: number
  pendingConsultations: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, tips: 0, consultations: 0, pendingConsultations: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [productsRes, tipsRes, consultationsRes, pendingRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('tips').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('consultations').select('id', { count: 'exact', head: true }),
        supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      setStats({
        products: productsRes.count || 0,
        tips: tipsRes.count || 0,
        consultations: consultationsRes.count || 0,
        pendingConsultations: pendingRes.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const cards = [
    { label: '활성 상품', value: stats.products, href: '/admin/products', color: 'blue' },
    { label: '발행된 글', value: stats.tips, href: '/admin/tips', color: 'emerald' },
    { label: '전체 상담', value: stats.consultations, href: '/admin/consultations', color: 'violet' },
    { label: '대기 중 상담', value: stats.pendingConsultations, href: '/admin/consultations', color: 'amber' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">대시보드</h1>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? '—' : card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* 빠른 링크 */}
      <h2 className="text-lg font-semibold text-white mb-4">빠른 작업</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: '새 상품 등록', href: '/admin/products?new=1', desc: '상품 추가하기' },
          { label: '새 꿀팁 작성', href: '/admin/tips?new=1', desc: '블로그 글 작성' },
          { label: 'SEO 메타태그', href: '/admin/seo', desc: '페이지별 SEO 설정' },
          { label: '스크립트 관리', href: '/admin/scripts', desc: 'GTM 등 코드 삽입' },
          { label: '미디어 관리', href: '/admin/media', desc: '이미지 업로드/관리' },
          { label: '사이트 보기 ↗', href: '/', desc: '프론트엔드 확인' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target={item.href === '/' ? '_blank' : undefined}
            className="flex flex-col bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <span className="text-sm font-medium text-white">{item.label}</span>
            <span className="text-xs text-gray-500 mt-0.5">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

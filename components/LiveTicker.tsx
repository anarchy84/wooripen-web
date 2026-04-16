'use client'

// 실시간 상담 신청 롤링 티커
// CTA 옆에 배치해서 사회적 증거(Social Proof) 효과 극대화
// 3초 간격으로 최근 상담 신청 1건씩 롤링

import { useEffect, useState } from 'react'

interface TickerItem {
  id: string
  masked_name: string
  masked_phone: string
  product_category: string
  status: string
  created_at: string
}

// 상태별 한국어 라벨 + 색상
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '접수됨', color: 'text-blue-400' },
  contacted: { label: '상담중', color: 'text-amber-400' },
  in_progress: { label: '진행중', color: 'text-emerald-400' },
  completed: { label: '완료', color: 'text-gray-400' },
}

// 시간 차이를 "n분 전", "n시간 전" 형식으로
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

interface LiveTickerProps {
  className?: string
  /** 다크 테마 배경 위에서 사용할 때 true */
  dark?: boolean
}

export default function LiveTicker({ className = '', dark = true }: LiveTickerProps) {
  const [items, setItems] = useState<TickerItem[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // 데이터 로드
  useEffect(() => {
    fetch('/api/consultations/recent')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch(() => {})
  }, [])

  // 3초 간격 롤링
  useEffect(() => {
    if (items.length === 0) return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % items.length)
        setVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [items.length])

  if (items.length === 0) return null

  const item = items[currentIdx]
  const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.pending

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm
        transition-all duration-300
        ${dark
          ? 'bg-white/[0.08] border border-white/[0.1] backdrop-blur-sm'
          : 'bg-gray-100 border border-gray-200'
        }
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        ${className}
      `}
    >
      {/* 빨간 점 (라이브 표시) */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>

      {/* 정보 */}
      <span className={dark ? 'text-white/70' : 'text-gray-600'}>
        <span className={dark ? 'text-white font-medium' : 'text-gray-900 font-medium'}>
          {item.masked_name}
        </span>
        님 · {item.product_category} · <span className={statusInfo.color}>{statusInfo.label}</span>
      </span>

      {/* 시간 */}
      <span className={dark ? 'text-white/40 text-xs' : 'text-gray-400 text-xs'}>
        {timeAgo(item.created_at)}
      </span>
    </div>
  )
}

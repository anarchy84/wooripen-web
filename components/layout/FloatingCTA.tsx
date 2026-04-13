'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, X } from 'lucide-react'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        flex flex-col items-end gap-3
        transition-all duration-500 ease-toss
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      {/* 펼쳐지는 액션 버튼들 */}
      <div className={`
        flex flex-col gap-2
        transition-all duration-300 ease-toss
        ${expanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
      `}>
        {/* 카카오톡 */}
        <a
          href="https://pf.kakao.com/_우리편"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-full
                     bg-[#FEE500] text-gray-900 shadow-card
                     hover:shadow-card-hover hover:scale-105
                     transition-all duration-300 ease-toss"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-caption font-semibold">카카오톡 상담</span>
        </a>

        {/* 전화 */}
        <a
          href="tel:1234-5678"
          className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-full
                     bg-white text-gray-900 shadow-card border border-gray-100
                     hover:shadow-card-hover hover:scale-105
                     transition-all duration-300 ease-toss"
        >
          <Phone className="h-4 w-4" />
          <span className="text-caption font-semibold">1234-5678</span>
        </a>
      </div>

      {/* 메인 FAB */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          w-14 h-14 rounded-full shadow-elevated
          flex items-center justify-center
          transition-all duration-300 ease-toss
          ${expanded
            ? 'bg-gray-900 hover:bg-gray-800 rotate-0'
            : 'bg-primary hover:bg-primary-600 rotate-0'
          }
        `}
        aria-label="상담하기"
      >
        {expanded
          ? <X className="h-5 w-5 text-white" />
          : <MessageCircle className="h-5 w-5 text-white" />
        }
      </button>
    </div>
  )
}

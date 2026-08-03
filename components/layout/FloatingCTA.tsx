'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, X } from 'lucide-react'

// 카카오 채널 URL 정규화 —
//   어드민이 '@우리편', 'ourteam', 'https://pf.kakao.com/_abcXYZ' 등 어떻게 넣어도 받아준다.
//   단 채널 ID 는 카카오 규격상 영숫자(_ 포함)만 유효하므로, 한글 등이 섞이면 null 을 반환해
//   죽은 링크 대신 버튼을 숨긴다. (기존 하드코딩 '_우리편' 이 실제 404 였던 사례)
function normalizeKakaoUrl(raw: string | null | undefined): string | null {
  const v = (raw ?? '').trim()
  if (!v) return null
  if (/^https?:\/\//i.test(v)) {
    return /^https:\/\/pf\.kakao\.com\/_[A-Za-z0-9_]+/.test(v) ? v : null
  }
  const id = v.replace(/^@/, '').replace(/^_/, '')
  if (!/^[A-Za-z0-9_]+$/.test(id)) return null
  return `https://pf.kakao.com/_${id}`
}

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [kakaoUrl, setKakaoUrl] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 카톡 채널 URL — 어드민 > 사이트 설정(kakao_channel)에서 관리.
  // 배포 없이 채널 주소를 교체할 수 있게 하고, 미설정이면 버튼 자체를 숨긴다.
  useEffect(() => {
    let cancelled = false
    fetch('/api/site-settings?key=kakao_channel')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setKakaoUrl(normalizeKakaoUrl(d?.value))
      })
      .catch(() => { /* 실패 시 버튼 숨김 유지 */ })
    return () => { cancelled = true }
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
        {/* 카카오톡 — 채널 URL 미설정/형식오류면 렌더하지 않음 (죽은 링크 방지) */}
        {kakaoUrl && (
          <a
            href={kakaoUrl}
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
        )}

        {/* 전화 */}
        <a
          href="tel:1600-6116"
          className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-full
                     bg-white text-gray-900 shadow-card border border-gray-100
                     hover:shadow-card-hover hover:scale-105
                     transition-all duration-300 ease-toss"
        >
          <Phone className="h-4 w-4" />
          <span className="text-caption font-semibold">1600-6116</span>
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

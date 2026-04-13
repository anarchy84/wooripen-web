'use client'

import { Phone, MessageCircle } from 'lucide-react'

/**
 * 플로팅 CTA 버튼
 * - 카카오톡 플러스친구 (외부 링크)
 * - 전화 상담 바로가기
 * 모바일에서 특히 중요한 전환 요소
 */
export default function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* 카카오톡 플러스친구 */}
      <a
        href="https://pf.kakao.com/_우리편"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-14 h-14 bg-[#FEE500] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="카카오톡 상담"
        title="카카오톡으로 상담하기"
      >
        <MessageCircle className="h-6 w-6 text-[#3C1E1E]" />
      </a>

      {/* 전화 상담 */}
      <a
        href="tel:1234-5678"
        className="group flex items-center justify-center w-14 h-14 bg-accent rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="전화 상담"
        title="전화로 상담하기"
      >
        <Phone className="h-6 w-6 text-white" />
      </a>
    </div>
  )
}

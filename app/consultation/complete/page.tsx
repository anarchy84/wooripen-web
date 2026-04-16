// 상담 신청 완료 페이지
// /consultation/complete?id={uuid}&source={home|internet|rental|...}
// 1) 접수번호 표시  2) GTM 전환 이벤트 발화  3) sessionStorage dedupe

'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { fireLeadConversion } from '@/lib/gtm'

// ─── 접수번호 포맷 ─────────────────────────────────
function formatReceiptNo(createdAt: string | null): string {
  if (!createdAt) {
    const now = new Date()
    const d = now.toISOString().slice(0, 10).replace(/-/g, '')
    return `#${d}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`
  }
  const date = new Date(createdAt)
  const d = date.toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(date.getMinutes() * 60 + date.getSeconds()).padStart(4, '0')
  return `#${d}-${seq}`
}

// ─── 메인 콘텐츠 (useSearchParams 사용하므로 Suspense 필수) ──
function CompleteContent() {
  const searchParams = useSearchParams()
  const consultationId = searchParams.get('id') || ''
  const source = searchParams.get('source') || 'home'
  const createdAt = searchParams.get('created_at') || null
  const [phone, setPhone] = useState('1600-6116')
  const [fired, setFired] = useState(false)

  // 대표번호 동적 로드
  useEffect(() => {
    fetch('/api/site-settings?key=phone')
      .then((r) => r.json())
      .then((d) => { if (d.value) setPhone(d.value) })
      .catch(() => {})
  }, [])

  // GTM 전환 이벤트 (dedupe: 같은 id로 두 번 쏘지 않음)
  useEffect(() => {
    if (!consultationId || fired) return
    const dedupeKey = `lead_fired_${consultationId}`
    if (sessionStorage.getItem(dedupeKey)) return

    fireLeadConversion({
      consultation_id: consultationId,
      source,
    })
    sessionStorage.setItem(dedupeKey, '1')
    setFired(true)
  }, [consultationId, source, fired])

  const receiptNo = formatReceiptNo(createdAt)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center animate-fade-in">
        {/* 체크 아이콘 */}
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <Icon
            icon="solar:check-circle-bold"
            className="w-10 h-10 text-emerald-500"
          />
        </div>

        {/* 접수 확인 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          상담 신청이 접수됐습니다
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          접수번호 <span className="font-mono font-semibold text-gray-700">{receiptNo}</span>
        </p>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 rounded-2xl p-5 mb-6 text-left space-y-2">
          <p className="text-sm text-gray-700">
            영업일 기준 <strong>24시간 이내</strong>에 담당자가 직접 연락드립니다.
          </p>
          <p className="text-xs text-gray-500">
            (주말·공휴일 제외)
          </p>
        </div>

        {/* 급한 경우 전화 안내 */}
        <div className="bg-amber-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-700">
            💡 급하신 경우 대표번호로 바로 연락주세요.
          </p>
          <a
            href={`tel:${phone.replace(/-/g, '')}`}
            className="inline-block mt-2 text-lg font-bold text-amber-700 hover:text-amber-800"
          >
            ☎ {phone}
          </a>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-center"
          >
            홈으로
          </Link>
          <Link
            href="/tips"
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors text-center"
          >
            꿀팁 보러가기 →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── 페이지 (Suspense 경계) ──────────────────────────
export default function ConsultationCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  )
}

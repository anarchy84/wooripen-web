'use client'

// 상담 신청 공통 훅
// 7개 페이지 폼에서 공통으로 사용
// 폼 상태 관리 + API 호출 + 어트리뷰션 첨부 + 완료페이지 리다이렉트

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAttribution } from '@/lib/attribution'

interface ConsultationForm {
  name: string
  phone: string
  product_category: string      // 'internet' | 'terminal' | 'cctv' | 'kiosk' | 'rental' | 'package' | 'general'
  business_type?: string        // 업종 (선택)
  business_address?: string     // 매장명/주소 (선택)
  memo?: string                 // 비고 (선택)
  interested_products?: string[] // 관심 상품 배열
  privacy_consent?: boolean
  third_party_consent?: boolean
  marketing_consent?: boolean
}

interface UseConsultationReturn {
  submitting: boolean
  error: string | null
  submitConsultation: (form: ConsultationForm, source: string) => Promise<void>
}

export function useConsultation(): UseConsultationReturn {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitConsultation = async (form: ConsultationForm, source: string) => {
    setSubmitting(true)
    setError(null)

    try {
      // 어트리뷰션 데이터 가져오기
      const attr = getAttribution()

      // API 호출
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...attr,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '잠시 후 다시 시도해주세요.')
        setSubmitting(false)
        return
      }

      // 완료 페이지로 이동
      const params = new URLSearchParams({
        id: data.id,
        source,
        created_at: data.created_at || '',
      })
      router.push(`/consultation/complete?${params.toString()}`)
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return { submitting, error, submitConsultation }
}

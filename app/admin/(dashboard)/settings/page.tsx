'use client'

import { useEffect, useState, useCallback } from 'react'

interface SettingField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'tel'
  placeholder: string
  group: string
}

// ─────────────────────────────────────────────
// 사이트 설정 필드 (2026-08-04 정리)
//
// 정리 배경 :
//   - 어느 화면에서도 읽지 않는 데드 필드가 6개 있었다
//     (site_name, site_description, mobile, business_hours, privacy_url, terms_url)
//     → 입력해도 아무 데도 반영되지 않아 운영자가 혼란을 겪음. 전부 제거.
//   - 남은 필드의 placeholder 는 전부 '예: ' 접두사를 붙인다.
//     기존엔 '홍길동' '000-00-00000' 같은 값이 힌트로 떠서
//     "저장된 값이 잘못 들어가 있다" 는 오해를 반복해서 유발했다.
//
// ⚠️ 필드 추가 시 반드시 실제 소비처(렌더 코드)를 함께 만들 것.
//    사용처 없는 필드는 다시 같은 혼란을 만든다.
// ─────────────────────────────────────────────
const SETTING_FIELDS: SettingField[] = [
  // 기본 정보 — 전부 푸터 사업자정보 블록(components/layout/Footer.tsx)에 노출
  { key: 'company_name', label: '회사명', type: 'text', placeholder: '예: (주)우리편', group: '기본 정보' },
  { key: 'ceo_name', label: '대표자명', type: 'text', placeholder: '예: 김대표', group: '기본 정보' },
  { key: 'business_number', label: '사업자등록번호', type: 'text', placeholder: '예: 000-00-00000', group: '기본 정보' },
  { key: 'ecommerce_license', label: '통신판매업 신고번호', type: 'text', placeholder: '예: 제 2025-서울강서-0000호', group: '기본 정보' },

  // 연락처 — phone/email 은 푸터, kakao_channel 은 우하단 플로팅 버튼
  { key: 'phone', label: '대표 전화번호', type: 'tel', placeholder: '예: 1600-0000', group: '연락처' },
  { key: 'email', label: '이메일', type: 'text', placeholder: '예: contact@ourteam.kr', group: '연락처' },
  { key: 'kakao_channel', label: '카카오톡 채널', type: 'text', placeholder: '예: https://pf.kakao.com/_AbCdEf', group: '연락처' },

  // 위치 — 푸터 사업자정보
  { key: 'address', label: '사업장 주소', type: 'text', placeholder: '예: 서울특별시 강서구 공항대로 000', group: '위치' },

  // 기타 — 값이 있을 때만 푸터 하단에 노출 (휴무·연휴 안내 등 임시 공지용)
  { key: 'footer_notice', label: '하단 공지사항', type: 'textarea', placeholder: '예: 설 연휴(2/9~2/12) 상담이 일시 중단됩니다.', group: '기타' },

  // 법적 고지: 상담 폼의 [자세히 보기] + /privacy · /terms 페이지에서 SSR 렌더링
  { key: 'privacy_policy', label: '개인정보처리방침 전문', type: 'textarea', placeholder: '개인정보 수집·이용 관련 전문...', group: '법적 고지' },
  { key: 'third_party_consent_text', label: '제3자 제공 동의문', type: 'textarea', placeholder: '제공 받는 자, 제공 목적, 제공 항목...', group: '법적 고지' },
  { key: 'marketing_consent_text', label: '마케팅 수신 동의문', type: 'textarea', placeholder: '수신 내용, 수신 수단, 보유 기간...', group: '법적 고지' },
  { key: 'terms_of_service', label: '이용약관 전문', type: 'textarea', placeholder: '제1조(목적), 제2조(정의)...', group: '법적 고지' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/settings')
    if (res.ok) setSettings(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      alert('저장 실패')
    }
    setSaving(false)
  }

  const groups = [...new Set(SETTING_FIELDS.map(f => f.group))]

  if (loading) {
    return <div className="text-center py-12 text-gray-500">로딩 중...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">사이트 설정</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? '저장 중...' : saved ? '✓ 저장됨' : '저장'}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">사이트 전반에 사용되는 기본 정보를 관리합니다.</p>

      <div className="space-y-6">
        {groups.map(group => (
          <div key={group} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">{group}</h3>
            <div className="space-y-3">
              {SETTING_FIELDS.filter(f => f.group === group).map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      // 법적 고지 그룹은 장문 편집이라 큰 textarea 제공
                      rows={field.group === '법적 고지' ? 12 : 3}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y font-mono"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key] || ''}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

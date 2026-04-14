'use client'

import { useEffect, useState, useCallback } from 'react'

interface SettingField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'tel'
  placeholder: string
  group: string
}

const SETTING_FIELDS: SettingField[] = [
  { key: 'site_name', label: '사이트명', type: 'text', placeholder: '우리편', group: '기본 정보' },
  { key: 'site_description', label: '사이트 설명', type: 'text', placeholder: '사업자를 위한 통합 솔루션', group: '기본 정보' },
  { key: 'company_name', label: '회사명', type: 'text', placeholder: '(주)우리편', group: '기본 정보' },
  { key: 'ceo_name', label: '대표자명', type: 'text', placeholder: '홍길동', group: '기본 정보' },
  { key: 'business_number', label: '사업자등록번호', type: 'text', placeholder: '000-00-00000', group: '기본 정보' },
  { key: 'phone', label: '대표 전화번호', type: 'tel', placeholder: '1800-0000', group: '연락처' },
  { key: 'mobile', label: '상담 연락처', type: 'tel', placeholder: '010-0000-0000', group: '연락처' },
  { key: 'email', label: '이메일', type: 'text', placeholder: 'contact@wooripen.co.kr', group: '연락처' },
  { key: 'kakao_channel', label: '카카오톡 채널', type: 'text', placeholder: '@우리편', group: '연락처' },
  { key: 'address', label: '사업장 주소', type: 'text', placeholder: '서울특별시 강남구...', group: '위치' },
  { key: 'business_hours', label: '운영시간', type: 'text', placeholder: '평일 09:00 ~ 18:00', group: '위치' },
  { key: 'footer_notice', label: '하단 공지사항', type: 'textarea', placeholder: '통신판매업 제0000호...', group: '기타' },
  { key: 'privacy_url', label: '개인정보처리방침 URL', type: 'text', placeholder: '/privacy', group: '기타' },
  { key: 'terms_url', label: '이용약관 URL', type: 'text', placeholder: '/terms', group: '기타' },
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
                      rows={3}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
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

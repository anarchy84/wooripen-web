'use client'

// 숫자 카드(site_stats) 관리 페이지
// 메인 ⑦ 섹션의 "사장님 N명 · 업력 N년 · 파트너사 N개" 같은 카드를 편집

import { useEffect, useState, useCallback } from 'react'
import type { SiteStat } from '@/types/database'

export default function AdminSiteStatsPage() {
  const [stats, setStats] = useState<SiteStat[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    label: '',
    value: '',
    suffix: '',
    icon: '',
    description: '',
    is_visible: true,
    sort_order: 0,
  })

  const fetchStats = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/site-stats')
    if (res.ok) setStats(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const resetForm = () => {
    setForm({
      label: '',
      value: '',
      suffix: '',
      icon: '',
      description: '',
      is_visible: true,
      sort_order: 0,
    })
    setEditingId(null)
  }

  const startEdit = (s: SiteStat) => {
    setForm({
      label: s.label,
      value: s.value,
      suffix: s.suffix || '',
      icon: s.icon || '',
      description: s.description || '',
      is_visible: s.is_visible,
      sort_order: s.sort_order,
    })
    setEditingId(s.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const url = editingId ? `/api/admin/site-stats/${editingId}` : '/api/admin/site-stats'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setShowForm(false)
      resetForm()
      fetchStats()
    } else {
      const err = await res.json().catch(() => ({ error: '저장 실패' }))
      alert(`저장 실패: ${err.error || ''}`)
    }
    setSaving(false)
  }

  const toggleVisible = async (s: SiteStat) => {
    await fetch(`/api/admin/site-stats/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, is_visible: !s.is_visible }),
    })
    fetchStats()
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`"${label}" 카드를 삭제할까요?`)) return
    await fetch(`/api/admin/site-stats/${id}`, { method: 'DELETE' })
    fetchStats()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">숫자 카드 관리</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + 카드 추가
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        메인 페이지의 통계 카드(사장님 수·업력·파트너사 등)를 관리합니다. 정렬 순서가 낮을수록 왼쪽에 표시됩니다.
      </p>

      {/* 미리보기 */}
      {!loading && stats.filter(s => s.is_visible).length > 0 && (
        <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="text-xs text-gray-500 mb-3">실시간 미리보기</div>
          <div className="grid grid-cols-3 gap-3">
            {stats
              .filter(s => s.is_visible)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(s => (
                <div key={s.id} className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {s.value}
                    <span className="text-base text-gray-400">{s.suffix}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 추가/수정 폼 */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <h3 className="text-sm font-bold text-white">
            {editingId ? '카드 수정' : '새 카드 추가'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">라벨 (예: 사장님)</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="사장님"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">숫자 (예: 3000)</label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="3000"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">접미사 (예: 명)</label>
                <input
                  type="text"
                  value={form.suffix}
                  onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                  placeholder="명+"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                아이콘 (Iconify, 예: solar:users-group-rounded-bold)
              </label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="solar:users-group-rounded-bold"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">정렬 순서</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">부가 설명 (선택)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="전국 가입 사장님 수 (2026년 4월 기준)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-800 border-gray-700"
              />
              <span className="text-sm text-gray-300">노출 (메인 페이지에 표시)</span>
            </label>
            <div className="flex gap-2">
              <button onClick={() => { setShowForm(false); resetForm() }} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">취소</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.label || !form.value}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카드 목록 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : stats.length === 0 && !showForm ? (
        <div className="text-center py-12 text-gray-500">등록된 카드가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {stats.map((s) => (
            <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleVisible(s)}
                    className={`mt-1 w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${s.is_visible ? 'bg-emerald-500' : 'bg-gray-700'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${s.is_visible ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-600">#{s.sort_order}</span>
                      {s.icon && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">{s.icon}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-white">
                      {s.label}: <span className="text-blue-400">{s.value}{s.suffix}</span>
                    </h3>
                    {s.description && (
                      <p className="text-xs text-gray-400 mt-1">{s.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(s)} className="text-blue-400 hover:text-blue-300 text-xs">수정</button>
                  <button onClick={() => handleDelete(s.id, s.label)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

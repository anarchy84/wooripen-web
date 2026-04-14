'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Script } from '@/types/database'

export default function AdminScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    code: '',
    position: 'head' as Script['position'],
    scope: 'global' as Script['scope'],
    is_active: false,
  })

  const fetchScripts = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/scripts')
    if (res.ok) setScripts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchScripts() }, [fetchScripts])

  const resetForm = () => {
    setForm({ name: '', code: '', position: 'head', scope: 'global', is_active: false })
    setEditingId(null)
  }

  const startEdit = (s: Script) => {
    setForm({ name: s.name, code: s.code, position: s.position, scope: s.scope, is_active: s.is_active })
    setEditingId(s.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const url = editingId ? `/api/admin/scripts/${editingId}` : '/api/admin/scripts'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setShowForm(false)
      resetForm()
      fetchScripts()
    } else {
      alert('저장 실패')
    }
    setSaving(false)
  }

  const toggleActive = async (s: Script) => {
    await fetch(`/api/admin/scripts/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, is_active: !s.is_active }),
    })
    fetchScripts()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 스크립트를 삭제할까요?`)) return
    await fetch(`/api/admin/scripts/${id}`, { method: 'DELETE' })
    fetchScripts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">스크립트 관리</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + 스크립트 추가
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        구글 태그매니저(GTM), 네이버 프리미엄 로그분석, 카카오 픽셀 등 외부 스크립트를 관리합니다.
      </p>

      {/* 추가/수정 폼 */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <h3 className="text-sm font-bold text-white">
            {editingId ? '스크립트 수정' : '새 스크립트 추가'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">이름</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Google Tag Manager"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">삽입 위치</label>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value as Script['position'] })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="head">head (권장)</option>
                <option value="body_start">body 시작</option>
                <option value="body_end">body 끝</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">적용 범위</label>
              <select
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value as Script['scope'] })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="global">전체 페이지</option>
                <option value="page">특정 페이지만</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">스크립트 코드</label>
            <textarea
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              rows={5}
              placeholder={'<!-- Google Tag Manager -->\n<script>...</script>'}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-800 border-gray-700"
              />
              <span className="text-sm text-gray-300">즉시 활성화</span>
            </label>
            <div className="flex gap-2">
              <button onClick={() => { setShowForm(false); resetForm() }} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">취소</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.code} className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 스크립트 목록 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : scripts.length === 0 && !showForm ? (
        <div className="text-center py-12 text-gray-500">등록된 스크립트가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {scripts.map((s) => (
            <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(s)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${s.is_active ? 'bg-emerald-500' : 'bg-gray-700'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${s.is_active ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <div>
                    <h3 className="text-sm font-medium text-white">{s.name}</h3>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-gray-600">{s.position}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-600">{s.scope === 'global' ? '전체' : '특정 페이지'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(s)} className="text-blue-400 hover:text-blue-300 text-xs">수정</button>
                  <button onClick={() => handleDelete(s.id, s.name)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                </div>
              </div>
              <pre className="mt-2 text-xs text-gray-500 bg-gray-800 rounded-lg p-2 overflow-x-auto max-h-20">
                {s.code.substring(0, 200)}{s.code.length > 200 ? '...' : ''}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

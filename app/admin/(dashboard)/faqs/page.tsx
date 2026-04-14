'use client'

import { useEffect, useState, useCallback } from 'react'
import type { FAQ } from '@/types/database'
import { FAQ_CATEGORIES } from '@/types/database'

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'general',
    sort_order: 0,
    is_active: true,
  })

  const fetchFaqs = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/faqs')
    if (res.ok) setFaqs(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchFaqs() }, [fetchFaqs])

  const resetForm = () => {
    setForm({ question: '', answer: '', category: 'general', sort_order: 0, is_active: true })
    setEditingId(null)
  }

  const startEdit = (faq: FAQ) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_active: faq.is_active,
    })
    setEditingId(faq.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const url = editingId ? `/api/admin/faqs/${editingId}` : '/api/admin/faqs'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setShowForm(false)
      resetForm()
      fetchFaqs()
    } else {
      alert('저장 실패')
    }
    setSaving(false)
  }

  const toggleActive = async (faq: FAQ) => {
    await fetch(`/api/admin/faqs/${faq.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...faq, is_active: !faq.is_active }),
    })
    fetchFaqs()
  }

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`"${question.substring(0, 30)}..." FAQ를 삭제할까요?`)) return
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    fetchFaqs()
  }

  const filtered = filterCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === filterCategory)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">자주묻는질문 관리</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + FAQ 추가
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        홈페이지에 노출되는 자주묻는질문을 관리합니다. 정렬 순서가 낮을수록 위에 표시됩니다.
      </p>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            filterCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          전체 ({faqs.length})
        </button>
        {Object.entries(FAQ_CATEGORIES).map(([key, label]) => {
          const count = faqs.filter(f => f.category === key).length
          return (
            <button
              key={key}
              onClick={() => setFilterCategory(key)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                filterCategory === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* 추가/수정 폼 */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <h3 className="text-sm font-bold text-white">
            {editingId ? 'FAQ 수정' : '새 FAQ 추가'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">질문</label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="자주 묻는 질문을 입력하세요"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">카테고리</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(FAQ_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">정렬</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">답변</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              rows={4}
              placeholder="답변을 입력하세요"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
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
              <span className="text-sm text-gray-300">활성화 (홈페이지에 표시)</span>
            </label>
            <div className="flex gap-2">
              <button onClick={() => { setShowForm(false); resetForm() }} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">취소</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.question || !form.answer}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ 목록 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : filtered.length === 0 && !showForm ? (
        <div className="text-center py-12 text-gray-500">등록된 FAQ가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((faq) => (
            <div key={faq.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleActive(faq)}
                    className={`mt-1 w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${faq.is_active ? 'bg-emerald-500' : 'bg-gray-700'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${faq.is_active ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                        {FAQ_CATEGORIES[faq.category] || faq.category}
                      </span>
                      <span className="text-xs text-gray-600">#{faq.sort_order}</span>
                    </div>
                    <h3 className="text-sm font-medium text-white">Q. {faq.question}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">A. {faq.answer}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(faq)} className="text-blue-400 hover:text-blue-300 text-xs">수정</button>
                  <button onClick={() => handleDelete(faq.id, faq.question)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

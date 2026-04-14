'use client'

import { useEffect, useState, useCallback } from 'react'
import type { QnA } from '@/types/database'

export default function AdminQnAPage() {
  const [items, setItems] = useState<QnA[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [answeringId, setAnsweringId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/qna')
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleAnswer = async (id: string) => {
    if (!answerText.trim()) return
    setSaving(true)
    const res = await fetch(`/api/admin/qna/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: answerText }),
    })
    if (res.ok) {
      setAnsweringId(null)
      setAnswerText('')
      fetchItems()
    }
    setSaving(false)
  }

  const togglePublic = async (item: QnA) => {
    await fetch(`/api/admin/qna/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_public: !item.is_public }),
    })
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 질문을 삭제할까요?')) return
    await fetch(`/api/admin/qna/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const filtered = filterStatus === 'all'
    ? items
    : items.filter(i => i.status === filterStatus)

  const statusCounts = {
    all: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    answered: items.filter(i => i.status === 'answered').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">Q&A 관리</h1>
        <span className="text-sm text-gray-500">
          답변 대기 <span className="text-orange-400 font-bold">{statusCounts.pending}</span>건
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">고객 질문에 답변하고 공개/비공개를 관리합니다.</p>

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: '전체' },
          { key: 'pending', label: '답변 대기' },
          { key: 'answered', label: '답변 완료' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filterStatus === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {label} ({statusCounts[key as keyof typeof statusCounts]})
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">질문이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              {/* 헤더 */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      item.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.status === 'pending' ? '답변 대기' : '답변 완료'}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      item.is_public ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {item.is_public ? '공개' : '🔒 비공개'}
                    </span>
                    <span className="text-xs text-gray-600">조회 {item.view_count}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{item.author_name}</span>
                    {item.author_phone && <span className="text-xs text-gray-600">{item.author_phone}</span>}
                    <span className="text-xs text-gray-600">{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => togglePublic(item)} className="text-xs text-gray-400 hover:text-white">
                    {item.is_public ? '비공개로' : '공개로'}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                </div>
              </div>

              {/* 질문 내용 */}
              <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300 mb-3 whitespace-pre-wrap">
                {item.content}
              </div>

              {/* 답변 영역 */}
              {item.answer ? (
                <div className="border-l-2 border-blue-500 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-400 font-medium">관리자 답변</span>
                    <button
                      onClick={() => { setAnsweringId(item.id); setAnswerText(item.answer || '') }}
                      className="text-xs text-gray-500 hover:text-white"
                    >
                      수정
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{item.answer}</p>
                  {item.answered_at && (
                    <span className="text-xs text-gray-600 mt-1 block">
                      {new Date(item.answered_at).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>
              ) : null}

              {/* 답변 작성 폼 */}
              {(answeringId === item.id || (!item.answer && item.status === 'pending')) && answeringId !== null ? null : !item.answer ? (
                <button
                  onClick={() => { setAnsweringId(item.id); setAnswerText('') }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  답변 작성하기
                </button>
              ) : null}

              {answeringId === item.id && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={4}
                    placeholder="답변을 입력하세요..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setAnsweringId(null); setAnswerText('') }}
                      className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleAnswer(item.id)}
                      disabled={saving || !answerText.trim()}
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50"
                    >
                      {saving ? '저장 중...' : '답변 등록'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface QnAListItem {
  id: string
  title: string
  author_name: string
  is_public: boolean
  status: 'pending' | 'answered'
  view_count: number
  created_at: string
}

export default function QnAListPage() {
  const [items, setItems] = useState<QnAListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showWriteForm, setShowWriteForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    author_name: '',
    author_phone: '',
    password: '',
    is_public: true,
  })

  useEffect(() => {
    fetch('/api/qna')
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.author_name || !form.password) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }
    setSubmitting(true)
    const res = await fetch('/api/qna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      alert('질문이 등록되었습니다. 빠른 시일 내에 답변 드리겠습니다!')
      setShowWriteForm(false)
      setForm({ title: '', content: '', author_name: '', author_phone: '', password: '', is_public: true })
      // 새로고침
      const data = await fetch('/api/qna').then(r => r.json())
      setItems(data)
    } else {
      alert('등록에 실패했습니다. 다시 시도해주세요.')
    }
    setSubmitting(false)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Q&A 게시판</h1>
              <p className="text-sm text-gray-400 mt-1">궁금한 점을 질문해주세요. 빠르게 답변해드리겠습니다.</p>
            </div>
            <button
              onClick={() => setShowWriteForm(!showWriteForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              질문하기
            </button>
          </div>

          {/* 질문 작성 폼 */}
          {showWriteForm && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
              <h3 className="text-base font-bold text-white">질문 작성</h3>
              <div>
                <label className="block text-xs text-gray-500 mb-1">제목 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="질문 제목을 입력하세요"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">내용 *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  placeholder="질문 내용을 자세히 작성해주세요"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">이름 *</label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                    placeholder="홍길동"
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">연락처</label>
                  <input
                    type="tel"
                    value={form.author_phone}
                    onChange={(e) => setForm({ ...form, author_phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">비밀번호 *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="글 조회용 비밀번호"
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!form.is_public}
                    onChange={(e) => setForm({ ...form, is_public: !e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-700"
                  />
                  <span className="text-sm text-gray-300">🔒 비공개 질문</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowWriteForm(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {submitting ? '등록 중...' : '질문 등록'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 목록 */}
          {loading ? (
            <div className="text-center py-16 text-gray-500">로딩 중...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-500">아직 등록된 질문이 없습니다.</div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">상태</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">제목</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">작성자</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">날짜</th>
                    <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">조회</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.status === 'answered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {item.status === 'answered' ? '답변완료' : '대기'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/qna/${item.id}`}
                          className="text-sm text-white hover:text-blue-400 transition-colors"
                        >
                          {item.title}
                          {!item.is_public && <span className="ml-1.5 text-gray-500">🔒</span>}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">{item.author_name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">
                        {new Date(item.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 text-right">{item.view_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

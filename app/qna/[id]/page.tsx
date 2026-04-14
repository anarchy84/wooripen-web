'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface QnADetail {
  id: string
  title: string
  content: string
  author_name: string
  is_public: boolean
  status: 'pending' | 'answered'
  answer: string | null
  answered_at: string | null
  view_count: number
  created_at: string
}

export default function QnADetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<QnADetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [needPassword, setNeedPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [initialized, setInitialized] = useState(false)

  const fetchItem = async (pw?: string) => {
    setLoading(true)
    setError('')
    const res = await fetch(`/api/qna/${params.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw || '' }),
    })

    if (res.status === 403) {
      setNeedPassword(true)
      setError(pw ? '비밀번호가 일치하지 않습니다.' : '')
      setLoading(false)
      setInitialized(true)
      return
    }

    if (!res.ok) {
      setError('글을 찾을 수 없습니다.')
      setLoading(false)
      setInitialized(true)
      return
    }

    const data = await res.json()
    setItem(data)
    setNeedPassword(false)
    setLoading(false)
    setInitialized(true)
  }

  // 초기 로드
  if (!initialized && !loading) {
    fetchItem()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* 뒤로가기 */}
          <Link
            href="/qna"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            ← Q&A 목록으로
          </Link>

          {loading && !initialized ? (
            <div className="text-center py-16 text-gray-500">로딩 중...</div>
          ) : needPassword ? (
            /* 비밀번호 입력 */
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center max-w-sm mx-auto">
              <div className="text-3xl mb-3">🔒</div>
              <h2 className="text-lg font-bold text-white mb-2">비공개 글입니다</h2>
              <p className="text-sm text-gray-400 mb-4">작성 시 설정한 비밀번호를 입력해주세요.</p>
              {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchItem(password)}
                placeholder="비밀번호"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <button
                onClick={() => fetchItem(password)}
                disabled={!password || loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                {loading ? '확인 중...' : '확인'}
              </button>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-gray-500">{error}</div>
          ) : item ? (
            /* 글 상세 */
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {/* 제목 영역 */}
              <div className="p-5 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    item.status === 'answered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {item.status === 'answered' ? '답변완료' : '답변 대기'}
                  </span>
                  {!item.is_public && <span className="text-xs text-gray-500">🔒 비공개</span>}
                </div>
                <h1 className="text-lg font-bold text-white">{item.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{item.author_name}</span>
                  <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                  <span>조회 {item.view_count}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="p-5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                {item.content}
              </div>

              {/* 답변 */}
              {item.answer && (
                <div className="border-t border-gray-800 bg-blue-500/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-medium">관리자 답변</span>
                    {item.answered_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(item.answered_at).toLocaleDateString('ko-KR')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                </div>
              )}

              {item.status === 'pending' && (
                <div className="border-t border-gray-800 p-5 text-center">
                  <p className="text-sm text-gray-500">답변 준비 중입니다. 빠른 시일 내에 답변 드리겠습니다.</p>
                </div>
              )}
            </div>
          ) : null}

          {/* 하단 버튼 */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => router.push('/qna')}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
            >
              목록으로
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

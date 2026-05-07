'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateSlug, normalizeSlug } from '@/lib/slug'
import {
  TipTapEditor,
  SeoPanel,
  MediaLibraryPicker,
  type MediaSelection,
} from '@/components/admin-editor'

interface TipListItem {
  id: string
  title: string
  slug: string
  category: string
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

const CATEGORIES = ['인터넷', '단말기', 'CCTV', '키오스크', '가이드', '프로모션', '렌탈']

export default function AdminTipsPage() {
  const [tips, setTips] = useState<TipListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchTips = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('tips')
      .select('id, title, slug, category, is_published, view_count, created_at, updated_at')
      .order('created_at', { ascending: false })
    setTips(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTips() }, [fetchTips])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 글을 삭제할까요?`)) return
    await fetch(`/api/admin/tips/${id}`, { method: 'DELETE' })
    fetchTips()
  }

  if (showEditor) {
    return (
      <TipEditor
        tipId={editingId}
        onClose={() => { setShowEditor(false); setEditingId(null); fetchTips() }}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">꿀팁 관리</h1>
        <button
          onClick={() => { setEditingId(null); setShowEditor(true) }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + 새 글 작성
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : tips.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">작성된 글이 없습니다.</p>
          <button
            onClick={() => setShowEditor(true)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            첫 번째 글 작성하기 →
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">제목</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">카테고리</th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">상태</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">조회</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">수정일</th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip) => (
                <tr key={tip.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setEditingId(tip.id); setShowEditor(true) }}
                      className="text-white font-medium hover:text-blue-400 text-left"
                    >
                      {tip.title}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                      {tip.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      tip.is_published
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {tip.is_published ? '발행' : '임시저장'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400">{tip.view_count}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(tip.updated_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(tip.id, tip.title)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── 꿀팁 에디터 (TipTap + SEO 패널) ───────────────────────

function TipEditor({ tipId, onClose }: { tipId: string | null; onClose: () => void }) {
  const isEdit = !!tipId
  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '가이드',
    tags: '',
    seo_title: '',
    seo_description: '',
    featured_image_url: '',
    is_published: false,
    // 절차형 글 (HowTo schema.org) — 답변엔진(GEO/AEO) 가산 신호
    is_howto: false,
    how_to_total_time: '', // 'PT15M' 같은 ISO 8601 — 빈값이면 LD 에서 생략
    how_to_steps: [] as { name: string; text: string; image?: string; url?: string }[],
  })

  const [focusKeyword, setFocusKeyword] = useState('')

  const handleFeaturedImageSelect = (selection: MediaSelection) => {
    setForm((prev) => ({ ...prev, featured_image_url: selection.url }))
  }

  useEffect(() => {
    if (isEdit && tipId) {
      const load = async () => {
        const res = await fetch(`/api/admin/tips/${tipId}`)
        if (res.ok) {
          const data = await res.json()
          setForm({
            title: data.title || '',
            slug: data.slug || '',
            content: data.content || '',
            excerpt: data.excerpt || '',
            category: data.category || '가이드',
            tags: (data.tags || []).join(', '),
            seo_title: data.seo_title || '',
            seo_description: data.seo_description || '',
            featured_image_url: data.featured_image_url || '',
            is_published: data.is_published || false,
            is_howto: data.is_howto || false,
            how_to_total_time: data.how_to_total_time || '',
            how_to_steps: Array.isArray(data.how_to_steps) ? data.how_to_steps : [],
          })
        }
        setLoadingData(false)
      }
      load()
    }
  }, [isEdit, tipId])

  // slug 자동 생성 — generateSlug() 는 lib/slug.ts (한글/이모지 → timestamp 폴백 처리)

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSave = async (publish: boolean) => {
    setSaving(true)

    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      is_published: publish,
      slug: form.slug || generateSlug(form.title),
    }

    const url = isEdit ? `/api/admin/tips/${tipId}` : '/api/admin/tips'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      onClose()
    } else {
      const err = await res.json()
      alert(`저장 실패: ${err.error}`)
    }
    setSaving(false)
  }

  if (loadingData) {
    return <div className="text-center py-12 text-gray-500">로딩 중...</div>
  }

  return (
    <div>
      {/* 상단 바 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">
            ← 목록
          </button>
          <h1 className="text-xl font-bold text-white">
            {isEdit ? '글 수정' : '새 글 작성'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !form.title}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
          >
            임시저장
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !form.title}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? '저장 중...' : '발행'}
          </button>
        </div>
      </div>

      {/* 에디터 + SEO 패널 2단 레이아웃 */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* 왼쪽: 에디터 */}
        <div className="space-y-4">
          {/* 제목 */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* slug — normalizeSlug 로 한글/특수문자 자동 제거 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">ourteam.kr/tips/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: normalizeSlug(e.target.value) })}
              placeholder="english-only-slug"
              className="flex-1 px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* TipTap 에디터 */}
          <TipTapEditor
            content={form.content}
            onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
          />

          {/* 요약 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">요약 (목록에 표시)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="글을 요약하는 1~2문장"
            />
          </div>

          {/* 카테고리 + 태그 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">태그 (콤마 구분)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="인터넷, 비용절감, 가이드"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* HowTo (절차형 글) — 답변엔진 GEO/AEO 가산 신호 */}
          <div className="space-y-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">절차형 가이드 (HowTo)</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  단계별 글이면 켜기 · ChatGPT·구글이 단계 그대로 인용함
                </p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_howto}
                  onChange={(e) => setForm({ ...form, is_howto: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-xs text-gray-400">{form.is_howto ? 'ON' : 'OFF'}</span>
              </label>
            </div>

            {form.is_howto && (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">총 소요 시간 (선택, ISO 8601)</label>
                  <input
                    type="text"
                    value={form.how_to_total_time}
                    onChange={(e) => setForm({ ...form, how_to_total_time: e.target.value })}
                    placeholder="예: PT15M (15분), PT1H (1시간), PT1H30M"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-500">단계 ({form.how_to_steps.length})</label>
                    <button
                      type="button"
                      onClick={() => setForm({
                        ...form,
                        how_to_steps: [...form.how_to_steps, { name: '', text: '' }],
                      })}
                      className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                    >
                      + 단계 추가
                    </button>
                  </div>

                  {form.how_to_steps.map((step, idx) => (
                    <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Step {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setForm({
                            ...form,
                            how_to_steps: form.how_to_steps.filter((_, i) => i !== idx),
                          })}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          삭제
                        </button>
                      </div>
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => {
                          const next = [...form.how_to_steps]
                          next[idx] = { ...next[idx], name: e.target.value }
                          setForm({ ...form, how_to_steps: next })
                        }}
                        placeholder="단계 제목 (예: 인터넷 회선 비교)"
                        className="w-full px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <textarea
                        value={step.text}
                        onChange={(e) => {
                          const next = [...form.how_to_steps]
                          next[idx] = { ...next[idx], text: e.target.value }
                          setForm({ ...form, how_to_steps: next })
                        }}
                        rows={2}
                        placeholder="이 단계에서 무엇을 해야 하는지 1~3문장으로"
                        className="w-full px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  ))}

                  {form.how_to_steps.length === 0 && (
                    <p className="text-xs text-gray-500 italic">아직 단계가 없습니다. + 단계 추가 를 눌러 시작하세요.</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* SEO 메타 */}
          <div className="space-y-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300">SEO 메타태그</h3>
            <div>
              <label className="block text-xs text-gray-500 mb-1">SEO 제목 (비워두면 글 제목 사용)</label>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">메타 설명</label>
              <textarea
                value={form.seo_description}
                onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                대표 이미지 (목록 썸네일·OG 이미지)
              </label>

              {/* 미리보기 — 이미지가 설정된 경우만 */}
              {form.featured_image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={form.featured_image_url}
                  alt="대표이미지 미리보기"
                  className="w-full max-w-[240px] aspect-[16/9] object-cover rounded-md mb-2 border border-gray-700"
                />
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.featured_image_url}
                  readOnly
                  placeholder="미디어 라이브러리에서 선택"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFeaturedPickerOpen(true)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs rounded-lg whitespace-nowrap transition-colors"
                  title="미디어 라이브러리에서 선택"
                >
                  라이브러리
                </button>
                {form.featured_image_url && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, featured_image_url: '' })}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg whitespace-nowrap transition-colors"
                    title="이미지 제거"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: SEO 어시스턴트 패널 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-fit sticky top-4">
          <h2 className="text-sm font-bold text-white mb-4">SEO 어시스턴트</h2>
          <SeoPanel
            title={form.title}
            seoTitle={form.seo_title}
            seoDescription={form.seo_description}
            slug={form.slug}
            content={form.content}
            focusKeyword={focusKeyword}
            onFocusKeywordChange={setFocusKeyword}
          />
        </div>
      </div>

      <MediaLibraryPicker
        isOpen={featuredPickerOpen}
        title="대표 이미지 선택"
        onClose={() => setFeaturedPickerOpen(false)}
        onSelect={handleFeaturedImageSelect}
      />
    </div>
  )
}

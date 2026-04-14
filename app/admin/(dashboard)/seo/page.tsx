'use client'

import { useEffect, useState, useCallback } from 'react'
import type { PageMeta } from '@/types/database'

export default function AdminSeoPage() {
  const [pages, setPages] = useState<PageMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState({ seo_title: '', seo_description: '', og_image_url: '', canonical_url: '' })
  const [saving, setSaving] = useState(false)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/seo')
    if (res.ok) setPages(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchPages() }, [fetchPages])

  const startEdit = (page: PageMeta) => {
    setEditingSlug(page.page_slug)
    setForm({
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      og_image_url: page.og_image_url || '',
      canonical_url: page.canonical_url || '',
    })
  }

  const handleSave = async () => {
    if (!editingSlug) return
    setSaving(true)
    const res = await fetch(`/api/admin/seo/${editingSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setEditingSlug(null)
      fetchPages()
    } else {
      alert('저장 실패')
    }
    setSaving(false)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-2">SEO 메타태그 관리</h1>
      <p className="text-sm text-gray-500 mb-6">페이지별로 검색엔진에 노출될 제목, 설명, OG 이미지를 설정합니다.</p>

      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.page_slug} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              {editingSlug === page.page_slug ? (
                /* 수정 모드 */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{page.page_name} ({page.page_slug})</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingSlug(null)} className="text-xs text-gray-400 hover:text-white">취소</button>
                      <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg">
                        {saving ? '저장 중...' : '저장'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">SEO 제목</label>
                    <input
                      type="text"
                      value={form.seo_title}
                      onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                      placeholder="검색결과에 표시될 제목 (30~60자)"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600 mt-0.5 block">{form.seo_title.length}자</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">메타 설명</label>
                    <textarea
                      value={form.seo_description}
                      onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                      rows={2}
                      placeholder="검색결과에 표시될 설명 (120~160자)"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                    <span className="text-xs text-gray-600 mt-0.5 block">{form.seo_description.length}자</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">OG 이미지 URL</label>
                      <input
                        type="text"
                        value={form.og_image_url}
                        onChange={(e) => setForm({ ...form, og_image_url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={form.canonical_url}
                        onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {/* 검색 미리보기 */}
                  <div className="bg-white rounded-lg p-3 mt-2">
                    <p className="text-blue-700 text-sm font-medium truncate">{form.seo_title || page.page_name + ' | 우리편'}</p>
                    <p className="text-green-700 text-xs">wooripen.co.kr/{page.page_slug === 'home' ? '' : page.page_slug}</p>
                    <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{form.seo_description || '설명이 없습니다.'}</p>
                  </div>
                </div>
              ) : (
                /* 보기 모드 */
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{page.page_name}</h3>
                      <span className="text-xs text-gray-600">/{page.page_slug === 'home' ? '' : page.page_slug}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded ${
                        page.seo_title ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {page.seo_title ? '설정됨' : '미설정'}
                      </span>
                    </div>
                    {page.seo_title && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{page.seo_title}</p>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(page)}
                    className="text-blue-400 hover:text-blue-300 text-xs font-medium ml-4"
                  >
                    수정
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

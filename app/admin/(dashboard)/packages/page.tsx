'use client'

// 패키지 어드민 — Phase 2-A #2
// 실제 DB 스키마(target_industry, target_description, hero_title, hook_copy, is_visible …)와 1:1 매칭
// package_items는 product_id 필수 + is_highlighted / note 만 관리
// detail_sections는 JSON 배열 (type: hero/benefits/faq/testimonial/cta/richtext)

import { useEffect, useState, useCallback } from 'react'
import type { Package, Product } from '@/types/database'

// 폼 내부 상태 — product_id는 빈값 허용(미지정 라인), 저장 시 걸러냄
interface PackageItemForm {
  id?: string
  product_id: string
  is_highlighted: boolean
  note: string
  sort_order: number
}

interface PackageWithItems extends Package {
  package_items?: Array<{
    id: string
    product_id: string
    sort_order: number
    is_highlighted: boolean
    note: string | null
    product?: { id: string; name: string; category: string; image_url?: string | null } | null
  }>
}

const emptyForm = {
  slug: '',
  name: '',
  target_industry: '',       // 음식점·카페·미용실 등 (빈값=전체)
  target_description: '',    // '창업 3개월 이내 사장님'
  hero_title: '',
  hero_subtitle: '',
  hero_image: '',
  icon: '',                  // 카드 아이콘 (Iconify or emoji)
  hook_copy: '',             // 메인카드 훅 문구
  price_range_label: '',
  is_visible: true,
  sort_order: 0,
  seo_title: '',
  seo_description: '',
  og_image_url: '',
  detail_sections: '[]',     // JSON 문자열 편집
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageWithItems[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [items, setItems] = useState<PackageItemForm[]>([])

  const fetchPackages = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/packages')
    if (res.ok) setPackages(await res.json())
    setLoading(false)
  }, [])

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/admin/products')
    if (res.ok) setProducts(await res.json())
  }, [])

  useEffect(() => {
    fetchPackages()
    fetchProducts()
  }, [fetchPackages, fetchProducts])

  const resetForm = () => {
    setForm(emptyForm)
    setItems([])
    setEditingId(null)
  }

  const startEdit = (pkg: PackageWithItems) => {
    setForm({
      slug: pkg.slug,
      name: pkg.name,
      target_industry: pkg.target_industry || '',
      target_description: pkg.target_description || '',
      hero_title: pkg.hero_title || '',
      hero_subtitle: pkg.hero_subtitle || '',
      hero_image: pkg.hero_image || '',
      icon: pkg.icon || '',
      hook_copy: pkg.hook_copy || '',
      price_range_label: pkg.price_range_label || '',
      is_visible: pkg.is_visible,
      sort_order: pkg.sort_order,
      seo_title: pkg.seo_title || '',
      seo_description: pkg.seo_description || '',
      og_image_url: pkg.og_image_url || '',
      detail_sections: JSON.stringify(pkg.detail_sections || [], null, 2),
    })
    setItems(
      (pkg.package_items || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((it) => ({
          id: it.id,
          product_id: it.product_id,
          is_highlighted: it.is_highlighted,
          note: it.note || '',
          sort_order: it.sort_order,
        })),
    )
    setEditingId(pkg.id)
    setShowForm(true)
  }

  const addItem = () => {
    setItems([
      ...items,
      { product_id: '', is_highlighted: false, note: '', sort_order: items.length },
    ])
  }

  const updateItem = (idx: number, patch: Partial<PackageItemForm>) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx))
  }

  const moveItem = (idx: number, direction: -1 | 1) => {
    const target = idx + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setItems(next.map((it, i) => ({ ...it, sort_order: i })))
  }

  const handleSave = async () => {
    // detail_sections JSON 검증
    let detail_sections: unknown
    try {
      detail_sections = JSON.parse(form.detail_sections || '[]')
      if (!Array.isArray(detail_sections)) throw new Error('배열이어야 함')
    } catch (e) {
      alert(`detail_sections JSON 형식 오류: ${(e as Error).message}`)
      return
    }

    // product_id 없는 라인은 저장에서 제외 (NOT NULL 제약)
    const validItems = items.filter((it) => !!it.product_id)
    if (items.length > 0 && validItems.length < items.length) {
      if (!confirm(`상품이 선택되지 않은 구성 ${items.length - validItems.length}개가 제외됩니다. 계속할까요?`)) {
        return
      }
    }

    setSaving(true)

    const payload = {
      slug: form.slug,
      name: form.name,
      target_industry: form.target_industry || null,
      target_description: form.target_description || null,
      hero_title: form.hero_title || null,
      hero_subtitle: form.hero_subtitle || null,
      hero_image: form.hero_image || null,
      icon: form.icon || null,
      hook_copy: form.hook_copy || null,
      price_range_label: form.price_range_label || null,
      is_visible: form.is_visible,
      sort_order: form.sort_order,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      og_image_url: form.og_image_url || null,
      detail_sections,
      items: validItems.map((it, idx) => ({
        product_id: it.product_id,
        is_highlighted: it.is_highlighted,
        note: it.note || null,
        sort_order: idx,
      })),
    }

    const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      // 신규 등록은 본체만 들어감 → items 있으면 이어서 PUT
      if (!editingId && validItems.length > 0) {
        const created = await res.json()
        await fetch(`/api/admin/packages/${created.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      setShowForm(false)
      resetForm()
      fetchPackages()
    } else {
      const err = await res.json()
      alert(`저장 실패: ${err.error || '알 수 없는 오류'}`)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 패키지를 숨길까요? (is_visible=false, 데이터는 보존)`)) return
    await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
    fetchPackages()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">패키지 관리</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + 패키지 추가
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        업종·타겟별 맞춤 상품 조합. 각 패키지는 여러 구성 상품(단말기·인터넷·CCTV 등)을 묶어서 제공합니다.
      </p>

      {/* 추가/수정 폼 */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {editingId ? '패키지 수정' : '새 패키지 추가'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              닫기 ✕
            </button>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">슬러그 (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="startup"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-600 mt-1">/packages/[슬러그]</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">패키지명</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="초기창업자 패키지"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">대상 업종 (빈값=전체)</label>
              <input
                type="text"
                value={form.target_industry}
                onChange={(e) => setForm({ ...form, target_industry: e.target.value })}
                placeholder="음식점 / 카페 / 미용실 / 편의점"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">대상 설명</label>
              <input
                type="text"
                value={form.target_description}
                onChange={(e) => setForm({ ...form, target_description: e.target.value })}
                placeholder="창업 3개월 이내 사장님"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">훅 카피 (메인카드용 한줄)</label>
              <input
                type="text"
                value={form.hook_copy}
                onChange={(e) => setForm({ ...form, hook_copy: e.target.value })}
                placeholder="창업 첫 달, 3가지 필수만 한방에"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">카드 아이콘 (이모지 or Iconify)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🎁  또는  solar:gift-bold"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">가격 범위 문구</label>
              <input
                type="text"
                value={form.price_range_label}
                onChange={(e) => setForm({ ...form, price_range_label: e.target.value })}
                placeholder="월 3만원대부터"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 히어로 섹션 */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-sm font-bold text-white mb-2">상세페이지 히어로</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">히어로 타이틀</label>
                <input
                  type="text"
                  value={form.hero_title}
                  onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                  placeholder="빈 칸이면 패키지명 자동 사용"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">히어로 서브타이틀</label>
                <input
                  type="text"
                  value={form.hero_subtitle}
                  onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                  placeholder="창업 초기 필수 아이템 한 번에"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">히어로 배경 이미지 URL</label>
                <input
                  type="text"
                  value={form.hero_image}
                  onChange={(e) => setForm({ ...form, hero_image: e.target.value })}
                  placeholder="https://... 또는 미디어 관리에서 복사"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 구성 상품 빌더 */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-white">구성 상품 ({items.length})</h4>
              <button
                onClick={addItem}
                className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded"
              >
                + 상품 추가
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              ⚠️ 반드시 실제 상품(products)을 선택해야 저장됩니다. 미선택 라인은 자동 제외.
            </p>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-6">{idx + 1}.</span>
                    <button
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      className="text-xs text-gray-500 hover:text-white disabled:opacity-20"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === items.length - 1}
                      className="text-xs text-gray-500 hover:text-white disabled:opacity-20"
                    >
                      ▼
                    </button>
                    <select
                      value={it.product_id}
                      onChange={(e) => updateItem(idx, { product_id: e.target.value })}
                      className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs"
                    >
                      <option value="">-- 상품 선택 (필수) --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          [{p.category}] {p.name}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={it.is_highlighted}
                        onChange={(e) => updateItem(idx, { is_highlighted: e.target.checked })}
                        className="w-3 h-3"
                      />
                      대표
                    </label>
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-red-400 hover:text-red-300 text-xs px-2"
                    >
                      삭제
                    </button>
                  </div>
                  <input
                    type="text"
                    value={it.note}
                    onChange={(e) => updateItem(idx, { note: e.target.value })}
                    placeholder="노트 (예: 2년 약정 시 추가 할인)"
                    className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs"
                  />
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-xs text-gray-600 text-center py-4">구성 상품을 추가해주세요</p>
              )}
            </div>
          </div>

          {/* 상세 블록 JSON */}
          <div className="border-t border-gray-800 pt-4">
            <label className="block text-xs text-gray-500 mb-1">
              상세페이지 블록 (JSON 배열)
            </label>
            <textarea
              value={form.detail_sections}
              onChange={(e) => setForm({ ...form, detail_sections: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
              placeholder='[{"type":"hero","data":{"title":"...","subtitle":"..."}}, {"type":"benefits","data":{"items":[...]}}]'
            />
            <p className="text-xs text-gray-600 mt-1">
              type: hero | benefits | faq | testimonial | cta | richtext — 각 블록은 {'{'} type, data {'}'} 구조
            </p>
          </div>

          {/* SEO */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-sm font-bold text-white mb-2">SEO / OG</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  SEO 타이틀 <span className="text-gray-600">({form.seo_title.length}/60자)</span>
                </label>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  SEO 설명 <span className="text-gray-600">({form.seo_description.length}/160자)</span>
                </label>
                <textarea
                  value={form.seo_description}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">OG 이미지 URL</label>
                <input
                  type="text"
                  value={form.og_image_url}
                  onChange={(e) => setForm({ ...form, og_image_url: e.target.value })}
                  placeholder="1200x630 권장"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-800 pt-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700"
                />
                <span className="text-sm text-gray-300">노출</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">정렬</span>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.slug || !form.name}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 목록 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : packages.length === 0 && !showForm ? (
        <div className="text-center py-12 text-gray-500">등록된 패키지가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        pkg.is_visible ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {pkg.is_visible ? 'VISIBLE' : 'HIDDEN'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">/{pkg.slug}</span>
                    <span className="text-xs text-gray-600">#{pkg.sort_order}</span>
                    {pkg.target_industry && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-300">
                        {pkg.target_industry}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white">{pkg.name}</h3>
                  {pkg.hook_copy && (
                    <p className="text-xs text-gray-400 mt-1">💡 {pkg.hook_copy}</p>
                  )}
                  {pkg.target_description && (
                    <p className="text-xs text-gray-500 mt-0.5">대상: {pkg.target_description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>구성 {pkg.package_items?.length || 0}개</span>
                    {pkg.price_range_label && <span>· {pkg.price_range_label}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(pkg)} className="text-blue-400 hover:text-blue-300 text-xs">
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id, pkg.name)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    숨김
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

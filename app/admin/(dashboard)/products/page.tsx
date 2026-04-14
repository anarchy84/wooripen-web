'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/database'
import { CATEGORY_LABELS } from '@/types/database'

type CategoryFilter = Product['category'] | 'all'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('products').select('*').order('category').order('sort_order')
    if (category !== 'all') query = query.eq('category', category)
    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }, [category])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const toggleActive = async (id: string, currentActive: boolean) => {
    const supabase = createClient()
    await supabase.from('products').update({ is_active: !currentActive, updated_at: new Date().toISOString() }).eq('id', id)
    fetchProducts()
  }

  const togglePromo = async (id: string, currentPromo: boolean) => {
    const supabase = createClient()
    await supabase.from('products').update({ promo_active: !currentPromo, updated_at: new Date().toISOString() }).eq('id', id)
    fetchProducts()
  }

  const categories: CategoryFilter[] = ['all', 'internet', 'terminal', 'cctv', 'torder', 'rental']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">상품 관리</h1>
        <button
          onClick={() => { setEditingId(null); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + 새 상품
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {cat === 'all' ? '전체' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* 상품 목록 테이블 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">등록된 상품이 없습니다.</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">순서</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">상품명</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">카테고리</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">통신사</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">가격</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">프로모</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">상태</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-gray-500">{product.sort_order}</td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{product.name}</span>
                      {product.promo_badge && product.promo_active && (
                        <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                          {product.promo_badge}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                        {CATEGORY_LABELS[product.category] || product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{product.carrier || '—'}</td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {product.price != null ? `${product.price.toLocaleString()}원` : '무료/협의'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePromo(product.id, product.promo_active)}
                        className={`w-8 h-5 rounded-full transition-colors relative ${
                          product.promo_active ? 'bg-amber-500' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            product.promo_active ? 'left-3.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className={`w-8 h-5 rounded-full transition-colors relative ${
                          product.is_active ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            product.is_active ? 'left-3.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => { setEditingId(product.id); setShowForm(true) }}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 상품 등록/수정 모달 */}
      {showForm && (
        <ProductFormModal
          productId={editingId}
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSaved={() => { setShowForm(false); setEditingId(null); fetchProducts() }}
        />
      )}
    </div>
  )
}

// ─── 상품 폼 모달 ───────────────────────────────────────────

interface ProductFormModalProps {
  productId: string | null
  onClose: () => void
  onSaved: () => void
}

function ProductFormModal({ productId, onClose, onSaved }: ProductFormModalProps) {
  const isEdit = !!productId
  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)

  const [form, setForm] = useState({
    name: '',
    category: 'internet' as Product['category'],
    sub_category: '',
    carrier: '',
    price: '',
    original_price: '',
    speed: '',
    gift_description: '',
    features: '',
    description: '',
    promo_badge: '',
    promo_active: false,
    is_active: true,
    sort_order: '0',
    image_url: '',
  })

  useEffect(() => {
    if (isEdit && productId) {
      const fetchProduct = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('products').select('*').eq('id', productId).single()
        if (data) {
          setForm({
            name: data.name || '',
            category: data.category,
            sub_category: data.sub_category || '',
            carrier: data.carrier || '',
            price: data.price != null ? String(data.price) : '',
            original_price: data.original_price != null ? String(data.original_price) : '',
            speed: data.speed || '',
            gift_description: data.gift_description || '',
            features: (data.features || []).join(', '),
            description: data.description || '',
            promo_badge: data.promo_badge || '',
            promo_active: data.promo_active || false,
            is_active: data.is_active ?? true,
            sort_order: String(data.sort_order || 0),
            image_url: data.image_url || '',
          })
        }
        setLoadingData(false)
      }
      fetchProduct()
    }
  }, [isEdit, productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      category: form.category,
      sub_category: form.sub_category || null,
      carrier: form.carrier || null,
      price: form.price ? Number(form.price) : null,
      original_price: form.original_price ? Number(form.original_price) : null,
      speed: form.speed || null,
      gift_description: form.gift_description || null,
      features: form.features ? form.features.split(',').map((f) => f.trim()).filter(Boolean) : [],
      specs: {},
      description: form.description || null,
      promo_badge: form.promo_badge || null,
      promo_active: form.promo_active,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
      image_url: form.image_url || null,
    }

    const url = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      onSaved()
    } else {
      alert('저장에 실패했습니다.')
    }
    setSaving(false)
  }

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-8 text-gray-400">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? '상품 수정' : '새 상품 등록'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">&times;</button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 상품명 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">상품명 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 카테고리 + 소분류 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">카테고리 *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">소분류</label>
              <input
                type="text"
                value={form.sub_category}
                onChange={(e) => setForm({ ...form, sub_category: e.target.value })}
                placeholder="internet_100m"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 통신사 + 속도 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">통신사</label>
              <select
                value={form.carrier}
                onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">없음</option>
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LG U+">LG U+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">속도</label>
              <input
                type="text"
                value={form.speed}
                onChange={(e) => setForm({ ...form, speed: e.target.value })}
                placeholder="100Mbps"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 가격 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">가격 (원)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">원가 (원)</label>
              <input
                type="number"
                value={form.original_price}
                onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">정렬 순서</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">설명</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 특징 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">특징 (콤마로 구분)</label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="기본 인터넷, 소규모 매장 추천, Wi-Fi 공유기 제공"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 사은품 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">사은품/혜택</label>
            <input
              type="text"
              value={form.gift_description}
              onChange={(e) => setForm({ ...form, gift_description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">이미지 URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 프로모션 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">프로모션 배지</label>
              <input
                type="text"
                value={form.promo_badge}
                onChange={(e) => setForm({ ...form, promo_badge: e.target.value })}
                placeholder="4월 한정"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.promo_active}
                  onChange={(e) => setForm({ ...form, promo_active: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-300">프로모 활성</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-300">상품 활성</span>
              </label>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

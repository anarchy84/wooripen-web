'use client'

// GNB 메뉴(nav_menus) 관리 페이지
// - 2단계 트리 구조 (루트 + 하위)
// - 순서 변경은 ▲▼ 버튼으로 형제 내에서 이동
// - 루트/하위 각자 sort_order를 0,1,2... 로 재정규화해서 /api/admin/nav-menus/reorder 로 배치 업데이트
//
// 주의: parent_id 변경은 이 화면에서 지원하지 않음(이동은 삭제 후 재생성 또는 수정 폼에서 선택).

import { useEffect, useState, useCallback } from 'react'
import type { NavMenu } from '@/types/database'

interface NavNode extends NavMenu {
  children?: NavMenu[]
}

export default function AdminNavMenusPage() {
  const [tree, setTree] = useState<NavNode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    parent_id: '' as string,
    label: '',
    url: '',
    is_external: false,
    is_visible: true,
    sort_order: 0,
    icon: '',
    badge_label: '',
    badge_color: '',
  })

  const fetchMenus = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/nav-menus')
    if (res.ok) setTree(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchMenus() }, [fetchMenus])

  const resetForm = () => {
    setForm({
      parent_id: '',
      label: '',
      url: '',
      is_external: false,
      is_visible: true,
      sort_order: 0,
      icon: '',
      badge_label: '',
      badge_color: '',
    })
    setEditingId(null)
  }

  const startEdit = (m: NavMenu) => {
    setForm({
      parent_id: m.parent_id || '',
      label: m.label,
      url: m.url,
      is_external: m.is_external,
      is_visible: m.is_visible,
      sort_order: m.sort_order,
      icon: m.icon || '',
      badge_label: m.badge_label || '',
      badge_color: m.badge_color || '',
    })
    setEditingId(m.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const url = editingId ? `/api/admin/nav-menus/${editingId}` : '/api/admin/nav-menus'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        parent_id: form.parent_id || null,
      }),
    })

    if (res.ok) {
      setShowForm(false)
      resetForm()
      fetchMenus()
    } else {
      const err = await res.json().catch(() => ({ error: '저장 실패' }))
      alert(`저장 실패: ${err.error || ''}`)
    }
    setSaving(false)
  }

  const toggleVisible = async (m: NavMenu) => {
    await fetch(`/api/admin/nav-menus/${m.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...m, is_visible: !m.is_visible }),
    })
    fetchMenus()
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`"${label}" 메뉴를 삭제할까요? (하위 메뉴도 함께 삭제됩니다)`)) return
    await fetch(`/api/admin/nav-menus/${id}`, { method: 'DELETE' })
    fetchMenus()
  }

  // 형제 내에서 위/아래로 이동: 재정렬 후 일괄 업데이트
  const moveSiblings = async (siblings: NavMenu[], fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= siblings.length) return
    const reordered = [...siblings]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    const items = reordered.map((m, i) => ({ id: m.id, sort_order: i }))

    const res = await fetch('/api/admin/nav-menus/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!res.ok) {
      alert('순서 변경 실패')
      return
    }
    fetchMenus()
  }

  const moveRoot = (idx: number, dir: -1 | 1) => {
    const siblings = tree.map(({ children, ...rest }) => rest as NavMenu)
    moveSiblings(siblings, idx, idx + dir)
  }

  const moveChild = (rootChildren: NavMenu[], idx: number, dir: -1 | 1) => {
    moveSiblings(rootChildren, idx, idx + dir)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">GNB 메뉴 관리</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + 메뉴 추가
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        홈페이지 상단 네비게이션 메뉴를 관리합니다. ▲▼ 버튼으로 순서를 변경할 수 있습니다.
      </p>

      {/* 추가/수정 폼 */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <h3 className="text-sm font-bold text-white">
            {editingId ? '메뉴 수정' : '새 메뉴 추가'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">상위 메뉴 (없으면 루트)</label>
              <select
                value={form.parent_id}
                onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">(루트 메뉴)</option>
                {tree.map((root) => (
                  <option key={root.id} value={root.id}>{root.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">라벨</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="솔루션"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">URL</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="/products/pos"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">아이콘 (Iconify)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="solar:cart-bold"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">뱃지 문구 (예: NEW, HOT)</label>
              <input
                type="text"
                value={form.badge_label}
                onChange={(e) => setForm({ ...form, badge_label: e.target.value })}
                placeholder="NEW"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">뱃지 색상 (Tailwind)</label>
              <input
                type="text"
                value={form.badge_color}
                onChange={(e) => setForm({ ...form, badge_color: e.target.value })}
                placeholder="red / blue / emerald"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_external}
                onChange={(e) => setForm({ ...form, is_external: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-800 border-gray-700"
              />
              <span className="text-sm text-gray-300">외부 링크 (새 창 열림)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-800 border-gray-700"
              />
              <span className="text-sm text-gray-300">노출</span>
            </label>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => { setShowForm(false); resetForm() }} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">취소</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.label || !form.url}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 트리 목록 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : tree.length === 0 && !showForm ? (
        <div className="text-center py-12 text-gray-500">등록된 메뉴가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {tree.map((root, rootIdx) => (
            <div key={root.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              {/* 루트 메뉴 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveRoot(rootIdx, -1)}
                      disabled={rootIdx === 0}
                      className="text-gray-500 hover:text-white disabled:opacity-20 text-xs px-1"
                    >▲</button>
                    <button
                      onClick={() => moveRoot(rootIdx, 1)}
                      disabled={rootIdx === tree.length - 1}
                      className="text-gray-500 hover:text-white disabled:opacity-20 text-xs px-1"
                    >▼</button>
                  </div>
                  <button
                    onClick={() => toggleVisible(root)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${root.is_visible ? 'bg-emerald-500' : 'bg-gray-700'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${root.is_visible ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{root.label}</span>
                      {root.badge_label && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded text-white bg-${root.badge_color || 'red'}-500`}>
                          {root.badge_label}
                        </span>
                      )}
                      <span className="text-xs text-gray-600">{root.url}</span>
                      {root.is_external && <span className="text-[10px] text-yellow-500">↗ 외부</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(root)} className="text-blue-400 hover:text-blue-300 text-xs">수정</button>
                  <button onClick={() => handleDelete(root.id, root.label)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                </div>
              </div>

              {/* 하위 메뉴 */}
              {root.children && root.children.length > 0 && (
                <div className="mt-3 ml-12 pl-4 border-l-2 border-gray-800 space-y-1.5">
                  {root.children.map((child, childIdx) => (
                    <div key={child.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveChild(root.children as NavMenu[], childIdx, -1)}
                            disabled={childIdx === 0}
                            className="text-gray-500 hover:text-white disabled:opacity-20 text-[10px] px-1"
                          >▲</button>
                          <button
                            onClick={() => moveChild(root.children as NavMenu[], childIdx, 1)}
                            disabled={childIdx === (root.children?.length ?? 0) - 1}
                            className="text-gray-500 hover:text-white disabled:opacity-20 text-[10px] px-1"
                          >▼</button>
                        </div>
                        <button
                          onClick={() => toggleVisible(child)}
                          className={`w-7 h-4 rounded-full transition-colors relative flex-shrink-0 ${child.is_visible ? 'bg-emerald-500' : 'bg-gray-700'}`}
                        >
                          <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${child.is_visible ? 'left-3.5' : 'left-0.5'}`} />
                        </button>
                        <span className="text-sm text-gray-300">{child.label}</span>
                        <span className="text-xs text-gray-600">{child.url}</span>
                        {child.badge_label && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded text-white bg-${child.badge_color || 'red'}-500`}>
                            {child.badge_label}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(child)} className="text-blue-400 hover:text-blue-300 text-xs">수정</button>
                        <button onClick={() => handleDelete(child.id, child.label)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

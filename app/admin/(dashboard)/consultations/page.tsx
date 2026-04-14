'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Consultation } from '@/types/database'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '대기', color: 'bg-amber-500/20 text-amber-400' },
  contacted: { label: '연락완료', color: 'bg-blue-500/20 text-blue-400' },
  converted: { label: '계약완료', color: 'bg-emerald-500/20 text-emerald-400' },
  failed: { label: '미전환', color: 'bg-gray-700 text-gray-400' },
}

export default function AdminConsultationsPage() {
  const [items, setItems] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('consultations').select('*').order('created_at', { ascending: false })
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    const { data } = await query
    setItems(data || [])
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('consultations').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">상담 신청 관리</h1>

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'contacted', 'converted', 'failed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {s === 'all' ? '전체' : STATUS_LABELS[s]?.label || s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">상담 신청이 없습니다.</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">이름</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">연락처</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">상품</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">업종</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">메모</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">상태</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">신청일</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.pending
                  return (
                    <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-gray-300">{item.phone}</td>
                      <td className="px-4 py-3 text-gray-400">{item.product_category}</td>
                      <td className="px-4 py-3 text-gray-400">{item.business_type || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{item.memo || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          className={`px-2 py-0.5 text-xs rounded border-0 cursor-pointer ${statusInfo.color} bg-opacity-100`}
                        >
                          {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString('ko-KR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

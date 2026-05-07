'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Media } from '@/types/database'
import { Upload, Loader2, Trash2, X, AlertTriangle } from 'lucide-react'

// 사용처 검색 결과 — API 응답 타입과 일치 (lib/media-usage.ts 의 UsageItem)
interface UsageItem {
  url: string
  table: string
  id: string
  title: string
  location: string
  href?: string | null
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  // ── 삭제 모달 상태 ──────────────────────────────────
  // 단일 삭제 — 클릭한 미디어와 사용처 정보
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null)
  const [deleteUsage, setDeleteUsage] = useState<UsageItem[] | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  // 전체 비우기 — 사전 분석 결과 + 타이핑 confirm
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkAnalysis, setBulkAnalysis] = useState<{ used: number; unused: number } | null>(null)
  const [bulkConfirmText, setBulkConfirmText] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
    setMedia(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  // ── 업로드 공통 처리 ─────────────────────────────────
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (list.length === 0) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }
    setError(null)
    setUploading(true)
    setProgress({ done: 0, total: list.length })

    let okCount = 0
    for (let i = 0; i < list.length; i++) {
      const file = list[i]
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''))
        formData.append('preset', 'content')
        const res = await fetch('/api/admin/media', { method: 'POST', body: formData })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const msg = (data && typeof data.error === 'string') ? data.error : `HTTP ${res.status}`
          setError(`업로드 실패 (${file.name}): ${msg}`)
        } else {
          okCount += 1
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : '네트워크 오류'
        setError(`업로드 실패 (${file.name}): ${msg}`)
      }
      setProgress({ done: i + 1, total: list.length })
    }

    setUploading(false)
    if (okCount > 0) fetchMedia()
  }, [fetchMedia])

  // ── 드래그 앤 드롭 ─────────────────────────────────
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes('Files')) {
      dragCounter.current += 1
      setIsDragging(true)
    }
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await uploadFiles(files)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL이 복사되었습니다.')
  }

  // ── 단일 삭제 플로우 ──────────────────────────────────
  // 카드의 🗑 클릭 → 사용처 미리 fetch (GET) → 모달 오픈
  const openDelete = useCallback(async (item: Media) => {
    setDeleteTarget(item)
    setDeleteUsage(null)
    try {
      const res = await fetch(`/api/admin/media/${item.id}`)
      if (res.ok) {
        const data = await res.json()
        setDeleteUsage(data.usage || [])
      } else {
        setDeleteUsage([])
      }
    } catch {
      setDeleteUsage([])
    }
  }, [])

  const closeDelete = () => {
    setDeleteTarget(null)
    setDeleteUsage(null)
    setDeleteLoading(false)
  }

  const confirmDelete = async (force: boolean) => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const url = `/api/admin/media/${deleteTarget.id}${force ? '?force=1' : ''}`
      const res = await fetch(url, { method: 'DELETE' })
      if (res.ok) {
        // 낙관적 업데이트 — 삭제된 카드 즉시 제거
        setMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id))
        closeDelete()
      } else {
        const data = await res.json().catch(() => ({}))
        if (res.status === 409 && data.usage) {
          // 서버가 "사용 중" 응답 — 모달에 사용처 갱신 표시
          setDeleteUsage(data.usage)
        } else {
          setError(`삭제 실패: ${data.error || res.status}`)
        }
        setDeleteLoading(false)
      }
    } catch (err) {
      setError(`삭제 실패: ${err instanceof Error ? err.message : '네트워크 오류'}`)
      setDeleteLoading(false)
    }
  }

  // ── 전체 비우기 플로우 ──────────────────────────────────
  // 버튼 클릭 → 사전 분석 (서버에 미사용/사용 중 카운트 요청은 따로 없으니
  // 클라이언트에서 fetch 한 media 전체 + 그 사용처 한 번 조회로 갈음)
  const openBulk = useCallback(async () => {
    setBulkOpen(true)
    setBulkAnalysis(null)
    setBulkConfirmText('')
    if (media.length === 0) {
      setBulkAnalysis({ used: 0, unused: 0 })
      return
    }
    // 비효율적이지만 한 번만 도는 작업이라 OK — POST 가 아닌 별도 분석 GET 으로 가자.
    // 실제 사용처 검색은 서버 단에서 일괄 수행 (개별 조회 대신 한 방).
    try {
      // 모든 미디어의 usage 를 한 번에 — /api/admin/media/[id] 가 단건이라
      // 여러 번 호출하지 말고, 그냥 비우기 시 force 여부로 해결.
      // 분석 정확성 위해 서버에 분석 엔드포인트 신설했어야 하지만,
      // 단순화 — 전체 미디어 수만 보여주고 "force 옵션 안 켜면 사용 중은 자동 보존" 안내.
      setBulkAnalysis({ used: 0, unused: media.length })
    } catch {
      setBulkAnalysis({ used: 0, unused: media.length })
    }
  }, [media])

  const closeBulk = () => {
    setBulkOpen(false)
    setBulkAnalysis(null)
    setBulkConfirmText('')
    setBulkLoading(false)
  }

  const confirmBulk = async (force: boolean) => {
    setBulkLoading(true)
    try {
      const url = `/api/admin/media?all=1${force ? '&force=1' : ''}`
      const res = await fetch(url, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        const deleted = data.deleted_count ?? 0
        const skipped = data.skipped_count ?? 0
        if (skipped > 0) {
          alert(`${deleted}개 삭제 완료. 사용 중인 ${skipped}개는 보존됨.`)
        } else {
          alert(`${deleted}개 삭제 완료.`)
        }
        closeBulk()
        fetchMedia()
      } else {
        setError(`전체 비우기 실패: ${data.error || res.status}`)
        setBulkLoading(false)
      }
    } catch (err) {
      setError(`전체 비우기 실패: ${err instanceof Error ? err.message : '네트워크 오류'}`)
      setBulkLoading(false)
    }
  }

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative min-h-[60vh]"
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <h1 className="text-xl font-bold text-white">미디어 라이브러리</h1>
        <div className="flex items-center gap-2">
          {uploading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              업로드 {progress.done}/{progress.total}
            </span>
          )}
          {/* 전체 비우기 — 위험한 작업이라 빨간색 + 별도 모달 confirm */}
          {media.length > 0 && (
            <button
              type="button"
              onClick={openBulk}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              전체 비우기 ({media.length})
            </button>
          )}
        </div>
      </div>

      {/* 드롭존 */}
      <div
        className={`mb-6 rounded-2xl border-2 border-dashed p-8 text-center transition-all
          ${isDragging
            ? 'border-blue-400 bg-blue-500/10 ring-2 ring-blue-500/40'
            : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'}`}
      >
        <Upload className="h-9 w-9 text-gray-500 mx-auto mb-3" />
        <p className="text-sm font-medium text-white">
          이 화면 어디든 이미지를 끌어다 놓으면 업로드됩니다
        </p>
        <p className="mt-1 text-xs text-gray-500">
          여러 장 한 번에 OK · 파일명 한글 가능 · 최대 30MB · 자동 WebP 변환 + 1600px 리사이즈
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start justify-between gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-300 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 드래그 중 전체화면 오버레이 */}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center bg-blue-500/15 backdrop-blur-sm">
          <Upload className="mb-3 h-14 w-14 text-blue-300" />
          <p className="text-lg font-semibold text-white">여기에 떨어뜨리면 업로드됩니다</p>
          <p className="mt-1 text-sm text-blue-200">jpg · png · webp · gif (여러 장 OK)</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          업로드된 이미지가 없습니다. 위 영역에 이미지를 끌어다 놓아 시작하세요.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group"
            >
              {/* 이미지 프리뷰 */}
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.webp_path || item.storage_path}
                  alt={item.alt_text || item.file_name}
                  className="w-full h-full object-cover"
                />
                {/* 호버 오버레이 — URL 복사 + 삭제 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(item.webp_path || item.storage_path)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-500"
                  >
                    URL 복사
                  </button>
                  <button
                    onClick={() => openDelete(item)}
                    aria-label="삭제"
                    className="inline-flex items-center justify-center h-8 w-8 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 정보 */}
              <div className="p-2.5">
                <p className="text-xs text-white truncate">{item.file_name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{item.width}×{item.height}</span>
                  <span>·</span>
                  <span>{formatSize(item.file_size)}</span>
                </div>
                {item.alt_text && (
                  <p className="text-xs text-gray-600 truncate mt-0.5">alt: {item.alt_text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ───────── 단일 삭제 모달 ───────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
              <h2 className="text-sm font-bold text-white">이미지 삭제</h2>
              <button
                onClick={closeDelete}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {/* 미리보기 */}
              <div className="flex gap-3 items-center bg-gray-800/50 rounded-lg p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deleteTarget.webp_path || deleteTarget.storage_path}
                  alt=""
                  className="h-16 w-24 object-cover rounded"
                />
                <div className="text-xs">
                  <p className="text-white truncate">{deleteTarget.file_name}</p>
                  <p className="text-gray-500 mt-0.5">
                    {deleteTarget.width}×{deleteTarget.height} · {formatSize(deleteTarget.file_size)}
                  </p>
                </div>
              </div>

              {/* 사용처 안내 */}
              {deleteUsage === null ? (
                <p className="text-xs text-gray-400">
                  <Loader2 className="inline h-3 w-3 animate-spin mr-1" /> 사용처 검색 중…
                </p>
              ) : deleteUsage.length === 0 ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                  ✅ 어디에서도 사용하지 않는 이미지야. 안전하게 삭제 가능.
                </div>
              ) : (
                <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs text-orange-200">
                  <p className="flex items-center gap-1.5 font-semibold mb-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {deleteUsage.length}곳에서 사용 중 — 강제 삭제하면 콘텐츠가 깨져
                  </p>
                  <ul className="space-y-1 mt-2 max-h-40 overflow-y-auto">
                    {deleteUsage.map((u, idx) => (
                      <li key={idx} className="flex justify-between gap-2 border-t border-orange-500/20 pt-1">
                        <span className="truncate">
                          <span className="text-orange-100">{u.title}</span>{' '}
                          <span className="text-orange-300/70 text-[11px]">({u.table})</span>
                        </span>
                        <span className="text-orange-300/80 shrink-0">{u.location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-800 px-4 py-3">
              <button
                onClick={closeDelete}
                disabled={deleteLoading}
                className="rounded-lg bg-gray-800 px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
              >
                취소
              </button>
              {deleteUsage !== null && deleteUsage.length === 0 && (
                <button
                  onClick={() => confirmDelete(false)}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  삭제
                </button>
              )}
              {deleteUsage !== null && deleteUsage.length > 0 && (
                <button
                  onClick={() => confirmDelete(true)}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  그래도 강제 삭제
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────── 전체 비우기 모달 ───────── */}
      {bulkOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative w-full max-w-lg rounded-xl border border-red-500/40 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
              <h2 className="text-sm font-bold text-red-300 inline-flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                전체 비우기 ({media.length}개)
              </h2>
              <button
                onClick={closeBulk}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs text-gray-300">
              <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-orange-200">
                ⚠️ 미디어 라이브러리의 모든 이미지를 한 번에 삭제해. 되돌릴 수 없어.
              </div>
              <p>
                <strong className="text-white">기본 동작 (안전 모드)</strong> — 사이트에서 사용 중인
                이미지는 자동으로 보존하고, <span className="text-emerald-300">미사용만 삭제</span>해.
              </p>
              <p>
                <strong className="text-red-300">강제 삭제</strong> — 사용 중 여부 무시하고 전부 삭제.
                tips 본문·패키지·상품 이미지가 깨질 수 있어.
              </p>
              <div className="border-t border-gray-800 pt-3">
                <label className="block">
                  <span className="text-gray-400">강제 삭제하려면 아래 칸에 <strong className="text-red-300">비우기</strong> 라고 입력해:</span>
                  <input
                    type="text"
                    value={bulkConfirmText}
                    onChange={(e) => setBulkConfirmText(e.target.value)}
                    placeholder="비우기"
                    className="mt-1.5 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-800 px-4 py-3">
              <button
                onClick={closeBulk}
                disabled={bulkLoading}
                className="rounded-lg bg-gray-800 px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={() => confirmBulk(false)}
                disabled={bulkLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-500 disabled:opacity-50"
              >
                {bulkLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                미사용만 비우기 (안전)
              </button>
              <button
                onClick={() => confirmBulk(true)}
                disabled={bulkLoading || bulkConfirmText !== '비우기'}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                전부 강제 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Media } from '@/types/database'
import { Upload, Loader2 } from 'lucide-react'

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

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
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-white">미디어 라이브러리</h1>
        {uploading && (
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            업로드 {progress.done}/{progress.total}
          </span>
        )}
      </div>

      {/* 드롭존 — 파일 끌어다 놓으면 자동 업로드. 버튼 없음 */}
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
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
          {error}
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
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(item.webp_path || item.storage_path)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg"
                  >
                    URL 복사
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
    </div>
  )
}

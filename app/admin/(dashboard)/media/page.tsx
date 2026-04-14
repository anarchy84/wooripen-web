'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Media } from '@/types/database'

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''))

      await fetch('/api/admin/media', { method: 'POST', body: formData })
    }
    setUploading(false)
    fetchMedia()
    e.target.value = ''
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">미디어 라이브러리</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {uploading ? '업로드 중...' : '+ 이미지 업로드'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      <p className="text-xs text-gray-500 mb-4">
        이미지 업로드 시 자동으로 WebP로 변환되며, 최대 너비 1200px로 리사이즈됩니다. (최대 5MB)
      </p>

      {loading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 text-gray-500">업로드된 이미지가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group"
            >
              {/* 이미지 프리뷰 */}
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
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

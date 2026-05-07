'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { useCallback, useEffect, useRef, useState } from 'react'
import MediaLibraryPicker, { type MediaSelection } from '@/components/admin-editor/MediaLibraryPicker'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

// ── 본문 직접 업로드 헬퍼 ────────────────────────────────
// 클립보드/드래그한 File 을 /api/admin/media 에 보내서 URL 받기
async function uploadImageFile(file: File): Promise<string | null> {
  if (!file.type.startsWith('image/')) return null
  const formData = new FormData()
  formData.append('file', file)
  formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''))
  formData.append('preset', 'content')   // 본문용 — max 1600 종횡비 유지

  try {
    const res = await fetch('/api/admin/media', { method: 'POST', body: formData })
    if (!res.ok) {
      console.error('[TipTap upload]', await res.text())
      return null
    }
    const data = await res.json()
    // webp_path 우선, 없으면 storage_path
    return (data.webp_path as string) || (data.storage_path as string) || null
  } catch (err) {
    console.error('[TipTap upload]', err)
    return null
  }
}

export default function TipTapEditor({ content, onChange, placeholder = '내용을 입력하세요...' }: TipTapEditorProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  // 직통 업로드 버튼용 input
  const directUploadRef = useRef<HTMLInputElement>(null)
  // 본문 drop/paste 업로드 진행 상태
  const [uploadingInline, setUploadingInline] = useState(false)
  // editorProps 안에서 클로저로 직접 editor 변수를 못 잡으므로 ref 로 전달.
  // schema-safe 한 chain().insertContent() 호출에 필요.
  const editorRef = useRef<Editor | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          directions: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
          minWidth: 120,
          minHeight: 80,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-400 underline' },
      }),
      Placeholder.configure({ placeholder }),
      // 정렬 — paragraph/heading 에 text-align style 박음.
      // 게시물 페이지 prose CSS 가 [&_p[style*='text-align:_center']] 등으로 매칭해서 적용.
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        // prose : 라이트모드 기본 텍스트 / dark:prose-invert : 다크모드 흰색 계열
        // tailwindcss/typography 플러그인이 색상·간격·줄높이 자동 처리
        class:
          'prose dark:prose-invert prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none',
      },
      // 본문에 이미지 끌어다 놓으면 자동 업로드 + 삽입
      // ⚠️ view.state.tr.insert(pos, node) 직접 조작은 schema 위반(paragraph 안에 block image)
      //    상황에서 노드가 무시될 수 있음 → editor.chain().insertContent() 로 schema-safe 처리.
      handleDrop(view, event, _slice, moved) {
        if (moved) return false
        const dt = (event as DragEvent).dataTransfer
        if (!dt || !dt.files || dt.files.length === 0) return false
        const imageFiles = Array.from(dt.files).filter((f) => f.type.startsWith('image/'))
        if (imageFiles.length === 0) return false
        event.preventDefault()
        const coords = view.posAtCoords({ left: (event as DragEvent).clientX, top: (event as DragEvent).clientY })
        const dropPos = coords?.pos ?? view.state.selection.from
        ;(async () => {
          setUploadingInline(true)
          const ed = editorRef.current
          if (ed) {
            // 드롭 위치에 selection 박고 그 자리부터 순차 삽입
            ed.commands.setTextSelection(dropPos)
            for (const file of imageFiles) {
              const url = await uploadImageFile(file)
              if (url) {
                ed.chain()
                  .focus()
                  .insertContent({
                    type: 'image',
                    attrs: { src: url, alt: file.name },
                  })
                  .run()
              }
            }
          }
          setUploadingInline(false)
        })()
        return true
      },
      // 클립보드 이미지(스크린샷·복사된 이미지) 붙여넣기 — schema-safe insertContent 사용
      handlePaste(_view, event) {
        const items = event.clipboardData?.items
        if (!items) return false
        const imageFiles: File[] = []
        for (const item of Array.from(items)) {
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile()
            if (file) imageFiles.push(file)
          }
        }
        if (imageFiles.length === 0) return false
        event.preventDefault()
        ;(async () => {
          setUploadingInline(true)
          const ed = editorRef.current
          if (ed) {
            for (const file of imageFiles) {
              const url = await uploadImageFile(file)
              if (url) {
                ed.chain()
                  .focus()
                  .insertContent({
                    type: 'image',
                    attrs: { src: url, alt: file.name },
                  })
                  .run()
              }
            }
          }
          setUploadingInline(false)
        })()
        return true
      },
    },
  })

  // editor 인스턴스를 ref 에도 저장 — editorProps 핸들러에서 사용.
  // (useEditor 의 editorProps 는 정의 시점 클로저라 editor 변수를 직접 못 잡음)
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  const addImage = useCallback((selection: MediaSelection) => {
    if (!editor) return

    editor
      .chain()
      .focus()
      .setImage({ src: selection.url, alt: selection.altText })
      .run()
  }, [editor])

  const handleImageClick = () => setMediaPickerOpen(true)

  // 직통 업로드 — 파일 input 으로 선택한 이미지를 바로 본문에 삽입
  // (모달 안 거치고 가장 빠른 경로)
  const handleDirectUploadClick = () => directUploadRef.current?.click()
  const handleDirectUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    event.target.value = ''
    if (!files || files.length === 0 || !editor) return
    setUploadingInline(true)
    for (const file of Array.from(files)) {
      const url = await uploadImageFile(file)
      if (url) {
        editor.chain().focus().setImage({ src: url, alt: file.name }).run()
      }
    }
    setUploadingInline(false)
  }

  const imageAttrs = editor?.isActive('image') ? editor.getAttributes('image') : null
  const imageWidth = getImageWidth(imageAttrs?.width)

  const handleImageWidthChange = (value: string) => {
    const nextWidth = Number.parseInt(value, 10)
    if (!Number.isFinite(nextWidth)) {
      editor?.chain().focus().updateAttributes('image', { width: null, height: null }).run()
      return
    }

    editor
      ?.chain()
      .focus()
      .updateAttributes('image', { width: clampImageWidth(nextWidth), height: null })
      .run()
  }

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL을 입력하세요')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    // 외부 wrapper :
    //  - relative = sticky 자식의 컨테이닝 블록 보장
    //  - overflow-hidden 제거 (sticky 자식 차단 방지)
    //  - 자식들에 rounded 처리 (툴바 = rounded-t, 본문 = rounded-b)
    <div className="relative border border-gray-700 rounded-lg bg-gray-800">
      {/* 툴바 — main(scroll container) 상단에 고정.
          top-0 = scroll viewport 상단 기준
          z-30 = 본문 + 다른 sticky 요소 위
          bg-gray-900 = 불투명 (본문 위에 떠도 가독성 OK)
          isolate = 자체 stacking context 형성 → 다른 컴포넌트와 z-index 충돌 방지 */}
      <div className="sticky top-0 z-30 isolate flex flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-700 bg-gray-900 rounded-t-lg shadow-sm">
        <ToolBtn
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="H2"
        />
        <ToolBtn
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          label="H3"
        />
        <div className="w-px bg-gray-700 mx-1" />
        <ToolBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
          className="font-bold"
        />
        <ToolBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
          className="italic"
        />
        <ToolBtn
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          label="S"
          className="line-through"
        />
        <div className="w-px bg-gray-700 mx-1" />
        <ToolBtn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="• 목록"
        />
        <ToolBtn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="1. 목록"
        />
        <ToolBtn
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label="인용"
        />
        <div className="w-px bg-gray-700 mx-1" />
        {/* 정렬 — 본문 paragraph/heading 에 적용. 게시물에서도 그대로 보임 */}
        <ToolBtn
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          label="⇤"
        />
        <ToolBtn
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          label="↔"
        />
        <ToolBtn
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          label="⇥"
        />
        <ToolBtn
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          label="코드"
        />
        <div className="w-px bg-gray-700 mx-1" />
        <ToolBtn active={editor.isActive('link')} onClick={addLink} label="링크" />
        <ToolBtn active={false} onClick={handleImageClick} label="이미지" />
        {/* 직통 업로드 — 모달 안 거치고 파일 → 본문 삽입 */}
        <ToolBtn active={false} onClick={handleDirectUploadClick} label="↥ 업로드" />
        <input
          ref={directUploadRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleDirectUpload}
          className="hidden"
        />
        {editor.isActive('image') && (
          <>
            <div className="w-px bg-gray-700 mx-1" />
            <label className="flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
              W
              <input
                type="number"
                min={120}
                max={1200}
                value={imageWidth ?? ''}
                onChange={(event) => handleImageWidthChange(event.target.value)}
                placeholder="auto"
                className="h-5 w-16 bg-transparent text-right text-gray-100 placeholder-gray-600 focus:outline-none"
              />
              px
            </label>
          </>
        )}
        <div className="w-px bg-gray-700 mx-1" />
        <ToolBtn
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          label="↩"
        />
        <ToolBtn
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          label="↪"
        />
      </div>

      {/* 에디터 본문 — drop/paste 업로드 시 오버레이 표시 */}
      <div className="relative">
        <EditorContent editor={editor} />
        {uploadingInline && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-blue-500/10 backdrop-blur-[1px]">
            <div className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
              이미지 업로드 중…
            </div>
          </div>
        )}
      </div>

      {/* 본문에 끌어다 놓기·붙여넣기 안내 */}
      <p className="border-t border-gray-700 px-3 py-1.5 text-[11px] text-gray-500">
        💡 본문에 이미지를 <strong>드래그</strong>하거나 <strong>Cmd/Ctrl+V</strong>로 붙여넣으면 바로 업로드돼.
      </p>

      <MediaLibraryPicker
        isOpen={mediaPickerOpen}
        title="본문 이미지 선택"
        autoSelectOnUpload
        onClose={() => setMediaPickerOpen(false)}
        onSelect={addImage}
      />
    </div>
  )
}

function getImageWidth(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function clampImageWidth(value: number) {
  return Math.min(1200, Math.max(120, value))
}

function ToolBtn({
  active,
  onClick,
  label,
  className = '',
}: {
  active: boolean
  onClick: () => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-xs rounded transition-colors ${className} ${
        active
          ? 'bg-blue-600/30 text-blue-400'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

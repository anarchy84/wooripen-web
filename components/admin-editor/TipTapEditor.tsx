'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useState } from 'react'
import MediaLibraryPicker, { type MediaSelection } from '@/components/admin-editor/MediaLibraryPicker'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder = '내용을 입력하세요...' }: TipTapEditorProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

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
    },
  })

  const addImage = useCallback((selection: MediaSelection) => {
    if (!editor) return

    editor
      .chain()
      .focus()
      .setImage({ src: selection.url, alt: selection.altText })
      .run()
  }, [editor])

  const handleImageClick = () => setMediaPickerOpen(true)

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
        <ToolBtn
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          label="코드"
        />
        <div className="w-px bg-gray-700 mx-1" />
        <ToolBtn active={editor.isActive('link')} onClick={addLink} label="링크" />
        <ToolBtn active={false} onClick={handleImageClick} label="이미지" />
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

      {/* 에디터 본문 */}
      <EditorContent editor={editor} />

      <MediaLibraryPicker
        isOpen={mediaPickerOpen}
        title="본문 이미지 선택"
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

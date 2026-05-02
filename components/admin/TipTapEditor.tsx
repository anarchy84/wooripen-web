'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useRef } from 'react'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder = '내용을 입력하세요...' }: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
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
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none',
      },
    },
  })

  const addImage = useCallback(async (file: File) => {
    if (!editor) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''))

    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData })
      // 응답 본문을 미리 읽어서 디버깅에 활용
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        // 서버가 보낸 정확한 에러 메시지를 사용자에게 표시
        const msg = (data && typeof data.error === 'string') ? data.error : `HTTP ${res.status}`
        alert(`이미지 업로드 실패: ${msg}`)
        // 콘솔에도 전체 응답 남김 — 개발자 도구에서 확인 가능
        console.error('[image upload]', res.status, data)
        return
      }
      editor
        .chain()
        .focus()
        .setImage({ src: data.webp_path || data.storage_path, alt: data.alt_text })
        .run()
    } catch (err) {
      const msg = err instanceof Error ? err.message : '네트워크 오류'
      alert(`이미지 업로드 실패: ${msg}`)
      console.error('[image upload exception]', err)
    }
  }, [editor])

  const handleImageClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) addImage(file)
    e.target.value = ''
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

      {/* 숨겨진 파일 인풋 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
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

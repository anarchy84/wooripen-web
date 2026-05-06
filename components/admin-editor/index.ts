// ─────────────────────────────────────────────
// admin-editor — 어드민 본문 작성용 재사용 라이브러리
//
// 구성품 :
//   · TipTapEditor       — 본문 WYSIWYG (이미지·링크·코드블록 등)
//   · MediaLibraryPicker — Supabase Storage 미디어 선택 모달
//   · SeoPanel           — SEO 메타 + slug 미리보기 + 키워드 분석
//
// 의존 : @tiptap/* + @/lib/supabase/client
//        Supabase Storage 'public-content' 버킷 (편집 본문 이미지 저장소)
//
// 사용 예 :
//   import { TipTapEditor, MediaLibraryPicker, SeoPanel } from '@/components/admin-editor'
//
// ozlab 으로 이식 시 : 이 폴더 그대로 복사 + lib/supabase/client 만 맞추면 동작
// ─────────────────────────────────────────────

export { default as TipTapEditor } from './TipTapEditor'
export { default as MediaLibraryPicker } from './MediaLibraryPicker'
export type { MediaSelection } from './MediaLibraryPicker'
export { default as SeoPanel } from './SeoPanel'

// ─────────────────────────────────────────────
// page_meta.page_slug ↔ 실제 라우트 매핑 (서버·클라이언트 공용)
//
// lib/seo/page-meta.ts 는 'server-only' 라 클라이언트 컴포넌트
// (어드민 SEO 화면)에서 import 할 수 없어 이 파일로 분리한다.
//
// 슬러그는 짧은 논리값(cctv, terminal, torder)을 유지하고 경로만 매핑한다.
// DB 슬러그를 'business/cctv' 로 바꾸면 /api/admin/seo/[slug] 단일 세그먼트
// 라우트가 깨지므로 그 방향은 택하지 않았다.
// ─────────────────────────────────────────────

export const SLUG_TO_PATH: Record<string, string> = {
  home: '/',
  internet: '/internet',
  terminal: '/business/terminal',
  cctv: '/business/cctv',
  torder: '/business/torder',
  rental: '/rental',
  recommend: '/recommend',
  tips: '/tips',
  about: '/about',
}

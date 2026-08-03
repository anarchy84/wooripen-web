// ─────────────────────────────────────────────
// 어드민 권한 판정 — 단일 소스
//
// 배경 (2026-08-03) :
//   기존 어드민 API/미들웨어의 인가는 "로그인 되어 있는가"(`if (!user)`) 뿐이었다.
//   Supabase RLS 도 전 테이블이 `TO authenticated USING(true)` 패턴이라
//   "인증됨 = 어드민" 을 전제로 하고 있었는데, 프로젝트의 이메일 셀프가입이
//   열려 있어 그 전제가 깨져 있었다 (가입만 하면 어드민 권한).
//
//   → 셀프가입은 Supabase 대시보드에서 차단(disable_signup=true) 했고,
//     이 파일은 그 설정에만 의존하지 않도록 코드 레벨 allowlist 를 둔다.
//     (대시보드 설정은 언제든 되돌려질 수 있음 — 이중 방어)
//
// 설정 :
//   - ADMIN_USER_IDS  쉼표구분 uid 목록. 서버 전용 (NEXT_PUBLIC_ 접두사 금지)
//   - 미설정 시 아래 DEFAULT_ADMIN_USER_IDS 사용 → 환경변수 없이도 즉시 동작
//   - uid 는 비밀값이 아니라 식별자이므로 코드 상수로 둬도 무방
//
// ⚠️ 최종 방어선은 DB RLS 다. 이 파일과 함께
//    supabase/migrations/20260803120000_restrict_admin_write.sql 도 적용할 것.
// ─────────────────────────────────────────────

// ('server-only' 는 붙이지 않는다 — middleware.ts(Edge 런타임)에서도 import 하므로.
//  uid 는 비밀값이 아니라 클라 번들에 섞여도 무해하지만, 클라에서 import 하지 말 것.)
import type { User } from '@supabase/supabase-js'

// 우리편 어드민 계정 (Supabase Auth)
const DEFAULT_ADMIN_USER_IDS = ['b8420fbc-f9d3-485d-9e26-a98e79b1a0bf']

function adminUserIds(): string[] {
  const fromEnv = (process.env.ADMIN_USER_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_USER_IDS
}

/**
 * 어드민 여부 판정.
 * 기존 `if (!user)` 자리를 `if (!isAdmin(user))` 로 바꿔 쓰면 된다.
 *
 * 타입 가드로 선언한 이유 : 통과 후 `user` 가 non-null 로 좁혀져야
 * 기존 코드의 `user.id` 참조가 그대로 컴파일된다.
 */
export function isAdmin<T extends { id?: string } = User>(
  user: T | null | undefined
): user is T {
  if (!user?.id) return false
  return adminUserIds().includes(user.id)
}

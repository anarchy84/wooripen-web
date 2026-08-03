-- =============================================================
-- Migration: 20260803120000_restrict_admin_write
-- 어드민 쓰기 권한을 실제 어드민 uid 로 제한
-- =============================================================
-- 배경 :
--   기존 정책은 전 테이블이 "로그인만 했으면 쓰기 허용" 이었다.
--     scripts_write : FOR ALL USING (auth.role() = 'authenticated')
--   프로젝트 이메일 셀프가입이 열려 있어(2026-08-03 차단 완료)
--   "가입 → 로그인 → 어드민 권한" 이 성립하던 상태였다.
--
--   특히 scripts 테이블은 2026-08-03 배포로 공개 페이지 <head> 에
--   그대로 주입되기 시작해서(어드민 스크립트 렌더링 기능), 이 테이블 한 행이
--   곧 전 방문자 브라우저에서 실행되는 JS 가 됐다 → 저장형 XSS 경로.
--
--   셀프가입 차단은 대시보드 설정이라 언제든 되돌려질 수 있으므로
--   DB 레벨에서도 uid 를 고정한다 (코드 lib/auth-admin.ts 와 이중 방어).
--
-- 적용 전 확인 :
--   select policyname, roles, cmd, qual, with_check
--   from pg_policies where tablename = 'scripts';
-- =============================================================

-- -------------------------------------------------------------
-- 어드민 uid 판정 함수 — 정책에서 공통 사용
-- 어드민 계정이 바뀌면 이 함수만 교체하면 된다.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = 'b8420fbc-f9d3-485d-9e26-a98e79b1a0bf'::uuid;
$$;

-- -------------------------------------------------------------
-- scripts : 읽기는 공개 유지(공개 페이지 주입에 anon 키로 필요),
--           단 활성 행만 노출. 쓰기는 어드민 uid 로 제한.
-- -------------------------------------------------------------
DROP POLICY IF EXISTS scripts_read ON public.scripts;
DROP POLICY IF EXISTS scripts_write ON public.scripts;

-- 공개 읽기 — 비활성 스크립트는 숨긴다 (기존 qual 은 true 였음)
CREATE POLICY scripts_read ON public.scripts
  FOR SELECT
  USING (is_active = true);

-- 어드민 읽기 — 어드민 화면은 비활성 행도 봐야 함
CREATE POLICY scripts_read_admin ON public.scripts
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- 쓰기 — 어드민 uid 만
CREATE POLICY scripts_write ON public.scripts
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================
-- ⚠️ 아래는 같은 문제를 가진 나머지 테이블들이다.
--    이번 배포 범위(scripts)와 분리해 두었으니, 어드민 동작을 확인한 뒤
--    주석을 풀고 단계적으로 적용할 것.
--    (한 번에 전부 바꿨다가 어드민이 잠기면 롤백이 번거롭다)
-- =============================================================
--
-- DROP POLICY IF EXISTS content_blocks_auth_write ON public.content_blocks;
-- CREATE POLICY content_blocks_auth_write ON public.content_blocks
--   FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
--
-- DROP POLICY IF EXISTS faqs_admin_all ON public.faqs;
-- CREATE POLICY faqs_admin_all ON public.faqs
--   FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
--
-- DROP POLICY IF EXISTS packages_admin_all ON public.packages;
-- CREATE POLICY packages_admin_all ON public.packages
--   FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
--
-- DROP POLICY IF EXISTS nav_menus_admin_all ON public.nav_menus;
-- CREATE POLICY nav_menus_admin_all ON public.nav_menus
--   FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
--
-- ※ consultations(상담 리드 — 이름·연락처 개인정보) 의 SELECT 정책도
--   'authenticated 이면 전체 열람' 이라면 같은 방식으로 좁힐 것.
--   확인: select policyname, cmd, qual from pg_policies where tablename='consultations';

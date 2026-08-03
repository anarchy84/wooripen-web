// ─────────────────────────────────────────────
// InjectedScripts — 어드민 등록 스크립트를 실제 페이지에 주입
//
// 동작 :
//   - scripts 테이블의 code 필드(HTML 조각)를 파싱해서
//     · <script src=...>        → next/script <Script src>
//     · <script>인라인 코드</script> → next/script 인라인 (afterInteractive)
//     · 그 외 조각(<noscript> 등)  → display:contents 래퍼로 원문 출력
//   - next/script afterInteractive 는 렌더 위치와 무관하게 하이드레이션 직후
//     문서에 주입된다 (GTM 은 Google/Next 공식 권장 방식이 이 전략).
//     position='head' 도 계측상 동일하게 동작하므로 별도 head 삽입은 하지 않는다.
//   - <noscript> 같은 HTML 조각은 물리적 위치가 의미 있으므로 (GTM iframe 등)
//     layout 에서 body_start / body_end 자리에 이 컴포넌트를 각각 배치한다.
//
// 주의 :
//   - 어드민이 등록한 코드를 그대로 실행하는 구조다. 쓰기 API 는 인증 필수이며
//     (app/api/admin/scripts/*), 어드민 계정 보안이 곧 이 주입 경로의 보안이다.
//   - 인라인 스크립트는 최초 전체 로드에서 1회 실행 (SPA 라우팅 시 재실행 안 됨).
//     GTM 은 1회 로드가 정상이고, 가상 페이지뷰는 lib/gtm.ts firePageView +
//     GTM History Change 트리거로 커버한다.
// ─────────────────────────────────────────────

import Script from 'next/script'
import type { Script as ScriptRow } from '@/types/database'

type Chunk =
  | { kind: 'src'; src: string }
  | { kind: 'inline'; js: string }
  | { kind: 'html'; html: string }

// code 필드를 <script> 블록 / 나머지 HTML 조각으로 분해
function parseCode(code: string): Chunk[] {
  const chunks: Chunk[] = []
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    const before = code.slice(last, m.index).trim()
    if (before) chunks.push({ kind: 'html', html: before })

    const attrs = m[1] || ''
    const srcMatch = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)
    if (srcMatch) {
      chunks.push({ kind: 'src', src: srcMatch[1] })
    } else if (m[2].trim()) {
      chunks.push({ kind: 'inline', js: m[2] })
    }
    last = m.index + m[0].length
  }
  const rest = code.slice(last).trim()
  if (rest) chunks.push({ kind: 'html', html: rest })
  return chunks
}

interface Props {
  scripts: ScriptRow[]
  /** 이 렌더 위치에서 출력할 position 값들 (head 스크립트는 body_start 자리에서 함께 처리) */
  positions: ScriptRow['position'][]
}

export default function InjectedScripts({ scripts, positions }: Props) {
  const rows = scripts.filter((s) => positions.includes(s.position))
  if (rows.length === 0) return null

  return (
    <>
      {rows.map((row) =>
        parseCode(row.code).map((chunk, i) => {
          const key = `injected-${row.id}-${i}`
          if (chunk.kind === 'src') {
            return <Script key={key} id={key} src={chunk.src} strategy="afterInteractive" />
          }
          if (chunk.kind === 'inline') {
            return (
              <Script
                key={key}
                id={key}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: chunk.js }}
              />
            )
          }
          // <noscript> 등 비스크립트 조각 — 레이아웃에 영향 없게 display:contents
          return (
            <div
              key={key}
              style={{ display: 'contents' }}
              dangerouslySetInnerHTML={{ __html: chunk.html }}
            />
          )
        })
      )}
    </>
  )
}

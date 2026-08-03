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
//     GTM 컨테이너 로드는 1회가 정상이며, 이후 소프트 내비게이션 페이지뷰는
//     components/layout/RouteTracker.tsx 가 dataLayer 에 page_view 를 push 해 커버한다.
//     (GTM 컨테이너에서 page_view 커스텀 이벤트를 트리거로 쓸 것.
//      History Change 트리거를 병용하면 페이지뷰가 이중 계측되니 한쪽만 사용)
// ─────────────────────────────────────────────

import Script from 'next/script'
import type { Script as ScriptRow } from '@/types/database'

type Chunk =
  | { kind: 'src'; src: string; attrs: Record<string, string> }
  | { kind: 'inline'; js: string; attrs: Record<string, string> }
  | { kind: 'html'; html: string }

// next/script 가 자체적으로 다루는 속성 — 그대로 넘기면 충돌하므로 제외
const RESERVED_ATTRS = new Set(['src', 'type', 'strategy', 'id', 'dangerouslysetinnerhtml'])

// 브라우저가 JS 로 실행하는 type 만 허용 (HTML 표준의 classic script type)
// application/ld+json, text/template, importmap 등은 실행 대상이 아니다.
const EXECUTABLE_TYPES = new Set([
  '',
  'text/javascript',
  'application/javascript',
  'text/ecmascript',
  'application/ecmascript',
  'module',
])

// 태그의 속성 문자열을 파싱 — 따옴표 있는/없는 값 모두 처리
function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    const name = m[1].toLowerCase()
    attrs[name] = m[2] ?? m[3] ?? m[4] ?? ''
  }
  return attrs
}

// HTML 주석 구간 [시작, 끝) 목록 — 주석 안의 <script> 는 실행 대상이 아니다
function commentRanges(code: string): [number, number][] {
  const ranges: [number, number][] = []
  let i = 0
  while ((i = code.indexOf('<!--', i)) !== -1) {
    const end = code.indexOf('-->', i + 4)
    if (end === -1) {
      ranges.push([i, code.length])
      break
    }
    ranges.push([i, end + 3])
    i = end + 3
  }
  return ranges
}

// code 필드를 <script> 블록 / 나머지 HTML 조각으로 분해.
// 속성을 보존하고(SRI integrity 등), 실행 대상이 아닌 것은 원문으로 남긴다.
function parseCode(code: string): Chunk[] {
  const chunks: Chunk[] = []
  const comments = commentRanges(code)
  const inComment = (idx: number) => comments.some(([s, e]) => idx >= s && idx < e)

  // 속성값에 > 가 들어갈 수 있으므로 [^>]* 대신 따옴표를 인식하는 패턴 사용
  const re = /<script((?:"[^"]*"|'[^']*'|[^>])*)>([\s\S]*?)<\/script\s*>/gi
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    // 주석 안의 script 는 브라우저도 실행하지 않으므로 html 조각으로 흘려보낸다
    if (inComment(m.index)) continue

    const before = code.slice(last, m.index).trim()
    if (before) chunks.push({ kind: 'html', html: before })

    const parsed = parseAttrs(m[1] || '')
    const type = (parsed.type ?? '').trim().toLowerCase()
    const passthrough = Object.fromEntries(
      Object.entries(parsed).filter(([k]) => !RESERVED_ATTRS.has(k))
    )

    if (!EXECUTABLE_TYPES.has(type)) {
      // ld+json 등 — 실행하지 말고 원문 그대로 출력
      chunks.push({ kind: 'html', html: m[0] })
    } else if (parsed.src) {
      chunks.push({ kind: 'src', src: parsed.src, attrs: passthrough })
    } else if (m[2].trim()) {
      chunks.push({ kind: 'inline', js: m[2], attrs: passthrough })
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
          // key/id 는 position 까지 포함 — 같은 row 가 두 위치에서 렌더돼도 충돌 없음
          const key = `injected-${row.position}-${row.id}-${i}`
          if (chunk.kind === 'src') {
            return (
              <Script
                key={key}
                id={key}
                src={chunk.src}
                strategy="afterInteractive"
                {...chunk.attrs}
              />
            )
          }
          if (chunk.kind === 'inline') {
            return (
              <Script
                key={key}
                id={key}
                strategy="afterInteractive"
                {...chunk.attrs}
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

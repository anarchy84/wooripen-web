// ─────────────────────────────────────────────
// 어드민 — Core Web Vitals 모니터링 대시보드
//
// 실제 사용자(real-user) 측정값 누적을 보여줌.
//   · KPI 카드 5개 (LCP/CLS/INP/FCP/TTFB) — 최근 7일 p75
//   · 라우트별 LCP 표 — 어떤 페이지가 가장 느린지
//   · 등급 분포 (good / needs-improvement / poor)
//
// SSR 페이지 — RLS 의 web_vitals_admin_select 정책으로 인증된 admin 만 조회 가능.
// 데이터 없을 때 (배포 직후) 안내 메시지.
// ─────────────────────────────────────────────
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface VitalRow {
  metric: string
  value: number
  rating: string | null
  page_path: string
  created_at: string
}

// p75 계산 — 정렬 후 상위 25% 위치 값
function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * p))
  return sorted[idx]
}

// 메트릭 임계값 (Google 권장)
//   LCP : <2500 good / <4000 needs / >=4000 poor (ms)
//   CLS : <0.1  good / <0.25  needs / >=0.25 poor
//   INP : <200  good / <500   needs / >=500  poor (ms)
//   FCP : <1800 good / <3000  needs / >=3000 poor (ms)
//   TTFB: <800  good / <1800  needs / >=1800 poor (ms)
const THRESHOLDS: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
}

function rateOf(metric: string, p75: number): 'good' | 'needs-improvement' | 'poor' {
  const t = THRESHOLDS[metric]
  if (!t) return 'good'
  if (p75 < t[0]) return 'good'
  if (p75 < t[1]) return 'needs-improvement'
  return 'poor'
}

function formatValue(metric: string, v: number) {
  if (metric === 'CLS') return v.toFixed(3)
  return `${Math.round(v)}ms`
}

export default async function WebVitalsAdminPage() {
  const supabase = createClient()

  // 최근 7일 데이터
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: rows, error } = await supabase
    .from('web_vitals')
    .select('metric, value, rating, page_path, created_at')
    .gte('created_at', sevenDaysAgo)
    .limit(50000)

  const allRows = (rows ?? []) as VitalRow[]

  // 메트릭별 p75
  const metrics: Array<keyof typeof THRESHOLDS> = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB']
  const p75ByMetric = Object.fromEntries(
    metrics.map((m) => {
      const values = allRows.filter((r) => r.metric === m).map((r) => r.value)
      return [m, { p75: percentile(values, 0.75), count: values.length }]
    })
  ) as Record<string, { p75: number; count: number }>

  // 라우트별 LCP p75 — 가장 느린 10개
  const lcpByPath = new Map<string, number[]>()
  for (const r of allRows) {
    if (r.metric !== 'LCP') continue
    const arr = lcpByPath.get(r.page_path) ?? []
    arr.push(r.value)
    lcpByPath.set(r.page_path, arr)
  }
  const slowestPaths = [...lcpByPath.entries()]
    .map(([path, vals]) => ({ path, p75: percentile(vals, 0.75), count: vals.length }))
    .filter((e) => e.count >= 5)             // 표본 5건 이상만
    .sort((a, b) => b.p75 - a.p75)
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Web Vitals</h1>
          <p className="text-sm text-gray-400 mt-1">
            실제 사용자 측정 — 최근 7일 (총 {allRows.length.toLocaleString()}개 데이터)
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/40 p-4 text-sm text-red-300">
          데이터 조회 실패: {error.message}
        </div>
      )}

      {/* 데이터 없을 때 */}
      {allRows.length === 0 && !error && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
          <p className="text-gray-300">아직 측정 데이터가 없어요.</p>
          <p className="text-sm text-gray-500 mt-2">
            방문자가 페이지를 열면 자동으로 LCP/CLS/INP/FCP/TTFB 가 수집됩니다.
            보통 첫 24시간 안에 의미있는 표본이 모입니다.
          </p>
        </div>
      )}

      {/* KPI 카드 5개 */}
      {allRows.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {metrics.map((m) => {
            const { p75, count } = p75ByMetric[m]
            const rate = rateOf(m, p75)
            const color =
              rate === 'good'
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5'
                : rate === 'needs-improvement'
                ? 'text-amber-400 border-amber-500/30 bg-amber-500/5'
                : 'text-red-400 border-red-500/30 bg-red-500/5'
            return (
              <div key={m} className={`rounded-xl border p-4 ${color}`}>
                <div className="text-xs uppercase tracking-wider opacity-80">{m}</div>
                <div className="mt-1 text-2xl font-bold">
                  {count > 0 ? formatValue(m, p75) : '—'}
                </div>
                <div className="mt-1 text-[11px] opacity-70">
                  p75 · n={count.toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 가장 느린 라우트 */}
      {slowestPaths.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-medium text-white">가장 느린 라우트 (LCP p75)</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              표본 5건 이상인 경로만 노출. 빨간 페이지부터 LCP 개선 후보.
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-900/80 text-gray-400 text-xs">
              <tr>
                <th className="px-4 py-2 text-left">경로</th>
                <th className="px-4 py-2 text-right">LCP p75</th>
                <th className="px-4 py-2 text-right">표본</th>
                <th className="px-4 py-2 text-center">등급</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {slowestPaths.map((row) => {
                const r = rateOf('LCP', row.p75)
                const badge =
                  r === 'good'
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : r === 'needs-improvement'
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'bg-red-500/15 text-red-300'
                return (
                  <tr key={row.path} className="text-gray-200">
                    <td className="px-4 py-2 font-mono text-xs">{row.path}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {Math.round(row.p75)}ms
                    </td>
                    <td className="px-4 py-2 text-right text-gray-400 tabular-nums">
                      {row.count}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] ${badge}`}>
                        {r === 'good' ? '양호' : r === 'needs-improvement' ? '개선 필요' : '나쁨'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-xs text-gray-500 leading-relaxed">
        측정 기준은 <a href="https://web.dev/articles/vitals" className="underline" target="_blank" rel="noreferrer">Google web.dev Vitals</a> 가이드라인을 따릅니다.
        LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1 이 양호 기준.
      </div>
    </div>
  )
}

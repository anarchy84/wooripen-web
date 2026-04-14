'use client'

import { useMemo } from 'react'

interface SeoPanelProps {
  title: string
  seoTitle: string
  seoDescription: string
  slug: string
  content: string
  focusKeyword: string
  onFocusKeywordChange: (kw: string) => void
}

interface CheckItem {
  label: string
  pass: boolean
  info: string
}

export default function SeoPanel({
  title,
  seoTitle,
  seoDescription,
  slug,
  content,
  focusKeyword,
  onFocusKeywordChange,
}: SeoPanelProps) {
  // 표시될 제목/설명
  const displayTitle = seoTitle || title || '제목 없음'
  const displayDesc = seoDescription || '설명을 입력하세요...'
  const displayUrl = `wooripen.co.kr/tips/${slug || '...'}`

  // 순수 텍스트 추출 (HTML 태그 제거)
  const plainContent = useMemo(() => content.replace(/<[^>]*>/g, ''), [content])

  // SEO 체크 항목 계산
  const checks = useMemo((): CheckItem[] => {
    const kw = focusKeyword.trim().toLowerCase()
    if (!kw) return []

    const titleLower = title.toLowerCase()
    const contentLower = plainContent.toLowerCase()
    const descLower = (seoDescription || '').toLowerCase()

    // 키워드 밀도
    const words = contentLower.split(/\s+/).filter(Boolean).length
    const kwCount = contentLower.split(kw).length - 1
    const density = words > 0 ? ((kwCount / words) * 100) : 0

    // 첫 문단 (150자)
    const firstParagraph = contentLower.substring(0, 150)

    // 이미지 alt 체크
    const imgAlts = content.match(/alt="([^"]*)"/gi) || []
    const hasKwInAlt = imgAlts.some((a) => a.toLowerCase().includes(kw))
    const hasImages = /<img\s/i.test(content)

    // H2 체크
    const hasH2 = /<h[23]/i.test(content)

    // 내부 링크
    const hasInternalLink = /href=["']\//.test(content) || /href=["']https?:\/\/(www\.)?wooripen/.test(content)

    return [
      {
        label: '제목(H1)에 키워드 포함',
        pass: titleLower.includes(kw),
        info: titleLower.includes(kw) ? '제목에 키워드가 포함되어 있습니다.' : '제목에 포커스 키워드를 포함하세요.',
      },
      {
        label: '첫 문단에 키워드 포함',
        pass: firstParagraph.includes(kw),
        info: firstParagraph.includes(kw) ? '첫 문단에 키워드가 있습니다.' : '글의 도입부(150자 이내)에 키워드를 넣으세요.',
      },
      {
        label: `키워드 밀도 (${density.toFixed(1)}%)`,
        pass: density >= 0.5 && density <= 3,
        info: density < 0.5 ? '키워드를 더 사용하세요 (0.5~3% 권장).' : density > 3 ? '키워드 사용이 과도합니다.' : '적절한 밀도입니다.',
      },
      {
        label: '메타 설명에 키워드 포함',
        pass: descLower.includes(kw),
        info: descLower.includes(kw) ? '메타 설명에 키워드가 포함되어 있습니다.' : '메타 설명에 키워드를 포함하세요.',
      },
      {
        label: '소제목(H2/H3) 사용',
        pass: hasH2,
        info: hasH2 ? '소제목을 사용하고 있습니다.' : '글 구조화를 위해 H2/H3 소제목을 사용하세요.',
      },
      {
        label: '이미지 alt 태그에 키워드',
        pass: !hasImages || hasKwInAlt,
        info: !hasImages ? '이미지가 없습니다. 이미지를 추가하면 SEO에 도움이 됩니다.' : hasKwInAlt ? 'alt 태그에 키워드가 포함되어 있습니다.' : '이미지 alt 태그에 키워드를 포함하세요.',
      },
      {
        label: '내부 링크 포함',
        pass: hasInternalLink,
        info: hasInternalLink ? '내부 링크가 있습니다.' : '다른 페이지로의 내부 링크를 추가하세요.',
      },
    ]
  }, [focusKeyword, title, plainContent, seoDescription, content])

  // SEO 점수
  const score = useMemo(() => {
    if (checks.length === 0) return 0
    const passed = checks.filter((c) => c.pass).length
    return Math.round((passed / checks.length) * 100)
  }, [checks])

  const scoreColor = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'
  const scoreEmoji = score >= 70 ? '🟢' : score >= 40 ? '🟡' : '🔴'

  // 글자 수 체크
  const titleLen = displayTitle.length
  const descLen = displayDesc.length
  const titleOk = titleLen >= 30 && titleLen <= 60
  const descOk = descLen >= 120 && descLen <= 160

  return (
    <div className="space-y-4">
      {/* 검색 미리보기 */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">검색 미리보기</h3>
        <div className="bg-white rounded-lg p-3">
          <p className="text-blue-700 text-base font-medium leading-snug truncate">
            {displayTitle}
          </p>
          <p className="text-green-700 text-xs mt-0.5">{displayUrl}</p>
          <p className="text-gray-600 text-xs mt-1 line-clamp-2">{displayDesc}</p>
        </div>
        <div className="flex gap-4 mt-1.5 text-xs">
          <span className={titleOk ? 'text-emerald-400' : 'text-amber-400'}>
            제목 {titleLen}자 {titleOk ? '✓' : '(30~60자 권장)'}
          </span>
          <span className={descOk ? 'text-emerald-400' : 'text-amber-400'}>
            설명 {descLen}자 {descOk ? '✓' : '(120~160자 권장)'}
          </span>
        </div>
      </div>

      {/* 포커스 키워드 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">포커스 키워드</label>
        <input
          type="text"
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          placeholder="예: 사업자 인터넷"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* SEO 점수 */}
      {focusKeyword.trim() && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-lg">{scoreEmoji}</span>
            <span className={`text-2xl font-bold ${scoreColor}`}>{score}</span>
            <span className="text-sm text-gray-400">/ 100</span>
          </div>

          {/* 체크 항목 */}
          <div className="space-y-1.5">
            {checks.map((check) => (
              <div key={check.label} className="flex items-start gap-2">
                <span className="text-sm mt-0.5">{check.pass ? '✅' : '⚠️'}</span>
                <div>
                  <p className="text-sm text-gray-300">{check.label}</p>
                  <p className="text-xs text-gray-500">{check.info}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* OG 미리보기 */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">카카오톡 미리보기</h3>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="h-32 bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
            OG 이미지
          </div>
          <div className="p-2.5">
            <p className="text-xs text-gray-500">wooripen.co.kr</p>
            <p className="text-sm text-white font-medium truncate">{displayTitle}</p>
            <p className="text-xs text-gray-400 line-clamp-1">{displayDesc}</p>
          </div>
        </div>
      </div>

      {/* 본문 통계 */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">본문 통계</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800 rounded-lg p-2">
            <span className="text-gray-500">글자 수</span>
            <p className="text-white font-medium">{plainContent.length.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2">
            <span className="text-gray-500">단어 수</span>
            <p className="text-white font-medium">{plainContent.split(/\s+/).filter(Boolean).length.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

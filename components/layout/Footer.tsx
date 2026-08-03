import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// ─────────────────────────────────────────────
// 사업자정보 표시 (2026-08-03 추가)
//
// 전자상거래법상 상호·대표자·사업자등록번호·주소·통신판매업 신고번호는
// 이용자가 쉽게 볼 수 있는 곳에 표시해야 한다. 기존 푸터엔 이 블록이 아예 없었고,
// 실제 값은 lib/seo/structured-data.tsx 의 JSON-LD 와 llms.txt 에만 있어
// 기계에게만 노출되고 사람 눈에는 보이지 않는 상태였다.
//
// 값 우선순위 : site_settings(어드민 입력) > 아래 상수(structured-data 와 동일 출처)
// 대표자명(ceo_name)은 코드·DB 어디에도 없어 어드민 입력 전까지 표시하지 않는다.
// ─────────────────────────────────────────────
const BUSINESS_DEFAULTS: Record<string, string> = {
  company_name: '우리편',
  business_number: '197-86-03789',
  address: '서울특별시 강서구 공항대로 209, 507-509호',
  phone: '1600-6116',
  email: 'ourteam.kr@gmail.com',
}

const BUSINESS_KEYS = [
  'company_name', 'ceo_name', 'business_number',
  'address', 'phone', 'email', 'ecommerce_license', 'footer_notice',
]

async function getBusinessInfo(): Promise<Record<string, string>> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', BUSINESS_KEYS)

    const map: Record<string, string> = { ...BUSINESS_DEFAULTS }
    ;(data as { key: string; value: string | null }[] | null)?.forEach((row) => {
      if (row.value?.trim()) map[row.key] = row.value.trim()
    })
    return map
  } catch {
    // 조회 실패해도 푸터는 떠야 한다
    return { ...BUSINESS_DEFAULTS }
  }
}

const footerLinks = {
  서비스: [
    { name: '인터넷', href: '/internet' },
    { name: '결제단말기', href: '/business/terminal' },
    { name: 'CCTV', href: '/business/cctv' },
    { name: '키오스크·티오더', href: '/business/torder' },
    { name: '렌탈', href: '/rental' },
  ],
  고객지원: [
    { name: '맞춤 추천', href: '/recommend' },
    { name: '꿀팁', href: '/tips' },
    { name: 'Q&A', href: '/qna' },
  ],
  회사: [
    { name: '회사소개', href: '/about' },
    { name: '개인정보처리방침', href: '/privacy' },
    { name: '이용약관', href: '/terms' },
  ],
}

export default async function Footer() {
  const biz = await getBusinessInfo()

  // 값이 있는 항목만 노출 (대표자명 등 미입력 항목은 생략)
  const bizItems: [string, string | undefined][] = [
    ['상호', biz.company_name],
    ['대표', biz.ceo_name],
    ['사업자등록번호', biz.business_number],
    ['통신판매업신고', biz.ecommerce_license],
    ['주소', biz.address],
    ['대표전화', biz.phone],
    ['이메일', biz.email],
  ]

  return (
    <footer className="border-t border-gray-100">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* 브랜드 */}
          <div className="col-span-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">우리편</span>
            <p className="mt-4 text-caption text-gray-500 leading-relaxed max-w-xs">
              소상공인 편에 서는 유일한 파트너.
              <br />
              인터넷·단말기·CCTV를 한번에.
            </p>
            <div className="mt-6">
              <a
                href="tel:1600-6116"
                className="text-body-2 font-semibold text-gray-900 hover:text-primary transition-colors"
              >
                1600-6116
              </a>
              <p className="mt-1 text-small text-gray-400">평일 09:00 - 18:00</p>
            </div>
          </div>

          {/* 링크 */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-small font-semibold text-gray-900 mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-caption text-gray-500 hover:text-gray-900 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 사업자정보 — 전자상거래법 표시의무 */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <dl className="flex flex-wrap gap-x-5 gap-y-1.5 text-small text-gray-400">
            {bizItems
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="text-gray-500">{value}</dd>
                </div>
              ))}
          </dl>
          {biz.footer_notice && (
            <p className="mt-3 text-small text-gray-400 whitespace-pre-wrap break-keep">
              {biz.footer_notice}
            </p>
          )}
        </div>

        {/* 하단 */}
        <div className="mt-8 pt-8 border-t border-gray-100
                        flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-small text-gray-400">
            &copy; {new Date().getFullYear()} 우리편. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-small text-gray-400 hover:text-gray-600 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-small text-gray-400 hover:text-gray-600 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

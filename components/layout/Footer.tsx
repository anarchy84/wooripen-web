import Link from 'next/link'

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

export default function Footer() {
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

        {/* 하단 */}
        <div className="mt-16 pt-8 border-t border-gray-100
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

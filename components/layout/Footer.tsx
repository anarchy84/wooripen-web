import Link from 'next/link'

const footerLinks = {
  서비스: [
    { name: '인터넷 가입', href: '/internet' },
    { name: '결제단말기', href: '/business/terminal' },
    { name: 'CCTV', href: '/business/cctv' },
    { name: '티오더', href: '/business/torder' },
  ],
  고객지원: [
    { name: '자주 묻는 질문', href: '/faq' },
    { name: '꿀팁 게시판', href: '/tips' },
    { name: '사업자 최대혜택', href: '/recommend' },
  ],
  회사: [
    { name: '개인정보처리방침', href: '/privacy' },
    { name: '이용약관', href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div>
            <span className="text-2xl font-bold text-white">우리편</span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              소상공인 편에 서는 유일한 파트너.
              <br />
              인터넷·단말기·CCTV를 한번에.
            </p>
            <p className="mt-4 text-sm">
              <span className="text-white font-semibold">상담 전화</span>{' '}
              <a href="tel:1234-5678" className="text-secondary hover:text-secondary-50">
                1234-5678
              </a>
            </p>
          </div>

          {/* 링크 섹션 */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} 우리편. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

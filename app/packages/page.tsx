// 소상공인 패키지 허브 페이지
// packages 테이블에서 is_visible=true 항목을 카드 리스트로 보여줌
// SSR — 검색엔진 크롤링 + 첫 로딩 속도 확보

import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@iconify/react'

export const metadata: Metadata = {
  title: '소상공인 맞춤 패키지 | 우리편',
  description:
    '업종별·상황별 맞춤 패키지로 인터넷, 결제단말기, CCTV, 키오스크, 렌탈을 한 번에 해결하세요. 무료 상담으로 최적 조합을 추천받으세요.',
  openGraph: {
    title: '소상공인 맞춤 패키지 | 우리편',
    description:
      '업종별 맞춤 패키지로 매장 운영에 필요한 모든 것을 한 번에. 무료 상담 신청하세요.',
  },
}

// 패키지 목록 조회
async function getPackages() {
  const supabase = createClient()
  const { data } = await supabase
    .from('packages')
    .select('id, slug, name, target_industry, target_description, icon, hook_copy, price_range_label, sort_order')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  return data || []
}

export default async function PackagesPage() {
  const packages = await getPackages()

  return (
    <div className="min-h-screen bg-white">
      {/* ─── 히어로 ─────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)' }}
      >
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full mb-6 backdrop-blur">
            소상공인 맞춤 패키지
          </span>
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6 break-keep">
            매장에 필요한 건<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              한 번에 해결
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8 break-keep">
            인터넷, 결제단말기, CCTV, 키오스크, 렌탈까지.
            업종과 상황에 맞는 패키지로 비용은 줄이고, 편의는 높이세요.
          </p>
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            무료 맞춤 상담 받기
            <Icon icon="solar:arrow-right-line-duotone" className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── 패키지 카드 리스트 ─────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">업종별 맞춤 패키지</h2>
            <p className="text-gray-500">사장님의 업종과 상황에 딱 맞는 조합을 골라보세요</p>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Icon icon="solar:box-line-duotone" className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>준비 중인 패키지입니다. 곧 만나보실 수 있어요!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="group block p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* 아이콘 + 업종 태그 */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{pkg.icon || '📦'}</span>
                    {pkg.target_industry && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        {pkg.target_industry} 전용
                      </span>
                    )}
                  </div>

                  {/* 패키지명 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {pkg.name}
                  </h3>

                  {/* 훅 카피 */}
                  {pkg.hook_copy && (
                    <p className="text-sm text-gray-600 mb-4 break-keep leading-relaxed">
                      {pkg.hook_copy}
                    </p>
                  )}

                  {/* 대상 설명 */}
                  {pkg.target_description && (
                    <p className="text-xs text-gray-400 mb-4">
                      👤 {pkg.target_description}
                    </p>
                  )}

                  {/* 하단: 가격 + 화살표 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {pkg.price_range_label ? (
                      <span className="text-sm font-semibold text-blue-600">
                        {pkg.price_range_label}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">상담 후 안내</span>
                    )}
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                      <Icon
                        icon="solar:arrow-right-line-duotone"
                        className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 왜 패키지? 혜택 섹션 ─────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">왜 패키지로 묶어야 할까요?</h2>
            <p className="text-gray-500">따로따로 계약하는 것보다 좋은 이유</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Icon icon="solar:wallet-money-bold-duotone" className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">비용 절감</h3>
              <p className="text-sm text-gray-600 break-keep">
                개별 계약보다 묶음 할인이 적용되어 평균 20~40% 비용이 절감됩니다.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                <Icon icon="solar:clock-circle-bold-duotone" className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">시간 절약</h3>
              <p className="text-sm text-gray-600 break-keep">
                인터넷, 단말기, CCTV를 각각 알아볼 필요 없이 한 번 상담으로 끝.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Icon icon="solar:shield-check-bold-duotone" className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">통합 A/S</h3>
              <p className="text-sm text-gray-600 break-keep">
                문제 생기면 우리편 하나로 해결. 여러 업체에 따로 연락할 필요 없어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 하단 CTA ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900 to-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
            어떤 패키지가 맞는지 모르겠다면?
          </h3>
          <p className="text-white/70 mb-8 break-keep">
            매장 상황을 말씀해주시면, 전문 상담사가 딱 맞는 조합을 추천해드립니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/recommend"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              무료 상담 신청
            </Link>
            <a
              href="tel:1600-6116"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur transition-colors"
            >
              📞 1600-6116
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

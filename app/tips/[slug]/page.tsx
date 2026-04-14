import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('tips')
    .select('title, seo_title, seo_description, featured_image_url, excerpt')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!data) return { title: '글을 찾을 수 없습니다' }

  return {
    title: data.seo_title || data.title,
    description: data.seo_description || data.excerpt || '',
    openGraph: {
      title: data.seo_title || data.title,
      description: data.seo_description || data.excerpt || '',
      images: data.featured_image_url ? [data.featured_image_url] : [],
    },
  }
}

export default async function TipDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: tip } = await supabase
    .from('tips')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!tip) notFound()

  // 조회수 증가 (비동기, 에러 무시)
  supabase
    .from('tips')
    .update({ view_count: (tip.view_count || 0) + 1 })
    .eq('id', tip.id)
    .then(() => {})

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 히어로 */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/tips" className="text-teal-400 text-sm hover:underline mb-4 inline-block">
            ← 꿀팁 목록
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-400 text-xs font-medium rounded-full">
              {tip.category}
            </span>
            {tip.tags?.map((tag: string) => (
              <span key={tag} className="text-xs text-gray-500">#{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            {tip.title}
          </h1>

          {tip.excerpt && (
            <p className="text-lg text-gray-400 mb-6">{tip.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <time>
              {tip.published_at
                ? new Date(tip.published_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
                : ''}
            </time>
            <span>·</span>
            <span>조회 {tip.view_count?.toLocaleString() || 0}</span>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <article className="max-w-3xl mx-auto px-4 pb-20">
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:border prose-img:border-gray-800
            prose-blockquote:border-teal-500 prose-blockquote:text-gray-400
            prose-code:text-teal-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800"
          dangerouslySetInnerHTML={{ __html: tip.content }}
        />

        {/* 하단 CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-white mb-2">도움이 되셨나요?</h3>
          <p className="text-gray-400 mb-6">우리편 전문 상담사가 매장에 딱 맞는 솔루션을 추천해드립니다.</p>
          <Link
            href="/#consultation"
            className="inline-flex px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
          >
            무료 상담 신청하기
          </Link>
        </div>
      </article>
    </div>
  )
}

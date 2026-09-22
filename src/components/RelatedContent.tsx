import { Play } from 'lucide-react'
import React from 'react'

import { BlogCard, type BlogCardData } from '@/components/BlogCard'
import { SectionHeading } from '@/components/SectionHeading'

export type Faq = { question?: string | null; answer?: string | null }
export type RelatedVideo = { title?: string | null; url?: string | null }

// FAQs + related videos + related articles, shown at the foot of a detail page.
// Native <details> gives an accessible accordion with no client JS.
export function RelatedContent({
  faqs = [],
  videos = [],
  articles = [],
}: {
  faqs?: Faq[]
  videos?: RelatedVideo[]
  articles?: BlogCardData[]
}) {
  const hasFaqs = faqs.some((f) => f.question)
  const hasVideos = videos.some((v) => v.url)
  const hasArticles = articles.length > 0
  if (!hasFaqs && !hasVideos && !hasArticles) return null

  return (
    <div className="space-y-12">
      {hasFaqs && (
        <section>
          <SectionHeading title="FAQ's" />
          <div className="mx-auto mt-8 max-w-[760px] space-y-3">
            {faqs.filter((f) => f.question).map((faq, index) => (
              <details key={index} className="group rounded-xl border border-border bg-card px-5 py-4">
                <summary className="cursor-pointer list-none font-heading font-semibold text-green marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-gold transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                {faq.answer && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>}
              </details>
            ))}
          </div>
        </section>
      )}

      {hasVideos && (
        <section>
          <SectionHeading title="Watch it in action" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.filter((v) => v.url).map((video, index) => (
              <a
                key={index}
                href={video.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="pattern-green flex items-center gap-3 rounded-2xl px-5 py-6 text-white transition hover:brightness-110"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold text-green">
                  <Play className="size-5 translate-x-0.5" />
                </span>
                <span className="font-heading font-semibold">{video.title || `Video ${index + 1}`}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {hasArticles && (
        <section>
          <SectionHeading title="Related Articles" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 4).map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

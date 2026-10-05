import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { YouTubeEmbed } from '@/components/YouTubeEmbed'
import { cn } from '@/lib/utils'

export type Faq = { question?: string | null; answer?: string | null }
export type RelatedVideo = { title?: string | null; url?: string | null }

// FAQs + related videos, shown near the foot of a caravan page (related articles
// live in the "Tales & Snaps" section). Native <details> = accordion with no JS.
export function RelatedContent({ faqs = [], videos = [] }: { faqs?: Faq[]; videos?: RelatedVideo[] }) {
  const hasFaqs = faqs.some((f) => f.question)
  const playable = videos.filter((v) => v.url)
  const hasVideos = playable.length > 0
  if (!hasFaqs && !hasVideos) return null

  return (
    <div className="space-y-12">
      {hasFaqs && (
        <section>
          <SectionHeading title="FAQ's" />
          <div className="mx-auto mt-8 max-w-[760px] space-y-3">
            {faqs.filter((f) => f.question).map((faq, index) => (
              <details key={index} className="group rounded-xl border border-border bg-card px-5 py-4">
                <summary className="cursor-pointer list-none font-display text-green marker:content-none">
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
          {/* The videos play right here (client: no links out to YouTube); one video = large, centred. */}
          <div
            className={cn(
              'mx-auto mt-8 grid gap-6',
              playable.length === 1 ? 'max-w-[860px]' : playable.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {playable.map((video, index) => (
              <figure key={index} className="m-0">
                <YouTubeEmbed url={video.url!} title={video.title || `Video ${index + 1}`} className="rounded-2xl bg-green shadow-md" />
                {video.title && <figcaption className="mt-3 font-heading text-sm font-semibold text-green">{video.title}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

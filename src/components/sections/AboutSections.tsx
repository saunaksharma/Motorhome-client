import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import React from 'react'

import { racing } from '@/lib/fonts'
import { getHomepage } from '@/lib/payload'
import { cn, focalPosition } from '@/lib/utils'

type Photo = { url?: string | null; alt?: string | null; focalX?: number | null; focalY?: number | null }
type Chapter = { heading: string; body: unknown; photo: Photo | null; year: string | null }

// First year mentioned in a chapter's own text (e.g. "Delhi, 1993") — the fallback when the
// chapter's "Year" box is empty. Nothing is shown when neither has one; nothing is invented.
function yearIn(body: unknown): string | null {
  const text = JSON.stringify(body ?? '')
  return text.match(/\b(19[5-9]\d|20[0-4]\d)\b/)?.[1] ?? null
}

// One chapter as on the client's Canva (pages 24–28): the photo on a green doodle-pattern
// panel, the text on cream beside it — sides alternate on wide screens, stacked on phones.
function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <article className="overflow-hidden rounded-[2rem] bg-background shadow-[0_24px_60px_-34px_rgb(13_71_63/0.5)] ring-1 ring-green/10 md:grid md:grid-cols-2">
      {chapter.photo?.url && (
        <div className={cn('pattern-green flex items-center p-4 sm:p-6 md:p-8', index % 2 === 1 && 'md:order-last')}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={chapter.photo.url}
              alt={chapter.photo.alt ?? chapter.heading}
              fill
              sizes="(max-width: 767px) 92vw, 520px"
              className="object-cover"
              style={{ objectPosition: focalPosition(chapter.photo) }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
        {chapter.year && (
          <p aria-hidden className="font-display text-5xl leading-none text-transparent [-webkit-text-stroke:1.25px_var(--color-green)] sm:text-6xl">
            {chapter.year}
          </p>
        )}
        <h2 className={cn(racing.className, 'mt-2 text-balance text-3xl leading-tight tracking-normal text-green sm:text-4xl')}>
          {chapter.heading}
        </h2>
        {Boolean(chapter.body) && (
          <div className="rich-text mt-4 space-y-3 leading-relaxed text-green/80">
            <RichText data={chapter.body as React.ComponentProps<typeof RichText>['data']} />
          </div>
        )}
      </div>
    </article>
  )
}

// "Our Story" — the About chapters (Homepage → About sections in the admin). Only the first
// ("How it all began") shows; "Read more" opens the rest, photos included (they load only
// when opened). Same on phones and desktop. Native <details>: no client JavaScript.
export async function AboutSections() {
  const home = await getHomepage()
  const sections = home?.aboutSections ?? []
  if (sections.length === 0) return null

  const [first, ...rest]: Chapter[] = sections.map((section) => ({
    heading: section.heading,
    body: section.body,
    photo: (typeof section.image === 'object' ? section.image : null) as Photo | null,
    // The admin's "Year" box wins; otherwise the first year in the chapter's own text.
    year: section.year?.trim() || yearIn(section.body),
  }))

  return (
    <section aria-label="Our story" className="mx-auto max-w-[1100px] px-3 py-16 sm:px-6 sm:py-20">
      <ChapterCard chapter={first} index={0} />

      {rest.length > 0 && (
        <details className="group mt-8">
          <summary
            className={cn(
              racing.className,
              'mx-auto flex w-fit cursor-pointer list-none items-center gap-3 rounded-full border-[3px] border-green px-8 py-3 text-xl tracking-normal text-green transition-colors hover:bg-green hover:text-white [&::-webkit-details-marker]:hidden',
            )}
          >
            <svg aria-hidden viewBox="0 0 24 16" className="w-5 shrink-0 transition-transform group-open:rotate-180">
              <path d="M2 2h20L12 14z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <span className="group-open:hidden">Read more</span>
            <span className="hidden group-open:inline">Show less</span>
          </summary>
          <div className="mt-8 space-y-8">
            {rest.map((chapter, i) => (
              <ChapterCard key={i} chapter={chapter} index={i + 1} />
            ))}
          </div>
        </details>
      )}
    </section>
  )
}

import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import React from 'react'

import { StoryScroll } from '@/components/StoryScroll'
import { getHomepage } from '@/lib/payload'
import { focalPosition } from '@/lib/utils'

type Photo = { url?: string | null; alt?: string | null; focalX?: number | null; focalY?: number | null }

// First year mentioned in a chapter's own text (e.g. "Delhi, 1993") — shown as a large
// outlined numeral. Nothing is shown when the text has no year; nothing is invented.
function yearIn(body: unknown): string | null {
  const text = JSON.stringify(body ?? '')
  return text.match(/\b(19[5-9]\d|20[0-4]\d)\b/)?.[1] ?? null
}

// Viewfinder corners — thin gold brackets on the photo frame.
function Corners() {
  const corner = 'pointer-events-none absolute size-5 border-gold/70'
  return (
    <>
      <span aria-hidden className={`${corner} left-3 top-3 border-l border-t`} />
      <span aria-hidden className={`${corner} right-3 top-3 border-r border-t`} />
      <span aria-hidden className={`${corner} bottom-3 left-3 border-b border-l`} />
      <span aria-hidden className={`${corner} bottom-3 right-3 border-b border-r`} />
    </>
  )
}

// "Our Story" — the About chapters (Homepage → About sections in the admin) as a
// futuristic scroll story, after 21st.dev's "Sticky Scroll Reveal" + "Timeline":
// a white stage (client's choice over dark) with a faint dot grid and soft aurora glow;
// on desktop the chapters scroll on the left while their photo stays pinned on the right
// and crossfades to the chapter being read; a gold beam fills down the timeline as you scroll, each chapter's node lights
// up, and the chapter in view is bright while the others dim. Phones: one column, each
// chapter with its own photo. Behaviour in `StoryScroll`, styles `.story*` in globals.css.
export async function AboutSections() {
  const home = await getHomepage()
  const sections = home?.aboutSections ?? []
  if (sections.length === 0) return null

  const chapters = sections.map((section) => ({
    heading: section.heading,
    body: section.body,
    photo: (typeof section.image === 'object' ? section.image : null) as Photo | null,
    year: yearIn(section.body),
  }))

  // overflow-clip (not -hidden) crops the glows without breaking the sticky photo.
  return (
    <section className="story relative overflow-clip bg-white text-green">
      {/* Stage: dot grid fading out at the edges + soft green/gold aurora glows. */}
      <div aria-hidden className="story-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 size-[520px] rounded-full bg-green/[0.07] blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[440px] rounded-full bg-gold/20 blur-[120px]" />

      <div className="relative mx-auto max-w-[1200px] px-4 py-20 sm:py-28">
        <div className="text-center">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.4em] text-gold">Our Story</p>
          <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <StoryScroll className="story-scroll relative mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Chapters + timeline */}
          <div className="relative">
            <div aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-green/15" />
            <div aria-hidden className="story-beam absolute left-[7px] top-3 w-px" />

            {chapters.map((chapter, index) => (
              <article
                key={index}
                data-chapter
                className="story-chapter relative py-8 pl-10 lg:flex lg:min-h-[72vh] lg:flex-col lg:justify-center lg:py-0"
              >
                <span aria-hidden className="story-node absolute left-0 top-10 size-[15px] rounded-full border border-gold/70 bg-white lg:top-1/2 lg:-translate-y-1/2" />

                {/* Phones/tablets: the chapter's own photo. */}
                {chapter.photo?.url && (
                  <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-green/10 bg-green/5 shadow-[0_24px_60px_-30px_rgb(13_71_63/0.45)] lg:hidden">
                    <Image
                      src={chapter.photo.url}
                      alt={chapter.photo.alt ?? chapter.heading}
                      fill
                      sizes="(max-width: 1024px) 90vw, 1px"
                      className="object-cover"
                      style={{ objectPosition: focalPosition(chapter.photo) }}
                    />
                    <Corners />
                  </div>
                )}

                <div className="story-copy">
                  {chapter.year && (
                    <p aria-hidden className="story-year font-display text-6xl leading-none sm:text-7xl">
                      {chapter.year}
                    </p>
                  )}
                  <h3 className="mt-3 text-balance font-display text-2xl text-green sm:text-3xl">{chapter.heading}</h3>
                  <div aria-hidden className="mt-4 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
                  {chapter.body && (
                    <div className="rich-text mt-5 max-w-[56ch] space-y-3 leading-relaxed text-green/75">
                      <RichText data={chapter.body} />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Desktop: pinned photo that crossfades to the chapter being read. */}
          <div className="hidden lg:block">
            <div className="sticky top-28 h-[70vh] max-h-[640px]">
              <div className="relative h-full overflow-hidden rounded-[28px] border border-green/10 bg-green/5 shadow-[0_40px_100px_-40px_rgb(13_71_63/0.5)]">
                {chapters.map((chapter, index) => (
                  <figure key={index} data-photo className="story-photo absolute inset-0 m-0">
                    {chapter.photo?.url && (
                      <Image
                        src={chapter.photo.url}
                        alt={chapter.photo.alt ?? chapter.heading}
                        fill
                        sizes="45vw"
                        className="object-cover"
                        style={{ objectPosition: focalPosition(chapter.photo) }}
                      />
                    )}
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-7 pb-6 pt-16 font-heading text-xs font-bold uppercase tracking-[0.3em] text-white/85">
                      {chapter.heading}
                    </figcaption>
                  </figure>
                ))}
                <Corners />
              </div>
            </div>
          </div>
        </StoryScroll>
      </div>
    </section>
  )
}

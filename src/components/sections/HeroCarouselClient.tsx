'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { CtaButton } from '@/components/CtaButton'
import { cn } from '@/lib/utils'

export type HeroSlide = {
  headingLine1?: string | null
  headingLine2?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  // CSS object-position from the photo's focal point (set in the admin) — keeps the
  // subject in frame on tall phone crops.
  imagePosition?: string
}

const AUTOPLAY_MS = 6000

// Full-bleed hero carousel: crossfades slides and auto-advances (no controls).
// Desktop follows the Canva: full screen, text centred, gold line in a green badge.
// Phones follow Adria's mobile hero layout — text bottom-left in two bold lines (the gold
// line without a box) and a small outline button. Every size fills the first screen.
export function HeroCarouselClient({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const count = slides.length

  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [count])

  if (count === 0) return null

  const active = slides[current]
  const secondary = active.ctaLink?.startsWith('/caravans')
    ? { href: '/tours', label: 'Explore our tours' }
    : { href: '/caravans', label: 'Explore our caravans' }

  return (
    <section className="relative -mt-[92px] h-[100svh] max-h-[1000px] min-h-[560px] w-full overflow-hidden">
      {/* Backgrounds crossfade on their own; no controls — a calm, hands-off slideshow.
          First slide is priority-loaded for a fast first paint. */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            index === current ? 'opacity-100' : 'opacity-0',
          )}
        >
          {slide.imageUrl ? (
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt ?? ''}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={90}
              className="hero-zoom object-cover"
              style={{ objectPosition: slide.imagePosition }}
            />
          ) : (
            <div className="pattern-green hero-zoom h-full w-full" />
          )}
        </div>
      ))}

      {/* Soft top-to-bottom scrim: keeps the text crisp without hiding the photo. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/5 via-40% to-black/75 sm:from-black/45 sm:via-black/15 sm:via-50% sm:to-black/55" />

      {/* Foreground text for the active slide — keyed so it rises in on every change. */}
      <div
        key={current}
        className="rise-in relative z-10 flex h-full flex-col items-start justify-end gap-5 px-5 pb-12 text-left text-white sm:items-center sm:justify-center sm:gap-8 sm:px-4 sm:pb-0 sm:pt-16 sm:text-center"
      >
        <h1 className="font-display text-[1.9rem] leading-[1.08] drop-shadow-md sm:text-6xl sm:leading-tight md:text-7xl">
          {active.headingLine1}
          {active.headingLine2 && (
            <>
              <br />
              <span className="inline-block text-gold sm:mt-3 sm:rounded-2xl sm:border-2 sm:border-gold sm:bg-green/90 sm:px-7 sm:py-2 sm:shadow-lg">
                {active.headingLine2}
              </span>
            </>
          )}
        </h1>
        {/* One obvious main action (the slide's own CTA, solid gold) and a quiet
            secondary link to the fleet — or to the tours when the CTA already goes there. */}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4 sm:justify-center">
          {active.ctaLabel && (
            <div className="*:px-7 *:py-3 *:text-sm sm:*:px-9 sm:*:py-4 sm:*:text-base">
              <CtaButton href={active.ctaLink ?? '#'} label={active.ctaLabel} gold solid />
            </div>
          )}
          <Link
            href={secondary.href}
            className="group font-heading text-sm uppercase tracking-[0.18em] text-white/85 transition-colors hover:text-white sm:text-[15px]"
          >
            {secondary.label}{' '}
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

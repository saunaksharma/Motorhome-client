'use client'

import Image from 'next/image'
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
}

const AUTOPLAY_MS = 6000

// Full-bleed hero carousel: crossfades slides, auto-advances, arrows + dots.
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

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
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
              className="hero-zoom object-cover"
            />
          ) : (
            <div className="pattern-green hero-zoom h-full w-full" />
          )}
        </div>
      ))}

      {/* Soft top-to-bottom scrim: keeps the text crisp without hiding the photo. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

      {/* Foreground text for the active slide */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-7 px-4 text-center text-white">
        <h1 className="font-display text-4xl italic drop-shadow-md sm:text-6xl md:text-7xl">
          {active.headingLine1}
          {active.headingLine2 && (
            <>
              <br />
              <span className="mt-3 inline-block rounded-2xl border-2 border-gold bg-green/90 px-7 py-2 text-gold shadow-lg">
                {active.headingLine2}
              </span>
            </>
          )}
        </h1>
        {active.ctaLabel && (
          <CtaButton href={active.ctaLink ?? '#'} label={active.ctaLabel} gold />
        )}
      </div>
    </section>
  )
}

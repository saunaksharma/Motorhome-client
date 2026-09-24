'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { ShimmerLink } from '@/components/ui/shimmer-link'
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
// Desktop follows the Canva: text centred. Phones: text sits in the lower part so the
// photo reads, and the gold badge is a slim single line instead of a wide box.
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
    <section className="relative h-[100svh] max-h-[1000px] min-h-[600px] w-full overflow-hidden">
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
              style={{ objectPosition: slide.imagePosition }}
            />
          ) : (
            <div className="pattern-green hero-zoom h-full w-full" />
          )}
        </div>
      ))}

      {/* Soft top-to-bottom scrim: keeps the text crisp without hiding the photo. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/70 sm:to-black/55" />

      {/* Foreground text for the active slide — keyed so it rises in on every change. */}
      <div
        key={current}
        className="rise-in relative z-10 flex h-full flex-col items-center justify-end gap-7 px-4 pb-[16svh] text-center text-white sm:justify-center sm:gap-8 sm:pb-0 sm:pt-16"
      >
        <h1 className="font-display text-[2.1rem] leading-tight italic drop-shadow-md sm:text-6xl md:text-7xl">
          {active.headingLine1}
          {active.headingLine2 && (
            <>
              <br />
              <span className="mt-3 inline-block rounded-xl border-[1.5px] border-gold bg-green/85 px-4 py-1 text-[clamp(1.5rem,8vw,1.9rem)] text-gold shadow-lg backdrop-blur-sm sm:rounded-2xl sm:border-2 sm:px-7 sm:py-2 sm:text-[length:inherit]">
                {active.headingLine2}
              </span>
            </>
          )}
        </h1>
        {active.ctaLabel && <ShimmerLink href={active.ctaLink ?? '#'} label={active.ctaLabel} />}
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

  const move = (step: number) => setCurrent((c) => (c + step + count) % count)
  const active = slides[current]

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {/* Backgrounds crossfade; first slide is priority-loaded for a fast paint. */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
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
          <div className="absolute inset-0 bg-black/35" />
        </div>
      ))}

      {/* Foreground text for the active slide */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-4 text-center text-white">
        <h1 className="font-display text-4xl italic drop-shadow-sm sm:text-6xl md:text-7xl">
          {active.headingLine1}
          {active.headingLine2 && (
            <>
              <br />
              <span className="mt-3 inline-block rounded-2xl bg-green/85 px-6 py-2">
                {active.headingLine2}
              </span>
            </>
          )}
        </h1>
        {active.ctaLabel && (
          <CtaButton href={active.ctaLink ?? '#'} label={active.ctaLabel} onGreen />
        )}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => move(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => move(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  index === current ? 'bg-gold' : 'bg-white/50',
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

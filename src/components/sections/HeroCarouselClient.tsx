'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

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

// Full-bleed hero carousel: crossfades slides and auto-advances. No arrows or dots — swipe
// (finger on phones, click-and-drag on laptops) to go to the next/previous slide; the
// autoplay timer restarts after each change. Vertical page scrolling is untouched.
// Desktop follows the Canva: full screen, text centred, gold line in a green badge.
// Phones follow Adria's mobile hero layout — text bottom-left in two bold lines (the gold
// line without a box) and a small outline button. Every size fills the first screen.
export function HeroCarouselClient({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const count = slides.length

  // A fresh timer per slide, so a swipe also restarts the countdown.
  useEffect(() => {
    if (count <= 1) return
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [count, current])

  // Swipe: a horizontal drag of more than 50px moves one slide (left = next).
  const startX = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (count > 1 && Math.abs(dx) > 50) setCurrent((c) => (c + (dx < 0 ? 1 : -1) + count) % count)
  }

  if (count === 0) return null

  const active = slides[current]

  return (
    <section
      className="relative -mt-[92px] h-[100svh] max-h-[1000px] min-h-[560px] w-full touch-pan-y select-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (startX.current = null)}
    >
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
              draggable={false}
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
        {/* One main action: the slide's own button (solid gold). No other links — client's choice. */}
        {active.ctaLabel && (
          <div className="*:px-7 *:py-3 *:text-sm sm:*:px-9 sm:*:py-4 sm:*:text-base">
            <CtaButton href={active.ctaLink ?? '#'} label={active.ctaLabel} gold solid />
          </div>
        )}
      </div>
    </section>
  )
}

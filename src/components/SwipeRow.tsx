'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

// One horizontal row of cards at every screen size (homepage Tours / Caravans / Innovations).
//   phones  — full-bleed snap carousel, ~82% cards so the next one peeks in, the centred
//             card in focus (scale/fade via CSS scroll timelines — `.swipe-slide` in
//             globals.css), and an "02 / 06" counter.
//   sm / lg — 2½ / 3 cards visible (`wide`: 1¼ / 2, for Adria-style split cards); ← → buttons
//             beside the gold progress line (mouse users can't swipe). Controls hide when
//             every card already fits.
export function SwipeRow({ children, label, wide = false }: { children: React.ReactNode; label: string; wide?: boolean }) {
  const slides = React.Children.toArray(children)
  const track = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ active: 0, seen: 1, atStart: true, atEnd: true })

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    // Active (phones) = the card whose centre is nearest the row's centre.
    const middle = el.scrollLeft + el.clientWidth / 2
    let active = 0
    let best = Infinity
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement
      const distance = Math.abs(c.offsetLeft + c.offsetWidth / 2 - middle)
      if (distance < best) {
        best = distance
        active = i
      }
    })
    const maxScroll = el.scrollWidth - el.clientWidth
    setState({
      active,
      seen: el.scrollWidth ? (el.scrollLeft + el.clientWidth) / el.scrollWidth : 1,
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft >= maxScroll - 2,
    })
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // Move by one card (plus the gap) in either direction.
  const move = (direction: 1 | -1) => {
    const el = track.current
    const first = el?.children[0] as HTMLElement | undefined
    if (!el || !first) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: direction * (first.offsetWidth + gap), behavior: 'smooth' })
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const scrollable = !(state.atStart && state.atEnd)

  return (
    <div className="mt-8">
      <div
        ref={track}
        onScroll={measure}
        role="region"
        aria-label={label}
        className="swipe-track -mx-4 -my-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-3 sm:mx-0 sm:gap-6 sm:px-0"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              'swipe-slide flex w-[82%] shrink-0 snap-center flex-col *:flex-1 sm:snap-start',
              wide ? 'sm:w-[80%] lg:w-[calc((100%-1.5rem)/2)]' : 'sm:w-[calc((100%-3rem)/2.5)] lg:w-[calc((100%-3rem)/3)]',
            )}
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && scrollable && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={state.atStart}
            aria-label={`Previous — ${label}`}
            className="hidden rounded-full border border-green/20 p-2 text-green transition hover:border-green hover:bg-green hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:block"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span aria-hidden className="font-heading text-sm font-bold tracking-widest text-green sm:hidden">
            {pad(state.active + 1)}
          </span>
          <span aria-hidden className="relative h-px w-28 bg-green/15 sm:w-40">
            <span
              className="absolute left-0 bg-gold transition-[width] duration-300"
              style={{ width: `${Math.min(100, state.seen * 100)}%`, height: 2, top: -0.5 }}
            />
          </span>
          <span aria-hidden className="font-heading text-sm font-bold tracking-widest text-green/40 sm:hidden">
            {pad(slides.length)}
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={state.atEnd}
            aria-label={`Next — ${label}`}
            className="hidden rounded-full border border-green/20 p-2 text-green transition hover:border-green hover:bg-green hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:block"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

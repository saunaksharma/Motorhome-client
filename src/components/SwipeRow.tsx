'use client'

import React, { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

// Card row that is a swipeable carousel on phones and a normal grid from `sm` up.
// Phone: full-bleed snap row, the next card peeks in, the centred card is in focus
// (scale/fade driven by CSS scroll timelines — see `.swipe-slide` in globals.css),
// and a gold progress line with an "02 / 06" counter shows where you are.
export function SwipeRow({
  children,
  label,
  gridClassName = 'sm:grid-cols-2 lg:grid-cols-3',
}: {
  children: React.ReactNode
  label: string
  gridClassName?: string
}) {
  const slides = React.Children.toArray(children)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // The active card is the one whose centre is nearest the row's centre.
  const onScroll = () => {
    const el = track.current
    if (!el) return
    const middle = el.scrollLeft + el.clientWidth / 2
    let nearest = 0
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement
      const distance = Math.abs(c.offsetLeft + c.offsetWidth / 2 - middle)
      const best = el.children[nearest] as HTMLElement
      if (distance < Math.abs(best.offsetLeft + best.offsetWidth / 2 - middle)) nearest = i
    })
    setActive(nearest)
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="mt-10">
      <div
        ref={track}
        onScroll={onScroll}
        role="region"
        aria-label={label}
        className={cn(
          'swipe-track -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2',
          'sm:mx-0 sm:grid sm:snap-none sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0',
          gridClassName,
        )}
      >
        {slides.map((slide, i) => (
          <div key={i} className="swipe-slide flex w-[82%] shrink-0 snap-center flex-col *:flex-1 sm:w-auto">
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 sm:hidden" aria-hidden>
          <span className="font-heading text-sm tracking-widest text-green">{pad(active + 1)}</span>
          <span className="relative h-px w-28 bg-green/15">
            <span
              className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-300"
              style={{ width: `${((active + 1) / slides.length) * 100}%`, height: 2, top: -0.5 }}
            />
          </span>
          <span className="font-heading text-sm tracking-widest text-green/40">{pad(slides.length)}</span>
        </div>
      )}
    </div>
  )
}

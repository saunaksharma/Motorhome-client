'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export type GalleryImage = { url: string; alt?: string; caption?: string }

// Tile shape for photo `index` of `count`, so the grid has a rhythm and never leaves holes:
//   phones (2 columns) — wide, square, square, wide, …; a photo left alone on the last
//                        row goes wide too.
//   sm and up          — the first photo is a large 2×2 feature, the rest square
//                        (grid-flow-dense fills gaps; column count adapts below).
function tileClass(index: number, count: number) {
  const wideOnPhone = index % 3 === 0 || (index % 3 === 1 && index === count - 1)
  return cn(
    wideOnPhone ? 'col-span-2 aspect-[16/10]' : 'aspect-square',
    'sm:col-span-1 sm:aspect-square',
    index === 0 && count > 2 && 'sm:col-span-2 sm:row-span-2',
  )
}

// Photo mosaic with a full-screen lightbox: next/previous buttons, swipe on phones,
// arrow keys + Esc on desktop, photo counter and caption. Grid photos lazy-load.
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const touchX = useRef<number | null>(null)
  const count = images.length

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  )

  // Keyboard controls + no page scrolling behind the open lightbox.
  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex, close, step])

  if (count === 0) {
    return <p className="text-center text-muted-foreground">No images yet.</p>
  }

  const current = openIndex === null ? null : images[openIndex]

  return (
    <>
      <div
        className={cn(
          'grid grid-flow-dense grid-cols-2 gap-2.5 sm:gap-3',
          // Columns follow the photo count so small sets fill the grid exactly
          // (3 photos = one 2×2 feature + two stacked squares).
          count <= 2 ? 'sm:grid-cols-2' : count === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-4',
        )}
      >
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={cn('group relative overflow-hidden rounded-2xl bg-green/10', tileClass(index, count))}
            aria-label={`Open photo ${index + 1} of ${count}`}
          >
            <Image
              src={image.url}
              alt={image.alt ?? ''}
              fill
              sizes={index === 0 ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
            touchX.current = null
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="font-heading text-sm tracking-[0.2em] text-white/70">
              {openIndex + 1} / {count}
            </span>
            <button type="button" onClick={close} aria-label="Close" autoFocus className="rounded-full p-2 hover:bg-white/10">
              <X className="size-6" />
            </button>
          </div>

          {/* Taps on the photo don't close the viewer (easy to hit by accident on phones). */}
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={current.url} alt={current.alt ?? ''} fill sizes="100vw" className="object-contain" />
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                  className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20 sm:block"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                  className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20 sm:block"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          <p className="min-h-12 px-6 py-4 text-center text-sm text-white/75">
            {current.caption ?? (count > 1 ? <span className="text-white/40 sm:hidden">Swipe for more</span> : null)}
          </p>
        </div>
      )}
    </>
  )
}

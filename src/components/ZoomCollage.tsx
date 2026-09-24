import Image from 'next/image'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'

type Photo = { url: string; alt?: string | null }

// Scroll moment after Rivian's R1T page: the main photo is pinned full-screen, then zooms
// out as you scroll to become the centre tile of a 3×3 collage of the caravan's own
// photos, which darkens as the title + button rise in. Pure CSS scroll-driven animation
// (`.collage*` in globals.css) — no JS. Browsers without scroll timelines, and visitors
// who prefer reduced motion, simply see the finished collage.
export function ZoomCollage({
  title,
  text,
  photos,
  cta,
}: {
  title: string
  text?: string | null
  photos: Photo[]
  cta: { href: string; label: string }
}) {
  if (photos.length < 4) return null
  const [centre, ...rest] = photos
  // Eight tiles around the centre; with fewer photos they repeat.
  const ring = Array.from({ length: 8 }, (_, i) => rest[i % rest.length])
  const tiles = [...ring.slice(0, 4), centre, ...ring.slice(4)]

  return (
    <section className="collage relative bg-green">
      <div className="collage-stage relative h-[100svh] overflow-hidden">
        <div className="collage-grid grid h-full grid-cols-3 grid-rows-3 gap-2 p-2 sm:gap-3 sm:p-3">
          {tiles.map((photo, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl">
              <Image
                src={photo.url}
                alt={i === 4 ? (photo.alt ?? title) : ''}
                fill
                sizes={i === 4 ? '100vw' : '34vw'}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div aria-hidden className="collage-shade absolute inset-0 bg-black/55" />
        <div className="collage-text absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center text-white">
          <h2 className="text-balance font-display text-4xl sm:text-6xl">{title}</h2>
          {text && <p className="max-w-xl text-white/85 sm:text-lg">{text}</p>}
          <CtaButton href={cta.href} label={cta.label} gold />
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'

type Photo = { url: string; alt?: string | null }

// Cinematic scroll moment (Rivian's R1T page + 21st.dev's "Zoom Parallax" / "Scroll media
// expansion hero"):
//   1. the cover photo fills the screen under a black film (dark tint + fine grain — also
//      hides the softness of our modest-resolution photos), the caravan's name big in the
//      middle like a title card;
//   2. on scroll the title drifts up and fades, the film lifts, and the photo zooms out
//      into a 3×3 collage of the caravan's own photos;
//   3. the collage darkens as the title, short description and button rise in.
// Pure CSS scroll-driven animation (`.collage*` in globals.css) — no JS. Browsers without
// scroll timelines, and visitors who prefer reduced motion, see the finished collage.
export function ZoomCollage({
  eyebrow,
  title,
  text,
  photos,
  cta,
}: {
  eyebrow?: string | null
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
    <section className="collage relative bg-[#0a0e0d]">
      <div className="collage-stage relative h-[100svh] overflow-hidden">
        <div className="collage-grid grid grid-cols-3 grid-rows-3">
          {tiles.map((photo, i) => (
            <div key={i} className="relative overflow-hidden rounded-[2rem] bg-white/5">
              <Image
                src={photo.url}
                alt={i === 4 ? (photo.alt ?? title) : ''}
                fill
                sizes={i === 4 ? '100vw' : '34vw'}
                quality={i === 4 ? 90 : 75}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Black film (tint + grain) and a soft sheen of light from the top. */}
        <div aria-hidden className="collage-film pointer-events-none absolute inset-0" />
        <div aria-hidden className="collage-sheen pointer-events-none absolute inset-0" />
        <div aria-hidden className="collage-shade absolute inset-0 bg-black/55" />

        {/* Opening title card — decorative (the real heading is below). */}
        <div aria-hidden className="collage-intro pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          {eyebrow && <p className="font-heading text-xs uppercase tracking-[0.35em] text-white/80">{eyebrow}</p>}
          <p className="mt-3 text-balance font-display text-5xl uppercase tracking-wide drop-shadow-lg sm:text-8xl">{title}</p>
          <p className="mt-8 font-heading text-[11px] uppercase tracking-[0.4em] text-white/60">Scroll to explore</p>
        </div>

        <div className="collage-text absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center text-white">
          <h2 className="text-balance font-display text-4xl sm:text-6xl">{title}</h2>
          {text && <p className="max-w-xl text-white/85 sm:text-lg">{text}</p>}
          <CtaButton href={cta.href} label={cta.label} gold />
        </div>
      </div>
    </section>
  )
}

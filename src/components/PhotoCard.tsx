import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

import { cn, focalPosition } from '@/lib/utils'

export type PhotoCardLayout = 'overlay' | 'panel'

export type PhotoCardProps = {
  href: string
  image?: unknown
  title: string
  /** Gold pill, top-left (e.g. category / class). */
  tag?: string | null
  /** Glass pill, top-right (e.g. duration). */
  badge?: string | null
  /** One line under the title (e.g. route, or "Sleeps 6 · Chauffeur driven · Delhi"). */
  subtitle?: string | null
  /** A small extra line (e.g. season), with an optional icon. */
  meta?: React.ReactNode
  description?: string | null
  layout?: PhotoCardLayout
}

type Photo = { url?: string; alt?: string; focalX?: number | null; focalY?: number | null }

// The site's photo card (tours, caravans, innovations — client: "same treatment as tours"). The whole
// card is one link. Two layouts (client):
//   overlay (homepage strips) — the photo fills the card, the text sits on a dark fade at the bottom,
//     and on hover the description + "Explore" slide up (always shown on touch screens);
//   panel (the Tours / Caravans / Innovations pages) — the whole cover photo in a landscape frame,
//     with the name, details and card text on the green panel below (Canva tour cards).
// Photos keep their focus point (set per photo in Media), so the important part stays in view.
export function PhotoCard({ href, image, title, tag, badge, subtitle, meta, description, layout = 'overlay' }: PhotoCardProps) {
  const photo = typeof image === 'object' && image !== null ? (image as Photo) : null
  const panel = layout === 'panel'

  const picture = photo?.url ? (
    <Image
      src={photo.url}
      alt={photo.alt ?? title}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      style={{ objectPosition: focalPosition(photo) }}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  ) : (
    <div className="pattern-green h-full w-full" />
  )

  const tags = (
    <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
      {tag && (
        <span className="rounded-full bg-gold px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-green">{tag}</span>
      )}
      {badge && (
        <span className="ml-auto rounded-full bg-black/40 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {badge}
        </span>
      )}
    </div>
  )

  const explore = (
    <span className="mt-3 inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-wider text-gold">
      Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </span>
  )

  return (
    <Link
      href={href}
      className={cn(
        'reveal group overflow-hidden rounded-3xl bg-green shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(13_71_63/0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold',
        // Homepage: 4:5 (client: "like 1080x1350"); the photo's focus point keeps the vehicle in view.
        panel ? 'flex h-full flex-col' : 'relative block aspect-[4/5]',
      )}
    >
      {panel ? (
        <>
          <div className="relative aspect-[16/10] overflow-hidden">
            {picture}
            {tags}
          </div>
          <div className="flex flex-1 flex-col p-6 text-white">
            <h3 className="font-display text-2xl leading-tight text-balance">{title}</h3>
            {subtitle && <p className="mt-2 line-clamp-1 text-sm text-white/80">{subtitle}</p>}
            {meta && <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">{meta}</p>}
            {description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/80">{description}</p>}
            <div className="mt-auto pt-1">{explore}</div>
          </div>
        </>
      ) : (
        <>
          {picture}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          {tags}
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <h3 className="font-display text-2xl leading-tight text-balance">{title}</h3>
            {subtitle && <p className="mt-2 line-clamp-1 text-sm text-white/80">{subtitle}</p>}
            {meta && <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">{meta}</p>}
            <div className="grid transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
              <div className="overflow-hidden">
                {description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">{description}</p>}
                {explore}
              </div>
            </div>
          </div>
        </>
      )}
    </Link>
  )
}

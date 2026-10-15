import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

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
}

// The site's photo card (tours, caravans, innovations — client: "same treatment as tours"): the
// photo on top in a landscape frame, so the whole cover photo shows (client: "fit the cover
// pics" — the old tall card cropped landscape photos hard), with the name, details and card text
// on the green panel below, like the Canva's tour cards. The whole card is one link.
export function PhotoCard({ href, image, title, tag, badge, subtitle, meta, description }: PhotoCardProps) {
  const photo = typeof image === 'object' && image !== null ? (image as { url?: string; alt?: string }) : null

  return (
    <Link
      href={href}
      className="reveal group flex h-full flex-col overflow-hidden rounded-3xl bg-green shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(13_71_63/0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {photo?.url ? (
          <Image
            src={photo.url}
            alt={photo.alt ?? title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="pattern-green h-full w-full" />
        )}

        {/* Tags */}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {tag && (
            <span className="rounded-full bg-gold px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-green">
              {tag}
            </span>
          )}
          {badge && (
            <span className="ml-auto rounded-full bg-black/45 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Text panel */}
      <div className="flex flex-1 flex-col p-6 text-white">
        <h3 className="font-display text-2xl leading-tight text-balance">{title}</h3>
        {subtitle && <p className="mt-2 line-clamp-1 text-sm text-white/80">{subtitle}</p>}
        {meta && <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">{meta}</p>}
        {description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/80">{description}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-heading text-sm uppercase tracking-wider text-gold">
          Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

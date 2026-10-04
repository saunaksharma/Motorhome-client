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

// The site's photo card (tours, caravans, innovations — client: "same treatment as tours"):
// the photo fills the card, the text sits on a dark fade at the bottom, and on hover the
// description + "Explore" slide up (always shown on touch screens). The whole card is one
// link — one clear action.
export function PhotoCard({ href, image, title, tag, badge, subtitle, meta, description }: PhotoCardProps) {
  const photo = typeof image === 'object' && image !== null ? (image as { url?: string; alt?: string }) : null

  return (
    <Link
      href={href}
      className="reveal group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-green shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(13_71_63/0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      {/* Tags */}
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
        {tag && (
          <span className="rounded-full bg-gold px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-green">
            {tag}
          </span>
        )}
        {badge && (
          <span className="ml-auto rounded-full bg-black/35 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Text on the photo */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-display text-2xl leading-tight text-balance">{title}</h3>
        {subtitle && <p className="mt-2 line-clamp-1 text-sm text-white/80">{subtitle}</p>}
        {meta && <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">{meta}</p>}
        <div className="grid transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            {description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">{description}</p>}
            <span className="mt-3 inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-wider text-gold">
              Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

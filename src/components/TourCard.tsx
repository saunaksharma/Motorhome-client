import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import React from 'react'

export type TourCardData = {
  id: number | string
  name: string
  slug?: string | null
  heroImage?: unknown
  category?: string | null
  durationLabel?: string | null
  routeLabel?: string | null
  season?: string | null
  shortDescription?: string | null
}

// A tour card as a travel-magazine photo card: the photo fills the card, the text sits
// on a dark fade at the bottom, and on hover the description + "Explore" slide up.
// The whole card is one link.
export function TourCard({ tour }: { tour: TourCardData }) {
  const image = typeof tour.heroImage === 'object' ? (tour.heroImage as { url?: string; alt?: string }) : null

  return (
    <Link
      href={tour.slug ? `/tours/${tour.slug}` : '#'}
      className="reveal group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-green shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(13_71_63/0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      {image?.url ? (
        <Image
          src={image.url}
          alt={image.alt ?? tour.name}
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
        {tour.category && (
          <span className="rounded-full bg-gold px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-green">
            {tour.category}
          </span>
        )}
        {tour.durationLabel && (
          <span className="ml-auto rounded-full bg-black/35 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {tour.durationLabel}
          </span>
        )}
      </div>

      {/* Text on the photo */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-heading text-2xl font-semibold leading-tight tracking-wide text-balance">{tour.name}</h3>
        {tour.routeLabel && <p className="mt-2 line-clamp-1 text-sm text-white/80">{tour.routeLabel}</p>}
        {tour.season && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
            <CalendarDays className="size-3.5" /> {tour.season}
          </p>
        )}
        <div className="grid transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            {tour.shortDescription && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">{tour.shortDescription}</p>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-wider text-gold">
              Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

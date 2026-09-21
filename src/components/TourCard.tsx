import Image from 'next/image'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'

export type TourCardData = {
  id: number | string
  name: string
  slug?: string | null
  heroImage?: unknown
  durationLabel?: string | null
  routeLabel?: string | null
  season?: string | null
  shortDescription?: string | null
}

// A single tour card — used on the homepage strip and the tours listing.
export function TourCard({ tour }: { tour: TourCardData }) {
  const image = typeof tour.heroImage === 'object' ? (tour.heroImage as { url?: string; alt?: string }) : null

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3]">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? tour.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
        )}
      </div>

      <div className="p-5">
        <h3 className="text-center font-display text-xl italic text-green">{tour.name}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {tour.durationLabel && (
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-green" /> {tour.durationLabel}
            </li>
          )}
          {tour.routeLabel && (
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-green" /> {tour.routeLabel}
            </li>
          )}
          {tour.season && (
            <li className="flex items-center gap-2">
              <CalendarDays className="size-4 text-green" /> {tour.season}
            </li>
          )}
        </ul>
        {tour.shortDescription && (
          <p className="mt-3 text-sm text-muted-foreground">{tour.shortDescription}</p>
        )}
        <div className="mt-5 text-center">
          <CtaButton href={tour.slug ? `/tours/${tour.slug}` : '#'} label="EXPLORE" />
        </div>
      </div>
    </article>
  )
}

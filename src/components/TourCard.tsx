import { CalendarDays } from 'lucide-react'
import React from 'react'

import { PhotoCard, type PhotoCardLayout } from '@/components/PhotoCard'
import { plainText } from '@/lib/seo'

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
  description?: unknown
}

// A tour as a travel-magazine photo card (see PhotoCard).
export function TourCard({ tour, layout }: { tour: TourCardData; layout?: PhotoCardLayout }) {
  return (
    <PhotoCard
      href={tour.slug ? `/tours/${tour.slug}` : '#'}
      image={tour.heroImage}
      title={tour.name}
      tag={tour.category}
      badge={tour.durationLabel}
      subtitle={tour.routeLabel}
      meta={
        tour.season && (
          <>
            <CalendarDays className="size-3.5" /> {tour.season}
          </>
        )
      }
      description={tour.shortDescription?.trim() || plainText(tour.description, 140)}
      layout={layout}
    />
  )
}

import React from 'react'

import { PhotoCard } from '@/components/PhotoCard'
import { relName } from '@/lib/utils'

export type CaravanCardData = {
  id: number | string
  name: string
  slug?: string | null
  heroImage?: unknown
  class?: unknown
  driveType?: unknown
  baseLocation?: unknown
  sleeps?: string | null
  shortDescription?: string | null
}

// A caravan as a photo card, same treatment as tours (client request; see PhotoCard).
// One action: the card opens the caravan's page, which has the Enquire button.
export function CaravanCard({ caravan }: { caravan: CaravanCardData }) {
  const className = relName(caravan.class)
  const specs = [
    caravan.sleeps && `Sleeps ${caravan.sleeps.replace(/ people$/i, '')}`,
    relName(caravan.driveType),
    relName(caravan.baseLocation),
  ].filter(Boolean)

  return (
    <PhotoCard
      href={caravan.slug ? `/caravans/${caravan.slug}` : '#'}
      image={caravan.heroImage}
      title={caravan.name}
      tag={className && `${className} class`}
      subtitle={specs.join(' · ')}
      description={caravan.shortDescription}
    />
  )
}

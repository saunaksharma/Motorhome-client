import React from 'react'

import { PhotoCard } from '@/components/PhotoCard'

export type InnovationCardData = {
  id: number | string
  name: string
  slug?: string | null
  category?: string | null
  heroImage?: unknown
  seats?: string | null
  baseLocation?: string | null
  shortDescription?: string | null
}

// An innovation (specialised vehicle) as a photo card, same treatment as tours (client
// request; see PhotoCard). One action: the card opens its page, which has the Enquire button.
export function InnovationCard({ item }: { item: InnovationCardData }) {
  const specs = [item.seats && `Seats ${item.seats}`, item.baseLocation].filter(Boolean)

  return (
    <PhotoCard
      href={item.slug ? `/innovations/${item.slug}` : '#'}
      image={item.heroImage}
      title={item.name}
      tag={item.category}
      subtitle={specs.join(' · ')}
      description={item.shortDescription}
    />
  )
}

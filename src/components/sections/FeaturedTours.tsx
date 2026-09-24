import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { SwipeRow } from '@/components/SwipeRow'
import { TourCard } from '@/components/TourCard'
import { ViewAllLink } from '@/components/ViewAllLink'
import { getPayloadClient } from '@/lib/payload'

export async function FeaturedTours() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tours',
    where: { active: { equals: true }, featured: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 12, // one sideways row; the client picks which via "Featured"
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="TOURS" subtitle="Explore our curated tour packages" />

      <SwipeRow label="Featured tours">
        {docs.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </SwipeRow>

      <ViewAllLink href="/tours" label="View All Tours" />
    </section>
  )
}

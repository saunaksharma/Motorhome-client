import React from 'react'

import { RowHeading } from '@/components/RowHeading'
import { SwipeRow } from '@/components/SwipeRow'
import { TourCard } from '@/components/TourCard'
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
      <RowHeading title="TOURS" subtitle="Explore our curated tour packages" href="/tours" linkLabel="View all tours" />

      <SwipeRow label="Featured tours">
        {docs.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </SwipeRow>
    </section>
  )
}

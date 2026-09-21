import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
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
    limit: 6,
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="TOURS" subtitle="Explore our curated tour packages" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      <ViewAllLink href="/tours" label="View All Tours" />
    </section>
  )
}

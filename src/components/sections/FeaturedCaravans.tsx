import React from 'react'

import { CaravanCard } from '@/components/CaravanCard'
import { SectionHeading } from '@/components/SectionHeading'
import { SwipeRow } from '@/components/SwipeRow'
import { ViewAllLink } from '@/components/ViewAllLink'
import { getPayloadClient } from '@/lib/payload'

export async function FeaturedCaravans() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'caravans',
    where: { active: { equals: true }, featured: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 6,
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="CARAVANS" subtitle="Discover our featured caravans" />

      <SwipeRow label="Featured caravans">
        {docs.map((caravan) => (
          <CaravanCard key={caravan.id} caravan={caravan} />
        ))}
      </SwipeRow>

      <ViewAllLink href="/caravans" label="View All Caravans" />
    </section>
  )
}

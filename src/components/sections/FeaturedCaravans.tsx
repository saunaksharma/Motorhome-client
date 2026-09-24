import React from 'react'

import { CaravanCard } from '@/components/CaravanCard'
import { RowHeading } from '@/components/RowHeading'
import { SwipeRow } from '@/components/SwipeRow'
import { getPayloadClient } from '@/lib/payload'

export async function FeaturedCaravans() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'caravans',
    where: { active: { equals: true }, featured: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 12, // one sideways row; the client picks which via "Featured"
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <RowHeading title="CARAVANS" subtitle="Discover our featured caravans" href="/caravans" linkLabel="View all caravans" />

      <SwipeRow label="Featured caravans" wide>
        {docs.map((caravan) => (
          <CaravanCard key={caravan.id} caravan={caravan} split />
        ))}
      </SwipeRow>
    </section>
  )
}

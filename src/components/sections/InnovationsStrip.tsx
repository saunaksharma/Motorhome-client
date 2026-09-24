import React from 'react'

import { InnovationCard } from '@/components/InnovationCard'
import { SectionHeading } from '@/components/SectionHeading'
import { SwipeRow } from '@/components/SwipeRow'
import { ViewAllLink } from '@/components/ViewAllLink'
import { getPayloadClient } from '@/lib/payload'

export async function InnovationsStrip() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'innovations',
    where: { active: { equals: true }, featured: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 12, // one sideways row; the client picks which via "Featured"
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="OUR INNOVATIONS" subtitle="Specialized vehicles for unique experiences" />

      <SwipeRow label="Our innovations">
        {docs.map((item) => (
          <InnovationCard key={item.id} item={item} />
        ))}
      </SwipeRow>

      <ViewAllLink href="/innovations" label="View More Innovations" />
    </section>
  )
}

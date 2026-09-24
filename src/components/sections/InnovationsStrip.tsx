import React from 'react'

import { InnovationCard } from '@/components/InnovationCard'
import { RowHeading } from '@/components/RowHeading'
import { SwipeRow } from '@/components/SwipeRow'
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
      <RowHeading title="OUR INNOVATIONS" subtitle="Specialized vehicles for unique experiences" href="/innovations" linkLabel="View all" />

      <SwipeRow label="Our innovations">
        {docs.map((item) => (
          <InnovationCard key={item.id} item={item} />
        ))}
      </SwipeRow>
    </section>
  )
}

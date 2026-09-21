import React from 'react'

import { InnovationCard } from '@/components/InnovationCard'
import { SectionHeading } from '@/components/SectionHeading'
import { ViewAllLink } from '@/components/ViewAllLink'
import { getPayloadClient } from '@/lib/payload'

export async function InnovationsStrip() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'innovations',
    where: { active: { equals: true }, featured: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 6,
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="OUR INNOVATIONS" subtitle="Specialized vehicles for unique experiences" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((item) => (
          <InnovationCard key={item.id} item={item} />
        ))}
      </div>

      <ViewAllLink href="/innovations" label="View More Innovations" />
    </section>
  )
}

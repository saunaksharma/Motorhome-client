import React from 'react'

import { InnovationCard } from '@/components/InnovationCard'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

export const metadata = { title: 'Our Innovations' }

// Refresh from the CMS at most once a minute in production.
export const revalidate = 60

export default async function InnovationsPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'innovations',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title="OUR INNOVATIONS" subtitle="Specialized vehicles for unique experiences" />

      {docs.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((item) => (
            <InnovationCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">No innovations yet.</p>
      )}
    </div>
  )
}

import type { Where } from 'payload'
import React from 'react'

import { CaravanCard } from '@/components/CaravanCard'
import { FilterBar } from '@/components/FilterBar'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

type SearchParams = Promise<{
  location?: string
  drive?: string
  berth?: string
  class?: string
}>

export const metadata = { title: 'Caravans — Motorhome Adventures' }

export default async function CaravansPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const payload = await getPayloadClient()

  // Filter dropdown options, grouped.
  const { docs: options } = await payload.find({
    collection: 'caravan-filter-options',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 200,
  })
  const optionsFor = (group: string) =>
    options.filter((o) => o.group === group).map((o) => ({ id: o.id, name: o.name }))

  // Build the query from the active URL params.
  const where: Where = { active: { equals: true } }
  if (params.location) where.baseLocation = { equals: Number(params.location) }
  if (params.drive) where.driveType = { equals: Number(params.drive) }
  if (params.berth) where.berthRange = { equals: Number(params.berth) }
  if (params.class) where.class = { equals: Number(params.class) }

  const { docs: caravans } = await payload.find({
    collection: 'caravans',
    where,
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title="CARAVANS" />

      <div className="mt-8">
        <FilterBar
          filters={[
            { label: 'Base Location', param: 'location', options: optionsFor('base-location') },
            { label: 'Drive Type', param: 'drive', options: optionsFor('drive-type') },
            { label: 'Berth', param: 'berth', options: optionsFor('berth-range') },
            { label: 'Class', param: 'class', options: optionsFor('class') },
          ]}
        />
      </div>

      {caravans.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caravans.map((caravan) => (
            <CaravanCard key={caravan.id} caravan={caravan} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">No caravans match these filters.</p>
      )}
    </div>
  )
}

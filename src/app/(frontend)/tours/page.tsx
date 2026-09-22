import type { Where } from 'payload'
import React from 'react'

import { FilterBar } from '@/components/FilterBar'
import { SectionHeading } from '@/components/SectionHeading'
import { TourCard } from '@/components/TourCard'
import { getPayloadClient } from '@/lib/payload'

type SearchParams = Promise<{
  duration?: string
  location?: string
  preference?: string
}>

export const metadata = { title: 'Tours' }

export default async function ToursPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const payload = await getPayloadClient()

  const { docs: options } = await payload.find({
    collection: 'tour-filter-options',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 200,
  })
  const optionsFor = (group: string) =>
    options.filter((o) => o.group === group).map((o) => ({ id: o.id, name: o.name }))

  const where: Where = { active: { equals: true } }
  if (params.duration) where.durationBand = { equals: Number(params.duration) }
  if (params.location) where.location = { equals: Number(params.location) }
  if (params.preference) where.preference = { in: [Number(params.preference)] } // hasMany

  const { docs: tours } = await payload.find({
    collection: 'tours',
    where,
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title="TOURS" />

      <div className="mt-8">
        <FilterBar
          filters={[
            { label: 'Duration', param: 'duration', options: optionsFor('duration-band') },
            { label: 'Location', param: 'location', options: optionsFor('location') },
            { label: 'Preference', param: 'preference', options: optionsFor('preference') },
          ]}
        />
      </div>

      {tours.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">No tours match these filters.</p>
      )}
    </div>
  )
}

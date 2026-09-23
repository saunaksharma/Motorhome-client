import React, { Suspense } from 'react'

import { FilterBar } from '@/components/FilterBar'
import { FilteredGrid, type FilterableItem } from '@/components/FilteredGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { TourCard } from '@/components/TourCard'
import { getPayloadClient } from '@/lib/payload'
import { relIds } from '@/lib/utils'

export const metadata = { title: 'Tours' }
// Pre-built and cached (fast); saving in the admin refreshes it immediately.
export const revalidate = 60

export default async function ToursPage() {
  const payload = await getPayloadClient()

  const { docs: options } = await payload.find({
    collection: 'tour-filter-options',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 200,
  })
  const optionsFor = (group: string) =>
    options.filter((o) => o.group === group).map((o) => ({ id: o.id, name: o.name }))

  // Every active tour; the browser filters them (see FilteredGrid).
  const { docs: tours } = await payload.find({
    collection: 'tours',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  const items: FilterableItem[] = tours.map((tour) => ({
    id: tour.id,
    keys: {
      duration: relIds(tour.durationBand),
      location: relIds(tour.location),
      preference: relIds(tour.preference), // hasMany
    },
    card: <TourCard tour={tour} />,
  }))

  const allCards = (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <React.Fragment key={item.id}>{item.card}</React.Fragment>
      ))}
    </div>
  )

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title="TOURS" />

      {/* The filters read the URL in the browser (Suspense); until then the
          pre-built page shows a same-height placeholder and every tour. */}
      <div className="mt-8 min-h-16">
        <Suspense fallback={null}>
          <FilterBar
            filters={[
              { label: 'Duration', param: 'duration', options: optionsFor('duration-band') },
              { label: 'Location', param: 'location', options: optionsFor('location') },
              { label: 'Preference', param: 'preference', options: optionsFor('preference') },
            ]}
          />
        </Suspense>
      </div>
      <Suspense fallback={allCards}>
        <FilteredGrid items={items} params={['duration', 'location', 'preference']} emptyText="No tours match these filters." />
      </Suspense>
    </div>
  )
}

import React, { Suspense } from 'react'

import { CaravanCard } from '@/components/CaravanCard'
import { FilterBar } from '@/components/FilterBar'
import { FilteredGrid, type FilterableItem } from '@/components/FilteredGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'
import { relIds } from '@/lib/utils'

export const metadata = { title: 'Caravans' }
// Pre-built and cached (fast); saving in the admin refreshes it immediately.
export const revalidate = 60

export default async function CaravansPage() {
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

  // Every active caravan; the browser filters them (see FilteredGrid).
  const { docs: caravans } = await payload.find({
    collection: 'caravans',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  const items: FilterableItem[] = caravans.map((caravan) => ({
    id: caravan.id,
    keys: {
      location: relIds(caravan.baseLocation),
      drive: relIds(caravan.driveType),
      berth: relIds(caravan.berthRange),
      class: relIds(caravan.class),
    },
    card: <CaravanCard caravan={caravan} />,
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
      <SectionHeading title="CARAVANS" />

      {/* The filters read the URL in the browser (Suspense); until then the
          pre-built page shows a same-height placeholder and every caravan. */}
      <div className="mt-8 min-h-16">
        <Suspense fallback={null}>
          <FilterBar
            filters={[
              { label: 'Base Location', param: 'location', options: optionsFor('base-location') },
              { label: 'Drive Type', param: 'drive', options: optionsFor('drive-type') },
              { label: 'Berth', param: 'berth', options: optionsFor('berth-range') },
              { label: 'Class', param: 'class', options: optionsFor('class') },
            ]}
          />
        </Suspense>
      </div>
      <Suspense fallback={allCards}>
        <FilteredGrid items={items} params={['location', 'drive', 'berth', 'class']} emptyText="No caravans match these filters." />
      </Suspense>
    </div>
  )
}

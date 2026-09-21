import Image from 'next/image'
import { BedDouble, MapPin, Users } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { CtaButton } from '@/components/CtaButton'
import { ViewAllLink } from '@/components/ViewAllLink'
import { getPayloadClient } from '@/lib/payload'

// "Our Innovations" — specialized vehicles with a category badge (design old site).
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
        {docs.map((item) => {
          const image = typeof item.heroImage === 'object' ? item.heroImage : null
          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt ?? item.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
                )}
                {item.category && (
                  <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-sm font-semibold text-green">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="p-5 text-center">
                <h3 className="font-display text-2xl italic text-green">{item.name}</h3>
                <ul className="mt-3 space-y-2 text-left text-sm">
                  {item.seats && (
                    <li className="flex items-center gap-2">
                      <Users className="size-4 text-green" /> Seats: {item.seats}
                    </li>
                  )}
                  {item.sleeps && (
                    <li className="flex items-center gap-2">
                      <BedDouble className="size-4 text-green" /> Sleeps: {item.sleeps}
                    </li>
                  )}
                  {item.baseLocation && (
                    <li className="flex items-center gap-2">
                      <MapPin className="size-4 text-green" /> {item.baseLocation}
                    </li>
                  )}
                </ul>
                <div className="mt-5">
                  <CtaButton href={`/innovations/${item.slug}`} label="EXPLORE" />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <ViewAllLink href="/innovations" label="View More Innovations" />
    </section>
  )
}

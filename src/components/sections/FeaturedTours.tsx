import Image from 'next/image'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { CtaButton } from '@/components/CtaButton'
import { ViewAllLink } from '@/components/ViewAllLink'
import { getPayloadClient } from '@/lib/payload'

export async function FeaturedTours() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tours',
    where: { active: { equals: true }, featured: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 6,
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="TOURS" subtitle="Explore our curated tour packages" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((tour) => {
          const image = typeof tour.heroImage === 'object' ? tour.heroImage : null
          return (
            <article
              key={tour.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt ?? tour.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
                )}
              </div>

              <div className="p-5">
                <h3 className="text-center font-display text-xl italic text-green">{tour.name}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {tour.durationLabel && (
                    <li className="flex items-center gap-2">
                      <Clock className="size-4 text-green" /> {tour.durationLabel}
                    </li>
                  )}
                  {tour.routeLabel && (
                    <li className="flex items-center gap-2">
                      <MapPin className="size-4 text-green" /> {tour.routeLabel}
                    </li>
                  )}
                  {tour.season && (
                    <li className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-green" /> {tour.season}
                    </li>
                  )}
                </ul>
                {tour.shortDescription && (
                  <p className="mt-3 text-sm text-muted-foreground">{tour.shortDescription}</p>
                )}
                <div className="mt-5 text-center">
                  <CtaButton href={`/tours/${tour.slug}`} label="EXPLORE" />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <ViewAllLink href="/tours" label="View All Tours" />
    </section>
  )
}

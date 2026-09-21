import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Info, MapPin, Users } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { CtaButton } from '@/components/CtaButton'
import { getPayloadClient } from '@/lib/payload'

// Reads the name off a populated relationship field (or returns null).
const relName = (value: unknown): string | null =>
  value && typeof value === 'object' && 'name' in value ? String((value as { name: string }).name) : null

export async function FeaturedCaravans() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'caravans',
    where: { active: { equals: true }, featured: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 6,
  })

  if (docs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="CARAVANS" subtitle="Discover our featured caravans" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((caravan) => {
          const image = typeof caravan.heroImage === 'object' ? caravan.heroImage : null
          const className = relName(caravan.class)
          return (
            <article
              key={caravan.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt ?? caravan.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
                )}
                {className && (
                  <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-sm font-semibold text-green">
                    {className}
                  </span>
                )}
              </div>

              <div className="p-5 text-center">
                <h3 className="font-display text-2xl italic text-green">{caravan.name}</h3>
                <ul className="mt-3 space-y-2 text-left text-sm">
                  {caravan.sleeps && (
                    <li className="flex items-center gap-2">
                      <BedDouble className="size-4 text-green" /> Sleeps {caravan.sleeps}
                    </li>
                  )}
                  {relName(caravan.driveType) && (
                    <li className="flex items-center gap-2">
                      <Users className="size-4 text-green" /> {relName(caravan.driveType)}
                    </li>
                  )}
                  {relName(caravan.baseLocation) && (
                    <li className="flex items-center gap-2">
                      <MapPin className="size-4 text-green" /> {relName(caravan.baseLocation)}
                    </li>
                  )}
                  {caravan.chargesFrom && (
                    <li className="flex items-center gap-2">
                      <Info className="size-4 text-green" /> {caravan.chargesFrom}
                    </li>
                  )}
                </ul>
                <div className="mt-5">
                  <CtaButton href={`/caravans/${caravan.slug}`} label="EXPLORE" />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/caravans"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-heading font-semibold uppercase tracking-wider text-green transition hover:brightness-95"
        >
          View All Caravans →
        </Link>
      </div>
    </section>
  )
}

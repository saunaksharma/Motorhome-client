import Image from 'next/image'
import { BedDouble, MapPin, Users } from 'lucide-react'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'

export type InnovationCardData = {
  id: number | string
  name: string
  slug?: string | null
  category?: string | null
  heroImage?: unknown
  seats?: string | null
  sleeps?: string | null
  baseLocation?: string | null
}

// A single innovation card — used on the homepage strip and the listing.
export function InnovationCard({ item }: { item: InnovationCardData }) {
  const image = typeof item.heroImage === 'object' ? (item.heroImage as { url?: string; alt?: string }) : null

  return (
    <article className="spotlight reveal group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? item.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
          <CtaButton href={item.slug ? `/innovations/${item.slug}` : '#'} label="EXPLORE" />
        </div>
      </div>
    </article>
  )
}

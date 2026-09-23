import Image from 'next/image'
import { BedDouble, Info, MapPin, Users } from 'lucide-react'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { relName } from '@/lib/utils'

export type CaravanCardData = {
  id: number | string
  name: string
  slug?: string | null
  heroImage?: unknown
  class?: unknown
  driveType?: unknown
  baseLocation?: unknown
  sleeps?: string | null
  chargesFrom?: string | null
}

// A single caravan card — used on the homepage strip and the listing page.
export function CaravanCard({ caravan }: { caravan: CaravanCardData }) {
  const image = typeof caravan.heroImage === 'object' ? (caravan.heroImage as { url?: string; alt?: string }) : null
  const className = relName(caravan.class)

  return (
    <article className="spotlight reveal group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? caravan.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
          <CtaButton href={caravan.slug ? `/caravans/${caravan.slug}` : '#'} label="EXPLORE" />
        </div>
      </div>
    </article>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import React from 'react'

import { cn, relName } from '@/lib/utils'

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
  shortDescription?: string | null
}

// A caravan card in the style of premium manufacturers (e.g. Adria): one calm tinted
// panel, photo-led, left-aligned name + short line + compact specs, and two actions.
// `split` (homepage row): photo left, text right from sm up — Adria's product slider card.
export function CaravanCard({ caravan, split = false }: { caravan: CaravanCardData; split?: boolean }) {
  const image = typeof caravan.heroImage === 'object' ? (caravan.heroImage as { url?: string; alt?: string }) : null
  const className = relName(caravan.class)
  const href = caravan.slug ? `/caravans/${caravan.slug}` : '#'
  const specs = [
    caravan.sleeps && `Sleeps ${caravan.sleeps.replace(/ people$/i, '')}`,
    relName(caravan.driveType),
    relName(caravan.baseLocation),
  ].filter(Boolean)

  return (
    <article
      className={cn(
        'reveal group flex flex-col overflow-hidden rounded-3xl bg-green/[0.06] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(13_71_63/0.45)]',
        split && 'sm:flex-row',
      )}
    >
      <Link
        href={href}
        className={cn('relative block aspect-[16/10] overflow-hidden', split && 'sm:aspect-auto sm:min-h-[340px] sm:w-[42%] sm:shrink-0')}
        tabIndex={-1}
        aria-hidden
      >
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? caravan.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
        )}
        {className && (
          <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {className} class
          </span>
        )}
      </Link>

      <div className={cn('flex flex-1 flex-col p-6 sm:p-7', split && 'sm:justify-center sm:p-7')}>
        <h3 className="font-display text-2xl tracking-wide text-green sm:text-3xl">
          <Link href={href} className="hover:text-green/80">
            {caravan.name}
          </Link>
        </h3>
        {caravan.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-green/70">{caravan.shortDescription}</p>
        )}
        {specs.length > 0 && (
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-xs uppercase tracking-[0.15em] text-green/60">
            {specs.map((spec, i) => (
              <React.Fragment key={spec as string}>
                {i > 0 && <span aria-hidden className="size-1 rounded-full bg-gold" />}
                <span>{spec}</span>
              </React.Fragment>
            ))}
          </p>
        )}

        <div className="mt-auto flex gap-3 pt-6">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-green px-5 py-3 font-heading text-sm uppercase tracking-wider text-white transition-colors hover:bg-green/90"
          >
            Explore <ChevronRight className="size-4" />
          </Link>
          <Link
            href={`/contact?destination=${encodeURIComponent(caravan.name)}`}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-green/30 px-5 py-3 font-heading text-sm uppercase tracking-wider text-green transition-colors hover:border-green hover:bg-green hover:text-white"
          >
            Enquire <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

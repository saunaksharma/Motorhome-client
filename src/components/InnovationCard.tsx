import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import React from 'react'

export type InnovationCardData = {
  id: number | string
  name: string
  slug?: string | null
  category?: string | null
  heroImage?: unknown
  seats?: string | null
  baseLocation?: string | null
  shortDescription?: string | null
}

// An innovation (specialised vehicle) card — same calm style as the caravan card:
// tinted panel, photo-led, short line, compact specs, Explore + Enquire.
export function InnovationCard({ item }: { item: InnovationCardData }) {
  const image = typeof item.heroImage === 'object' ? (item.heroImage as { url?: string; alt?: string }) : null
  const href = item.slug ? `/innovations/${item.slug}` : '#'
  const specs = [item.seats && `Seats ${item.seats}`, item.baseLocation].filter(Boolean)

  return (
    <article className="reveal group flex flex-col overflow-hidden rounded-3xl bg-green/[0.06] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(13_71_63/0.45)]">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden>
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
        )}
        {item.category && (
          <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {item.category}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-2xl text-green">
          <Link href={href} className="hover:text-green/80">
            {item.name}
          </Link>
        </h3>
        {item.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-green/70">{item.shortDescription}</p>
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

        {/* Phones: compact buttons that fit side by side down to ~340px (e.g. 360px Android);
            narrower or with large system text they wrap to two rows instead of being cut off. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-6 sm:gap-3">
          <Link
            href={href}
            className="inline-flex min-w-[6.75rem] flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-green px-3 py-3 font-heading text-[13px] uppercase tracking-wide text-white sm:px-4 sm:text-sm sm:tracking-wider transition-colors hover:bg-green/90"
          >
            Explore <ChevronRight className="size-4" />
          </Link>
          <Link
            href={`/contact?destination=${encodeURIComponent(item.name)}`}
            className="inline-flex min-w-[6.75rem] flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-green/30 px-3 py-3 font-heading text-[13px] uppercase tracking-wide text-green sm:px-4 sm:text-sm sm:tracking-wider transition-colors hover:border-green hover:bg-green hover:text-white"
          >
            Enquire <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

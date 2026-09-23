import Image from 'next/image'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'

export type Highlight = { label: string; value?: string | null }

// Header for caravan / tour / innovation pages, after premium product pages (Adria):
// a big photo with the name over it, then a white "quick facts" bar overlapping its
// foot with the main action. Empty facts are skipped; no photo → patterned green.
export function DetailHero({
  image,
  eyebrow,
  title,
  highlights,
  cta,
}: {
  image?: unknown
  eyebrow?: string | null
  title: string
  highlights: Highlight[]
  cta: { href: string; label: string }
}) {
  const photo = typeof image === 'object' && image !== null ? (image as { url?: string; alt?: string }) : null
  const facts = highlights.filter((h) => h.value)

  return (
    <header className="px-3 sm:px-4">
      <div className="relative flex h-[58svh] min-h-[380px] max-h-[640px] items-end overflow-hidden rounded-3xl pattern-green">
        {photo?.url && (
          <Image src={photo.url} alt={photo.alt ?? title} fill priority sizes="100vw" className="object-cover" />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1100px] px-4 pb-20 sm:px-6">
          {eyebrow && (
            <p className="rise-in font-heading text-sm uppercase tracking-[0.3em] text-white/85">{eyebrow}</p>
          )}
          <h1 className="rise-in mt-2 font-display text-5xl italic text-gold drop-shadow-md sm:text-7xl">{title}</h1>
        </div>
      </div>

      <div className="relative mx-auto -mt-12 max-w-[1100px] px-1 sm:px-6">
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0_18px_40px_-20px_rgb(13_71_63/0.35)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          {facts.length > 0 && (
            <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-heading text-[11px] uppercase tracking-[0.25em] text-green/50">{fact.label}</dt>
                  <dd className="mt-1 font-heading text-lg font-semibold tracking-wide text-green">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="shrink-0">
            <CtaButton href={cta.href} label={cta.label} />
          </div>
        </div>
      </div>
    </header>
  )
}

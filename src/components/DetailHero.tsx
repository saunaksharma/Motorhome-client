import Image from 'next/image'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { cn, focalPosition } from '@/lib/utils'

export type Highlight = { label: string; value?: string | null }

// Header for caravan / tour / innovation pages, after premium product pages (Adria):
// a big photo with the name over it, then the quick facts + main action.
//   sm and up — the facts sit in a white bar overlapping the photo's foot.
//   phones    — no floating box: the name sits low on a deeper fade, and the facts
//               follow as a clean two-column list with hairlines and a full-width button.
// The photo is cropped around the focal point set in the admin (Media → focal point).
// Empty facts are skipped; no photo → patterned green.
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
  const photo =
    typeof image === 'object' && image !== null
      ? (image as { url?: string; alt?: string; focalX?: number | null; focalY?: number | null })
      : null
  const facts = highlights.filter((h) => h.value)

  return (
    <header className="px-3 sm:px-4">
      <div className="relative flex h-[62svh] min-h-[400px] max-h-[640px] items-end overflow-hidden rounded-3xl pattern-green sm:h-[58svh] sm:min-h-[380px]">
        {photo?.url && (
          <Image
            src={photo.url}
            alt={photo.alt ?? title}
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover"
            style={{ objectPosition: focalPosition(photo) }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-45% to-transparent sm:from-black/75 sm:via-black/20 sm:via-50%"
        />
        <div className="relative mx-auto w-full max-w-[1100px] px-5 pb-7 sm:px-6 sm:pb-20">
          {eyebrow && (
            <p className="rise-in font-heading text-xs uppercase tracking-[0.3em] text-white/85 sm:text-sm">{eyebrow}</p>
          )}
          <h1 className="rise-in mt-2 text-balance font-display text-[2.2rem] leading-[1.08] text-gold drop-shadow-md sm:text-7xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="relative mx-auto mt-6 max-w-[1100px] px-2 sm:-mt-12 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:bg-white sm:p-6 sm:px-8 sm:shadow-[0_18px_40px_-20px_rgb(13_71_63/0.35)]">
          {facts.length > 0 && (
            <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  // Long values (e.g. a tour route) take the full row on phones instead of wrapping into a column.
                  className={cn(
                    'border-t border-green/10 pt-3 sm:border-0 sm:pt-0',
                    (fact.value ?? '').length > 22 && 'col-span-2',
                  )}
                >
                  <dt className="font-heading text-[11px] uppercase tracking-[0.25em] text-green/50">{fact.label}</dt>
                  <dd className="mt-1 font-heading text-base font-bold uppercase tracking-wide text-green sm:text-lg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="shrink-0 *:block *:w-full *:text-center sm:*:inline-block sm:*:w-auto">
            <CtaButton href={cta.href} label={cta.label} />
          </div>
        </div>
      </div>
    </header>
  )
}

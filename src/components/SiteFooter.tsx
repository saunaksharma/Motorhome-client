import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'
import { NewsletterForm } from './NewsletterForm'
import { SocialIcon } from './SocialIcon'

type Media = { url?: string | null; alt?: string | null }
export type Business = {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  mapUrl?: string | null
  hours?: string | null
}
type FooterData = {
  logo?: Media | number | null
  backgroundImage?: Media | number | null
  columns?: ({ heading: string; links?: ({ label: string; link: string } | null)[] | null } | null)[] | null
  socials?: ({ platform: string; url: string } | null)[] | null
  newsletter?: { heading?: string | null; subtext?: string | null; ctaLabel?: string | null } | null
}

const asMedia = (v: unknown): Media | null => (typeof v === 'object' && v !== null ? (v as Media) : null)

// Old-site column style: bold white capitals over a 2px gold rule; links white capitals
// that turn gold and nudge right on hover.
const FOOTER_HEADING = 'border-b-2 border-brand-gold pb-2.5 font-heading text-base font-bold uppercase tracking-wide text-white'
const FOOTER_LINK =
  'block py-0.5 font-heading text-sm uppercase tracking-wide text-white transition-[color,translate] hover:translate-x-1 hover:text-brand-gold'

// Footer in the style of the client's previous site: full-bleed photo (client-editable)
// under a black film with a soft sheen, the newsletter block, a centred logo + MOTORHOME
// ADVENTURES (Cinzel gold), link columns with white headings on a gold underline, socials
// and copyright.
export function SiteFooter({ data, business }: { data: FooterData; business?: Business | null }) {
  const hasContact = Boolean(business?.phone || business?.email || business?.address || business?.whatsapp)
  const nl = data?.newsletter ?? {}
  const logo = asMedia(data?.logo)
  const bg = asMedia(data?.backgroundImage)
  const columns = (data?.columns ?? []).filter(Boolean) as {
    heading: string
    links?: ({ label: string; link: string } | null)[] | null
  }[]
  const socials = (data?.socials ?? []).filter(Boolean) as { platform: string; url: string }[]

  return (
    <footer className="relative mt-16 overflow-hidden text-white">
      {/* Background photo (falls back to the camp line-art pattern when unset). */}
      {bg?.url ? (
        <Image src={bg.url} alt="" fill sizes="100vw" className="object-cover" />
      ) : null}
      {/* Black film + sheen (old site: black overlay on the footer photo). */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0',
          bg?.url ? 'bg-gradient-to-b from-black/75 via-black/50 to-black/80' : 'bg-[#0a0e0d]',
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgb(255_255_255/0.08),transparent_60%)]"
      />

      <div className="relative">
        {/* Newsletter */}
        <div className="border-b border-white/15 px-4 py-12 text-center">
          <h2 className="font-display text-3xl ">{nl.heading || 'Join The Caravan CLUB'}</h2>
          {nl.subtext && <p className="mt-2 text-white/85">{nl.subtext}</p>}
          <NewsletterForm ctaLabel={nl.ctaLabel || 'SUBSCRIBE NOW'} />
        </div>

        <div className="mx-auto max-w-[1200px] px-4">
          {/* Logo + brand name, centred (as on the old site). */}
          <div className="flex flex-wrap items-center justify-center gap-4 pb-4 pt-12 text-center">
            {logo?.url && (
              <Image src={logo.url} alt="" width={120} height={120} className="h-14 w-auto sm:h-20" />
            )}
            <span className="font-brand text-xl font-bold uppercase tracking-[0.2em] text-brand-gold sm:text-3xl">
              Motorhome Adventures
            </span>
          </div>

          {/* Link columns — white headings on a gold underline, white capital links. */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 py-10">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className={FOOTER_HEADING}>{col.heading}</h3>
                <div className="mt-5 space-y-2">
                  {(col.links ?? []).filter(Boolean).map((l) => (
                    <Link key={l!.label} href={l!.link || '#'} className={FOOTER_LINK}>
                      {l!.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact details — edited in Site Settings → Business Details. */}
            {hasContact && (
              <div>
                <h3 className={FOOTER_HEADING}>Reach Us</h3>
                <div className="mt-5 space-y-2 text-sm text-white/90">
                  {business?.phone && (
                    <a href={`tel:${business.phone.replace(/[^\d+]/g, '')}`} className="block hover:text-gold">
                      {business.phone}
                    </a>
                  )}
                  {business?.whatsapp && (
                    <a
                      href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-gold"
                    >
                      WhatsApp us
                    </a>
                  )}
                  {business?.email && (
                    <a href={`mailto:${business.email}`} className="block hover:text-gold">
                      {business.email}
                    </a>
                  )}
                  {business?.address && <p className="whitespace-pre-line text-white/75">{business.address}</p>}
                  {business?.mapUrl && (
                    <a href={business.mapUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-gold">
                      Find us on Google Maps ↗
                    </a>
                  )}
                  {business?.hours && <p className="text-white/75">{business.hours}</p>}
                </div>
              </div>
            )}
          </div>

          {socials.length > 0 && (
            <div className="flex justify-center gap-6 border-t border-white/15 py-6">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="text-white/90 transition-colors hover:text-gold"
                >
                  <SocialIcon platform={s.platform} className="size-7" />
                </a>
              ))}
            </div>
          )}

          <p className="border-t border-white/15 py-6 text-center text-sm text-white/70">
            © {new Date().getFullYear()} Motorhome Adventures. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

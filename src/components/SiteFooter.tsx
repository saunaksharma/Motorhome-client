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

// Footer: full-bleed photo background (client-editable) with a green scrim, the
// newsletter block, editable link columns, socials and copyright (design pages 40, 48).
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
      <div className={cn('absolute inset-0', bg?.url ? 'bg-green/85' : 'pattern-green bg-green')} />

      <div className="relative">
        {/* Newsletter */}
        <div className="border-b border-white/15 px-4 py-12 text-center">
          <h2 className="font-display text-3xl italic">{nl.heading || 'Join The Caravan CLUB'}</h2>
          {nl.subtext && <p className="mt-2 text-white/85">{nl.subtext}</p>}
          <NewsletterForm ctaLabel={nl.ctaLabel || 'SUBSCRIBE NOW'} />
        </div>

        <div className="mx-auto max-w-[1200px] px-4">
          {/* Logo + link columns */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 py-12">
            <div>
              {logo?.url ? (
                <Image src={logo.url} alt="Motorhome Adventures" width={120} height={120} className="h-20 w-auto" />
              ) : (
                <span className="font-display text-2xl italic text-gold">Motorhome Adventures</span>
              )}
              <p className="mt-4 max-w-[26ch] text-sm text-white/75">
                Home away home, on wheels — pioneering caravan travel in India since 1993.
              </p>
            </div>

            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="font-heading text-base uppercase tracking-wide text-gold">{col.heading}</h3>
                <div className="mt-3 space-y-1.5">
                  {(col.links ?? []).filter(Boolean).map((l) => (
                    <Link
                      key={l!.label}
                      href={l!.link || '#'}
                      className="block text-sm text-white/90 transition-colors hover:text-gold"
                    >
                      {l!.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact details — edited in Site Settings → Business Details. */}
            {hasContact && (
              <div>
                <h3 className="font-heading text-base uppercase tracking-wide text-gold">Reach Us</h3>
                <div className="mt-3 space-y-1.5 text-sm text-white/90">
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

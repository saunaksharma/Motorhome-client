import Link from 'next/link'
import React from 'react'

import { NewsletterForm } from './NewsletterForm'

type FooterData = {
  columns?: ({ heading: string; links?: ({ label: string; link: string } | null)[] | null } | null)[] | null
  socials?: ({ platform: string; url: string } | null)[] | null
  newsletter?: { heading?: string | null; subtext?: string | null; ctaLabel?: string | null } | null
}

// Footer: newsletter block + editable link columns + socials (design pages 40, 48).
export function SiteFooter({ data }: { data: FooterData }) {
  const nl = data?.newsletter ?? {}
  const columns = (data?.columns ?? []).filter(Boolean) as {
    heading: string
    links?: ({ label: string; link: string } | null)[] | null
  }[]
  const socials = (data?.socials ?? []).filter(Boolean) as { platform: string; url: string }[]

  return (
    <footer className="mt-16 pattern-green text-white">
      <div className="border-b border-white/15 px-4 py-12 text-center">
        <h2 className="font-display text-3xl italic">{nl.heading || 'Join The Caravan CLUB'}</h2>
        {nl.subtext && <p className="mt-2 text-white/85">{nl.subtext}</p>}
        <NewsletterForm ctaLabel={nl.ctaLabel || 'SUBSCRIBE NOW'} />
      </div>

      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 py-12">
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-heading text-base uppercase tracking-wide text-gold">
                {col.heading}
              </h3>
              <div className="mt-2 space-y-1">
                {(col.links ?? []).filter(Boolean).map((l) => (
                  <Link
                    key={l!.label}
                    href={l!.link || '#'}
                    className="block text-white/90 transition-colors hover:text-gold"
                  >
                    {l!.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {socials.length > 0 && (
          <div className="flex justify-center gap-5 pb-8">
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 transition-colors hover:text-gold"
              >
                {s.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}

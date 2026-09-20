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
    <footer className="site-footer">
      <div className="site-footer__newsletter">
        <h2>{nl.heading || 'Join The Caravan CLUB'}</h2>
        {nl.subtext && <p>{nl.subtext}</p>}
        <NewsletterForm ctaLabel={nl.ctaLabel || 'SUBSCRIBE NOW'} />
      </div>

      <div className="container">
        <div className="site-footer__cols">
          {columns.map((col) => (
            <div className="site-footer__col" key={col.heading}>
              <h3>{col.heading}</h3>
              {(col.links ?? []).filter(Boolean).map((l) => (
                <Link key={l!.label} href={l!.link || '#'}>
                  {l!.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {socials.length > 0 && (
          <div className="site-footer__socials">
            {socials.map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}

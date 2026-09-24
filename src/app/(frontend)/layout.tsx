import type { Metadata } from 'next'
import { Cinzel, Lato } from 'next/font/google'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { siteURL } from '@/lib/siteUrl'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import './globals.css'

// Typography (client's choice): Cinzel — the old site's MOTORHOME ADVENTURES font — for the
// brand name AND every heading/title (upright, never slanted); Lato for everything else, as on
// the old site. One Cinzel file serves both.
const cinzel = Cinzel({ weight: ['500', '600', '700', '800'], subsets: ['latin'], variable: '--font-cinzel' })
const lato = Lato({ weight: ['300', '400', '700', '900'], subsets: ['latin'], variable: '--font-lato' })

const description =
  'Caravan & motorhome rentals, guided tours, and custom builds across India. Home away home, on wheels.'

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: {
    default: 'Motorhome Adventures — Caravan & Motorhome Rentals in India',
    template: '%s | Motorhome Adventures',
  },
  description,
  openGraph: {
    type: 'website',
    siteName: 'Motorhome Adventures',
    title: 'Motorhome Adventures',
    description,
  },
}

// Shown until the client fills in the Header global's nav items.
const FALLBACK_NAV = [
  { label: 'Home', link: '/' },
  { label: 'About Us', link: '/about' },
  { label: 'Tours', link: '/tours' },
  { label: 'Caravans', link: '/caravans' },
  { label: 'Innovations', link: '/innovations' },
  { label: 'Blogs', link: '/blog' },
  { label: 'Gallery', link: '/gallery' },
  { label: 'Build Your Own', link: '/build' },
]

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: await config })
  const [header, footer, business] = await Promise.all([
    payload.findGlobal({ slug: 'header', depth: 1 }),
    payload.findGlobal({ slug: 'footer', depth: 1 }),
    payload.findGlobal({ slug: 'business', depth: 0 }),
  ])

  const nav = (header?.navItems?.length ? header.navItems : FALLBACK_NAV).map(
    (i: { label: string; link?: string | null }) => ({ label: i.label, link: i.link || '/' }),
  )
  const headerLogo = typeof header?.logo === 'object' && header.logo ? header.logo.url : null

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cinzel.variable} ${lato.variable}`}>
      <body>
        <SiteHeader brand="MOTORHOME ADVENTURES" logoUrl={headerLogo} nav={nav} />
        <main>{children}</main>
        <SiteFooter data={footer} business={business} />
        <WhatsAppButton number={business?.whatsapp} />
      </body>
    </html>
  )
}

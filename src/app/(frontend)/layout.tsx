import type { Metadata } from 'next'
import { Lato, Oswald, Racing_Sans_One } from 'next/font/google'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import './globals.css'

const racing = Racing_Sans_One({ weight: '400', subsets: ['latin'], variable: '--font-racing' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-lato' })

const serverURL = process.env.SERVER_URL || 'http://localhost:3000'
const description =
  'Caravan & motorhome rentals, guided tours, and custom builds across India. Home away home, on wheels.'

export const metadata: Metadata = {
  metadataBase: new URL(serverURL),
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
  { label: 'About Us', link: '/' },
  { label: 'Caravans', link: '/caravans' },
  { label: 'Innovations', link: '/innovations' },
  { label: 'Blogs', link: '/blog' },
  { label: 'Gallery', link: '/gallery' },
  { label: 'Build Your Own', link: '/build' },
]

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: await config })
  const [header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'header', depth: 1 }),
    payload.findGlobal({ slug: 'footer', depth: 1 }),
  ])

  const nav = (header?.navItems?.length ? header.navItems : FALLBACK_NAV).map(
    (i: { label: string; link?: string | null }) => ({ label: i.label, link: i.link || '/' }),
  )
  const headerLogo = typeof header?.logo === 'object' && header.logo ? header.logo.url : null

  return (
    <html lang="en" className={`${racing.variable} ${oswald.variable} ${lato.variable}`}>
      <body>
        <SiteHeader brand="MOTORHOME ADVENTURES" logoUrl={headerLogo} nav={nav} />
        <main>{children}</main>
        <SiteFooter data={footer} />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Cinzel, Lato } from 'next/font/google'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { siteURL } from '@/lib/siteUrl'
import { JsonLd } from '@/components/JsonLd'
import { ScrollFallback } from '@/components/ScrollFallback'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import './globals.css'

// Typography (client's choice): Cinzel — the old site's MOTORHOME ADVENTURES font — for the
// brand name AND every heading/title (upright, never slanted); Lato for everything else, as on
// the old site. One Cinzel file serves both.
const cinzel = Cinzel({ weight: ['500', '600', '700', '800'], subsets: ['latin'], variable: '--font-cinzel' })
const lato = Lato({ weight: ['400', '700', '900'], subsets: ['latin'], variable: '--font-lato' })

const description =
  'Caravan & motorhome rentals, guided tours, and custom builds across India. Home away home, on wheels.'

// Site-wide defaults. The share image (WhatsApp / social previews) is the first
// homepage hero photo, so it follows the client's own choice in the admin; pages with
// their own photo (caravans, tours, …) override it.
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'hero-slides',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 1,
  })
  const heroImage = docs[0]?.backgroundImage
  const shareImage = typeof heroImage === 'object' && heroImage?.url ? heroImage.url : undefined

  return {
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
      images: shareImage ? [shareImage] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
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

  // Tells Google this is a travel business and how to reach it (structured data).
  // Built only from details filled in the admin; empty ones are left out.
  const socialUrls = (footer?.socials ?? []).map((s) => s?.url).filter(Boolean)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Motorhome Adventures',
    url: siteURL,
    description,
    ...(business?.phone && { telephone: business.phone }),
    ...(business?.email && { email: business.email }),
    ...(business?.address && { address: business.address }),
    ...(socialUrls.length > 0 && { sameAs: socialUrls }),
  }

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cinzel.variable} ${lato.variable}`}>
      <body>
        {/* First Tab stop: jump past the menu straight to the page content. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:font-heading focus:text-sm focus:font-semibold focus:uppercase focus:tracking-wider focus:text-green"
        >
          Skip to content
        </a>
        <JsonLd data={jsonLd} />
        <SiteHeader brand="MOTORHOME ADVENTURES" logoUrl={headerLogo} nav={nav} />
        <main id="main">{children}</main>
        <SiteFooter data={footer} business={business} />
        <WhatsAppButton number={business?.whatsapp} />
        <ScrollFallback />
      </body>
    </html>
  )
}

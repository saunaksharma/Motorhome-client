import React from 'react'

import { HeroCarousel } from '@/components/sections/HeroCarousel'
import { FeaturedCaravans } from '@/components/sections/FeaturedCaravans'
import { FeaturedTours } from '@/components/sections/FeaturedTours'
import { InnovationsStrip } from '@/components/sections/InnovationsStrip'
import { ReviewsCarousel } from '@/components/sections/ReviewsCarousel'
import { AboutSections } from '@/components/sections/AboutSections'
import { TipsAccordion } from '@/components/sections/TipsAccordion'
import { Footprint } from '@/components/sections/Footprint'
import { DreamBigCta } from '@/components/sections/DreamBigCta'

// Rebuild this page at most once a minute so CMS edits show up in production.
export const revalidate = 60
export const metadata = { alternates: { canonical: '/' } }

export default function HomePage() {
  // Section order mirrors the client's reference site:
  // Hero → Reviews → Tours → Caravans → Innovations → About story → (our extras).
  return (
    <>
      <HeroCarousel />
      <ReviewsCarousel />
      <FeaturedTours />
      <FeaturedCaravans />
      <InnovationsStrip />
      <AboutSections />
      <TipsAccordion />
      <Footprint />
      <DreamBigCta />
    </>
  )
}

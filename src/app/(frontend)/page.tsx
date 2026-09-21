import React from 'react'

import { HeroCarousel } from '@/components/sections/HeroCarousel'
import { FeaturedCaravans } from '@/components/sections/FeaturedCaravans'
import { FeaturedTours } from '@/components/sections/FeaturedTours'
import { ReviewsCarousel } from '@/components/sections/ReviewsCarousel'
import { AboutSections } from '@/components/sections/AboutSections'
import { TipsAccordion } from '@/components/sections/TipsAccordion'
import { Footprint } from '@/components/sections/Footprint'
import { DreamBigCta } from '@/components/sections/DreamBigCta'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FeaturedCaravans />
      <FeaturedTours />
      <ReviewsCarousel />
      <AboutSections />
      <TipsAccordion />
      <Footprint />
      <DreamBigCta />
    </>
  )
}

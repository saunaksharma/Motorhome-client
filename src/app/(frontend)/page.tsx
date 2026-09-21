import React from 'react'

import { HeroCarousel } from '@/components/sections/HeroCarousel'
import { FeaturedCaravans } from '@/components/sections/FeaturedCaravans'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FeaturedCaravans />
    </>
  )
}

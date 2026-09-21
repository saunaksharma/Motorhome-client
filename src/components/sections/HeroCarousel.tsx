import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { HeroCarouselClient, type HeroSlide } from './HeroCarouselClient'

// Loads the active hero slides (in sort order) and renders the carousel.
export async function HeroCarousel() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'hero-slides',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 20,
  })

  const slides: HeroSlide[] = docs.map((slide) => {
    const image = typeof slide.backgroundImage === 'object' ? slide.backgroundImage : null
    return {
      headingLine1: slide.headingLine1,
      headingLine2: slide.headingLine2,
      ctaLabel: slide.ctaLabel,
      ctaLink: slide.ctaLink,
      imageUrl: image?.url ?? null,
      imageAlt: image?.alt ?? null,
    }
  })

  return <HeroCarouselClient slides={slides} />
}

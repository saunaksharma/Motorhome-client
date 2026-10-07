import React from 'react'

import { getHomepage, getPayloadClient } from '@/lib/payload'
import { focalPosition } from '@/lib/utils'
import { HeroCarouselClient, type HeroSlide } from './HeroCarouselClient'

// The homepage h1 when the admin's "Main heading" is empty — the site's own description.
const DEFAULT_TITLE = 'Caravan Rentals & Tours across India'

// Loads the active hero slides (in sort order) and renders the carousel.
export async function HeroCarousel() {
  const payload = await getPayloadClient()
  const title = (await getHomepage())?.heroTitle?.trim() || DEFAULT_TITLE
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
      imagePosition: focalPosition(image),
    }
  })

  return <HeroCarouselClient title={title} slides={slides} />
}

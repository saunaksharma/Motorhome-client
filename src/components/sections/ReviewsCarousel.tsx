import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'
import { ReviewsCarouselClient, type Review } from './ReviewsCarouselClient'

export async function ReviewsCarousel() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'reviews',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 20,
  })

  if (docs.length === 0) return null

  const reviews: Review[] = docs.map((r) => ({
    reviewerName: r.reviewerName,
    rating: r.rating,
    quote: r.quote,
  }))

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="HONEST REVIEWS" subtitle="What our clients say about us" />
      <div className="mt-10">
        <ReviewsCarouselClient reviews={reviews} />
      </div>
    </section>
  )
}

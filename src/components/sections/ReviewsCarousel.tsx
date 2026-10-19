import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'
import { ReviewsCarouselClient, type Review } from './ReviewsCarouselClient'

export async function ReviewsCarousel() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'reviews',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 20,
  })

  if (docs.length === 0) return null
  // Client: "Share Your Experience" = a review on their Google Business Profile (Business Details).
  const googleReviewLink = (await payload.findGlobal({ slug: 'business', depth: 0 })).googleReviewLink?.trim()

  const reviews: Review[] = docs.map((r) => ({
    reviewerName: r.reviewerName,
    rating: r.rating,
    quote: r.quote,
    photoUrl: typeof r.photo === 'object' && r.photo ? (r.photo.url ?? null) : null,
    video: r.video ?? null,
  }))

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <SectionHeading title="HONEST REVIEW" subtitle="What our clients say about us" />
      <div className="mt-10">
        <ReviewsCarouselClient reviews={reviews} />
      </div>
      {googleReviewLink && (
        <div className="mt-10 text-center">
          <p className="mb-4 font-heading text-lg text-green">We&apos;d love to hear about your motorhome adventure!</p>
          <CtaButton href={googleReviewLink} label="Share Your Experience" />
        </div>
      )}
    </section>
  )
}

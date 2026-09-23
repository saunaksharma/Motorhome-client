'use client'

import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import React, { useRef } from 'react'

export type Review = {
  reviewerName: string
  rating?: number | null
  quote?: string | null
  style?: 'quote' | 'featured' | null
  photoUrl?: string | null
}

const Stars = ({ count }: { count?: number | null }) => (
  <div className="flex gap-1">
    {Array.from({ length: count ?? 5 }).map((_, star) => (
      <Star key={star} className="size-4 fill-gold text-gold" />
    ))}
  </div>
)

// Swipeable testimonials row (native scroll-snap) with arrow controls.
export function ReviewsCarouselClient({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLDivElement>(null)

  const scroll = (direction: number) => {
    const el = track.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, index) =>
          // "Featured" reviews (e.g. celebrity guests) show their photo large.
          review.style === 'featured' && review.photoUrl ? (
            <article
              key={index}
              className="relative min-h-60 shrink-0 basis-[85%] snap-start overflow-hidden rounded-2xl bg-green text-white sm:basis-[45%] lg:basis-[31%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={review.photoUrl} alt={review.reviewerName} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-green via-green/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-6">
                <Stars count={review.rating} />
                <p className="mt-2 font-heading uppercase tracking-wide text-gold">{review.reviewerName}</p>
              </div>
            </article>
          ) : (
          <article
            key={index}
            className="shrink-0 basis-[85%] snap-start rounded-2xl bg-green p-6 text-white sm:basis-[45%] lg:basis-[31%]"
          >
            <Stars count={review.rating} />
            {review.quote && <p className="mt-3 text-sm text-white/90">“{review.quote}”</p>}
            <div className="mt-4 flex items-center gap-3">
              {review.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={review.photoUrl}
                  alt={review.reviewerName}
                  className="size-10 rounded-full object-cover ring-2 ring-gold"
                />
              )}
              <p className="font-heading uppercase tracking-wide text-gold">— {review.reviewerName}</p>
            </div>
          </article>
          ),
        )}
      </div>

      <button
        onClick={() => scroll(-1)}
        aria-label="Previous reviews"
        className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full bg-green p-2 text-white shadow-md transition hover:bg-green/90"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Next reviews"
        className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-green p-2 text-white shadow-md transition hover:bg-green/90"
      >
        <ChevronRight />
      </button>
    </div>
  )
}

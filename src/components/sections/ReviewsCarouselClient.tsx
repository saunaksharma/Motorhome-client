'use client'

import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import React, { useRef } from 'react'

export type Review = {
  reviewerName: string
  rating?: number | null
  quote?: string | null
}

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
        {reviews.map((review, index) => (
          <article
            key={index}
            className="shrink-0 basis-[85%] snap-start rounded-2xl bg-green p-6 text-white sm:basis-[45%] lg:basis-[31%]"
          >
            <div className="flex gap-1">
              {Array.from({ length: review.rating ?? 5 }).map((_, star) => (
                <Star key={star} className="size-4 fill-gold text-gold" />
              ))}
            </div>
            {review.quote && <p className="mt-3 text-sm text-white/90">“{review.quote}”</p>}
            <p className="mt-4 font-heading uppercase tracking-wide text-gold">— {review.reviewerName}</p>
          </article>
        ))}
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

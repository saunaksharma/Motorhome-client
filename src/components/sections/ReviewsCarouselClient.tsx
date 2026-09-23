'use client'

import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import React, { useRef } from 'react'

export type Review = {
  reviewerName: string
  rating?: number | null
  quote?: string | null
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
        {reviews.map((review, index) => (
          // One card for every review: the guest's photo fills it, and stars, quote
          // and name sit on a dark fade at the bottom — so the row always looks even.
          <article
            key={index}
            className="relative h-[440px] shrink-0 basis-[85%] snap-start overflow-hidden rounded-3xl bg-green text-white sm:basis-[45%] lg:basis-[31%]"
          >
            {review.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.photoUrl} alt={review.reviewerName} className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="pattern-green absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-green via-green/55 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <Stars count={review.rating} />
              {review.quote && (
                <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-white/90">“{review.quote}”</p>
              )}
              <p className="mt-4 font-heading uppercase tracking-[0.15em] text-gold">{review.reviewerName}</p>
            </div>
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

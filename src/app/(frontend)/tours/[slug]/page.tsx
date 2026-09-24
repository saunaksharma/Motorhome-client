import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { DetailHero } from '@/components/DetailHero'
import { SectionHeading } from '@/components/SectionHeading'
import { TalesAndSnaps } from '@/components/TalesAndSnaps'
import { getPayloadClient } from '@/lib/payload'
import { slugParams } from '@/lib/staticParams'
import { pageMetadata } from '@/lib/seo'
import { relName } from '@/lib/utils'

type Params = Promise<{ slug: string }>

// Pre-built for every active entry (instant); saving in the admin refreshes it.
export const revalidate = 60
export const generateStaticParams = slugParams('tours')

const getTour = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tours',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const tour = await getTour(slug)
  if (!tour) return {}
  return pageMetadata(tour.meta, { title: tour.name, path: `/tours/${slug}`, description: tour.shortDescription, image: tour.heroImage })
}

export default async function TourDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const tour = await getTour(slug)
  if (!tour) notFound()

  const location = relName(tour.location)
  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : []

  return (
    <article>
      <DetailHero
        image={tour.heroImage}
        eyebrow={location}
        title={tour.name}
        highlights={[
          { label: 'Duration', value: tour.durationLabel },
          { label: 'Best season', value: tour.season },
          { label: 'Style', value: tour.category },
          { label: 'Route', value: tour.routeLabel },
        ]}
        cta={{ href: `/contact?destination=${encodeURIComponent(tour.name)}`, label: tour.ctaLabel ?? 'Reserve Your Ride' }}
      />

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="mx-auto max-w-[760px] text-lg leading-relaxed">
          {tour.description ? (
            <div className="rich-text space-y-3">
              <RichText data={tour.description} />
            </div>
          ) : (
            tour.shortDescription && <p>{tour.shortDescription}</p>
          )}
        </div>

        {itinerary.length > 0 && (
          <div className="mt-12">
            <SectionHeading title="Route Map" />
            {/* Day timeline: a gold dot per day on one connecting line (titles as the client wrote them). */}
            <ol className="mx-auto mt-10 max-w-[820px]">
              {itinerary.map((day, index) => (
                <li key={index} className="relative border-l border-gold/40 pb-10 pl-8 last:border-transparent last:pb-0">
                  <span aria-hidden className="absolute -left-[6px] top-1.5 size-3 rounded-full bg-gold ring-4 ring-cream" />
                  <h3 className="font-display text-xl text-green">{day.dayTitle}</h3>
                  {day.description && (
                    <div className="rich-text mt-2 text-[15px] leading-relaxed text-green/80">
                      <RichText data={day.description} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        <TalesAndSnaps tales={tour.tales ? [tour.tales] : []} snaps={tour.snaps ? [tour.snaps] : []} />
      </div>
    </article>
  )
}

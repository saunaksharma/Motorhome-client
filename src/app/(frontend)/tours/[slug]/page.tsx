import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { CtaButton } from '@/components/CtaButton'
import { PageBanner } from '@/components/PageBanner'
import { SectionHeading } from '@/components/SectionHeading'
import { Tabs } from '@/components/Tabs'
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
  return pageMetadata(tour.meta, { title: tour.name, description: tour.shortDescription, image: tour.heroImage })
}

export default async function TourDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const tour = await getTour(slug)
  if (!tour) notFound()

  const heroImage = typeof tour.heroImage === 'object' ? tour.heroImage : null
  const location = relName(tour.location)
  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : []

  const tales = tour.tales && typeof tour.tales === 'object' ? tour.tales : null
  const snaps = tour.snaps && typeof tour.snaps === 'object' ? tour.snaps : null
  const tabs = [
    tales && {
      label: 'Tales',
      content: (
        <Link href={`/blog/${tales.slug}`} className="text-green underline">
          Read the story: {tales.title}
        </Link>
      ),
    },
    snaps && {
      label: 'Snaps',
      content: (
        <Link href={`/gallery/${snaps.slug}`} className="text-green underline">
          View the gallery: {snaps.title}
        </Link>
      ),
    },
  ].filter(Boolean) as { label: string; content: React.ReactNode }[]

  return (
    <article>
      <PageBanner eyebrow={location} title={tour.name} />

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-green/10">
            {heroImage?.url && (
              <Image
                src={heroImage.url}
                alt={heroImage.alt ?? tour.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          <div>
            {tour.description ? (
              <div className="space-y-3 leading-relaxed">
                <RichText data={tour.description} />
              </div>
            ) : (
              tour.shortDescription && <p className="leading-relaxed">{tour.shortDescription}</p>
            )}
            <div className="mt-6">
              <CtaButton
                href={`/contact?destination=${encodeURIComponent(tour.name)}`}
                label={tour.ctaLabel ?? 'Reserve Your Ride'}
              />
            </div>
          </div>
        </div>

        {itinerary.length > 0 && (
          <div className="mt-12">
            <SectionHeading title="Route Map" />
            <div className="mt-8 space-y-6">
              {itinerary.map((day, index) => (
                <div key={index} className="border-l-2 border-gold pl-4">
                  <h3 className="font-display text-lg italic text-green">{day.dayTitle}</h3>
                  {day.description && (
                    <div className="mt-1 text-sm leading-relaxed">
                      <RichText data={day.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tabs.length > 0 && (
          <div className="mt-12">
            <Tabs tabs={tabs} />
          </div>
        )}
      </div>
    </article>
  )
}

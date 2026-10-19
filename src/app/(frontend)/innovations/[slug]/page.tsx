import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { CaravanFaqs, faqJsonLd } from '@/components/CaravanFaqs'
import { ClosingCta } from '@/components/ClosingCta'
import { IconFeatureList } from '@/components/IconFeatureList'
import { InnovationReel } from '@/components/InnovationReel'
import { JsonLd } from '@/components/JsonLd'
import { VideoShowcase } from '@/components/VideoShowcase'
import { DetailHero } from '@/components/DetailHero'
import { PhotoGallery } from '@/components/PhotoGallery'
import { Tabs } from '@/components/Tabs'
import { TalesAndSnaps } from '@/components/TalesAndSnaps'
import { getPayloadClient } from '@/lib/payload'
import { slugParams } from '@/lib/staticParams'
import { pageMetadata, plainText } from '@/lib/seo'

type Params = Promise<{ slug: string }>

// Pre-built for every active entry (instant); saving in the admin refreshes it.
export const revalidate = 60
export const generateStaticParams = slugParams('innovations')

const getInnovation = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'innovations',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 2, // each included feature's own icon
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const item = await getInnovation(slug)
  if (!item) return {}
  return pageMetadata(item.meta, { title: item.name, path: `/innovations/${slug}`, description: plainText(item.description) || item.shortDescription, image: item.heroImage })
}

export default async function InnovationDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const item = await getInnovation(slug)
  if (!item) notFound()

  // Laid out like a caravan page (client: both product pages the same) — see caravans/[slug] —
  // with its own scroll moment.

  // Cover first, then the gallery photos — the scroll reel (up to 8, so it stays a short scroll).
  const photos = [item.heroImage, ...(item.gallery ?? []).map((row) => row?.image)]
    .map((m) => (typeof m === 'object' && m !== null ? (m as { url?: string | null; alt?: string | null }) : null))
    .filter((m): m is { url: string; alt?: string | null } => Boolean(m?.url))
    .slice(0, 8)

  // Overview / Add Ons+ tabs (client: same as Willow).
  const overview = (
    <div>
      <IconFeatureList title="Specifications" variant="tiles" features={item.specifications} extra={item.additionalSpecifications} labels={item.featureLabels} />
      <IconFeatureList title="Unique features" variant="tiles" features={item.uniqueFeatures} extra={item.additionalUniqueFeatures} labels={item.featureLabels} />
      <IconFeatureList title="What's included" features={item.inclusions} extra={item.additionalInclusions} />
      <IconFeatureList title="Not included" features={item.exclusions} extra={item.additionalExclusions} faded />
    </div>
  )
  const addOns = (
    <div>
      <IconFeatureList title="Add-ons" variant="tiles" features={item.addOns} extra={item.additionalAddOns} />
      <p className="mt-2 font-display text-lg text-green">
        Please mention the add-on&apos;s you require at the time of booking
      </p>
    </div>
  )
  const hasAddOns = (Array.isArray(item.addOns) && item.addOns.length > 0) || Boolean(item.additionalAddOns)
  const tabs = [
    { label: 'Overview', content: overview },
    ...(hasAddOns ? [{ label: 'Add Ons+', content: addOns }] : []),
  ]

  // Search engines: the FAQ answers shown on this page (only when there are some).
  const faqs = Array.isArray(item.faqs) ? item.faqs : []

  // "Book Your Call" opens the booking form locked to this vehicle; once it's sent, the visitor goes on
  // to the booking calendar (Business Details → Book Your Call link).
  const enquire = `/contact?type=innovation&destination=${encodeURIComponent(item.name)}`

  return (
    <article>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <DetailHero
        image={item.heroImage}
        eyebrow={item.category}
        title={item.name}
        highlights={[
          { label: 'Seats', value: item.seats },
          { label: 'Sleeps', value: item.sleeps },
          { label: 'Based in', value: item.baseLocation },
        ]}
        cta={{ href: enquire, label: 'Book Your Call' }}
      />

      {item.description && (
        <div className="mx-auto max-w-[1100px] px-4 pt-12">
          <div className="rich-text mx-auto max-w-[760px] space-y-3 text-lg leading-relaxed">
            <RichText data={item.description} />
          </div>
        </div>
      )}

      {/* Full-bleed scroll moment, the innovations' own (caravans zoom out into a collage): the
          vehicle's photos glide past in a 3D coverflow. Needs 3 photos or more. */}
      {photos.length >= 3 && (
        <div className="mt-12">
          <InnovationReel eyebrow={item.category} title={item.name} text={item.shortDescription} photos={photos} cta={{ href: '#photos', label: 'See all photos' }} />
        </div>
      )}

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="mt-4">
          <Tabs tabs={tabs} />
        </div>

        <div id="photos" className="scroll-mt-28">
          <PhotoGallery cover={item.heroImage} gallery={item.gallery} />
        </div>

        {/* This vehicle's own videos (client: above Tales & Snaps). */}
        <VideoShowcase heading="Watch it in action" videos={item.videos} />

        <TalesAndSnaps
          tales={Array.isArray(item.relatedArticles) ? item.relatedArticles : []}
          snaps={Array.isArray(item.snaps) ? item.snaps : []}
        />

        <div className="mt-16">
          <CaravanFaqs faqs={faqs} />
        </div>
      </div>
      <ClosingCta name={item.name} href={enquire} label="Book Your Call" />
    </article>
  )
}

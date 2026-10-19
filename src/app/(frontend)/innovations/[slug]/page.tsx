import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { ClosingCta } from '@/components/ClosingCta'
import { IconFeatureList } from '@/components/IconFeatureList'
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

  // "Book Your Call" opens the booking form locked to this vehicle; once it's sent, the visitor goes on
  // to the booking calendar (Business Details → Book Your Call link).
  const enquire = `/contact?type=innovation&destination=${encodeURIComponent(item.name)}`

  // Overview / Add Ons+ tabs, as on the caravan pages (client: same as Willow).
  const overview = (
    <div>
      <IconFeatureList title="Specifications" variant="tiles" features={item.specifications} extra={item.additionalSpecifications} labels={item.featureLabels} />
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

  return (
    <article>
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

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="mx-auto max-w-[760px] text-lg leading-relaxed">
          {item.shortDescription && <p className="mb-4 font-heading text-xl text-green">{item.shortDescription}</p>}
          {item.description && (
            <div className="rich-text space-y-3">
              <RichText data={item.description} />
            </div>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-[760px]">
          <Tabs tabs={tabs} />
        </div>

        <PhotoGallery cover={item.heroImage} gallery={item.gallery} />

        <VideoShowcase heading="Watch it in action" videos={item.videos} />

        <TalesAndSnaps
          tales={Array.isArray(item.relatedArticles) ? item.relatedArticles : []}
          snaps={Array.isArray(item.snaps) ? item.snaps : []}
        />
      </div>
      <ClosingCta name={item.name} href={enquire} label="Book Your Call" />
    </article>
  )
}

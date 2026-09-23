import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { DetailHero } from '@/components/DetailHero'
import { IconFeatureList } from '@/components/IconFeatureList'
import { PhotoGallery } from '@/components/PhotoGallery'
import { RelatedContent } from '@/components/RelatedContent'
import { Tabs } from '@/components/Tabs'
import { TalesAndSnaps } from '@/components/TalesAndSnaps'
import { getPayloadClient } from '@/lib/payload'
import { slugParams } from '@/lib/staticParams'
import { pageMetadata } from '@/lib/seo'
import { relName } from '@/lib/utils'

type Params = Promise<{ slug: string }>

// Pre-built for every active entry (instant); saving in the admin refreshes it.
export const revalidate = 60
export const generateStaticParams = slugParams('caravans')

// cache() dedupes the fetch across generateMetadata + the page render.
const getCaravan = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  // depth 2 so each linked feature's own icon is populated.
  const { docs } = await payload.find({
    collection: 'caravans',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const caravan = await getCaravan(slug)
  if (!caravan) return {}
  return pageMetadata(caravan.meta, { title: caravan.name, description: caravan.shortDescription, image: caravan.heroImage })
}

export default async function CaravanDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const caravan = await getCaravan(slug)
  if (!caravan) notFound()

  const className = relName(caravan.class)

  const overview = (
    <div>
      <IconFeatureList title="Specifications" variant="tiles" features={caravan.specifications} extra={caravan.additionalSpecifications} />
      <IconFeatureList title="Unique features" variant="tiles" features={caravan.uniqueFeatures} extra={caravan.additionalUniqueFeatures} />
      <IconFeatureList title="What's included" features={caravan.inclusions} extra={caravan.additionalInclusions} />
      <IconFeatureList title="Not included" features={caravan.exclusions} extra={caravan.additionalExclusions} exclude />
    </div>
  )

  const addOns = (
    <div>
      <IconFeatureList title="Add-ons" variant="tiles" features={caravan.addOns} extra={caravan.additionalAddOns} />
      <p className="mt-2 font-display text-lg italic text-green">
        Please mention the add-on&apos;s you require at the time of booking
      </p>
    </div>
  )

  // Only show the Add Ons tab when this caravan actually offers some.
  const hasAddOns = (Array.isArray(caravan.addOns) && caravan.addOns.length > 0) || Boolean(caravan.additionalAddOns)
  const tabs = [
    { label: 'Overview', content: overview },
    ...(hasAddOns ? [{ label: 'Add Ons+', content: addOns }] : []),
  ]

  return (
    <article>
      <DetailHero
        image={caravan.heroImage}
        eyebrow={className ? `${className} class` : undefined}
        title={caravan.name}
        highlights={[
          { label: 'Sleeps', value: caravan.sleeps },
          { label: 'Drive', value: relName(caravan.driveType) },
          { label: 'Based in', value: relName(caravan.baseLocation) },
          { label: 'Base vehicle', value: caravan.baseVehicle },
        ]}
        cta={{ href: `/contact?destination=${encodeURIComponent(caravan.name)}`, label: 'Go Caravanning!' }}
      />

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        {caravan.description && (
          <div className="rich-text mx-auto max-w-[760px] space-y-3 text-lg leading-relaxed">
            <RichText data={caravan.description} />
          </div>
        )}

        <div className="mt-12">
          <Tabs tabs={tabs} />
        </div>

        <PhotoGallery cover={caravan.heroImage} gallery={caravan.gallery} />

        <TalesAndSnaps
          tales={Array.isArray(caravan.relatedArticles) ? caravan.relatedArticles : []}
          snaps={Array.isArray(caravan.snaps) ? caravan.snaps : []}
        />

        <div className="mt-16">
          <RelatedContent
            faqs={Array.isArray(caravan.faqs) ? caravan.faqs : []}
            videos={Array.isArray(caravan.relatedVideos) ? caravan.relatedVideos : []}
          />
        </div>
      </div>
    </article>
  )
}

import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { DetailHero } from '@/components/DetailHero'
import { IconFeatureList } from '@/components/IconFeatureList'
import { PhotoGallery } from '@/components/PhotoGallery'
import { RelatedContent } from '@/components/RelatedContent'
import { Tabs } from '@/components/Tabs'
import { TalesAndSnaps } from '@/components/TalesAndSnaps'
import { ZoomCollage } from '@/components/ZoomCollage'
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
  return pageMetadata(caravan.meta, { title: caravan.name, path: `/caravans/${slug}`, description: caravan.shortDescription, image: caravan.heroImage })
}

export default async function CaravanDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const caravan = await getCaravan(slug)
  if (!caravan) notFound()

  const className = relName(caravan.class)

  // Cover first, then every gallery photo — used by the zoom-out collage.
  const photos = [caravan.heroImage, ...(caravan.gallery ?? []).map((row) => row?.image)]
    .map((m) => (typeof m === 'object' && m !== null ? (m as { url?: string | null; alt?: string | null }) : null))
    .filter((m): m is { url: string; alt?: string | null } => Boolean(m?.url))

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
      <p className="mt-2 font-display text-lg text-green">
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

      {caravan.description && (
        <div className="mx-auto max-w-[1100px] px-4 pt-12">
          <div className="rich-text mx-auto max-w-[760px] space-y-3 text-lg leading-relaxed">
            <RichText data={caravan.description} />
          </div>
        </div>
      )}

      {/* Full-bleed scroll moment: the cover photo zooms out into a collage of this caravan's photos. */}
      <div className="mt-12">
        <ZoomCollage
          eyebrow={className ? `${className} class` : undefined}
          title={caravan.name}
          text={caravan.shortDescription}
          photos={photos}
          cta={{ href: '#photos', label: 'See all photos' }}
        />
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="mt-4">
          <Tabs tabs={tabs} />
        </div>

        <div id="photos" className="scroll-mt-28">
          <PhotoGallery cover={caravan.heroImage} gallery={caravan.gallery} />
        </div>

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

import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { CtaButton } from '@/components/CtaButton'
import { IconFeatureList } from '@/components/IconFeatureList'
import { PageBanner } from '@/components/PageBanner'
import { RelatedContent } from '@/components/RelatedContent'
import { Tabs } from '@/components/Tabs'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { relName } from '@/lib/utils'

type Params = Promise<{ slug: string }>

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
  const heroImage = typeof caravan.heroImage === 'object' ? caravan.heroImage : null

  const overview = (
    <div>
      <IconFeatureList title="Specifications" features={caravan.specifications} />
      <IconFeatureList title="Unique Features" features={caravan.uniqueFeatures} />
      <IconFeatureList title="Inclusions" features={caravan.inclusions} />
      <IconFeatureList title="Exclusions" features={caravan.exclusions} />
    </div>
  )

  const addOns = (
    <div>
      <IconFeatureList title="Add-ons" features={caravan.addOns} />
      <p className="mt-2 font-display text-lg italic text-green">
        Please mention the add-on&apos;s you require at the time of booking
      </p>
    </div>
  )

  const tabs = [
    { label: 'Overview', content: overview },
    { label: 'Add Ons+', content: addOns },
  ]

  return (
    <article>
      <PageBanner eyebrow={className ? `Class — ${className}` : undefined} title={caravan.name} />

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-green/10">
            {heroImage?.url && (
              <Image
                src={heroImage.url}
                alt={heroImage.alt ?? caravan.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          <div>
            {caravan.description && (
              <div className="space-y-3 leading-relaxed">
                <RichText data={caravan.description} />
              </div>
            )}
            <div className="mt-6">
              <CtaButton
                href={`/contact?destination=${encodeURIComponent(caravan.name)}`}
                label="Go Caravanning!"
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs tabs={tabs} />
        </div>

        <div className="mt-16">
          <RelatedContent
            faqs={Array.isArray(caravan.faqs) ? caravan.faqs : []}
            videos={Array.isArray(caravan.relatedVideos) ? caravan.relatedVideos : []}
            articles={
              (Array.isArray(caravan.relatedArticles) ? caravan.relatedArticles : []).filter(
                (a): a is NonNullable<typeof a> & object => typeof a === 'object' && a !== null,
              )
            }
          />
        </div>
      </div>
    </article>
  )
}

import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { ClosingCta } from '@/components/ClosingCta'
import { DetailHero } from '@/components/DetailHero'
import { PhotoGallery } from '@/components/PhotoGallery'
import { getPayloadClient } from '@/lib/payload'
import { slugParams } from '@/lib/staticParams'
import { pageMetadata } from '@/lib/seo'

type Params = Promise<{ slug: string }>

// Pre-built for every active entry (instant); saving in the admin refreshes it.
export const revalidate = 60
export const generateStaticParams = slugParams('innovations')

const getInnovation = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'innovations',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const item = await getInnovation(slug)
  if (!item) return {}
  return pageMetadata(item.meta, { title: item.name, path: `/innovations/${slug}`, description: item.shortDescription, image: item.heroImage })
}

export default async function InnovationDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const item = await getInnovation(slug)
  if (!item) notFound()

  const enquire = `/contact?destination=${encodeURIComponent(item.name)}`

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
        cta={{ href: enquire, label: 'Enquire Now' }}
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

        <PhotoGallery cover={item.heroImage} gallery={item.gallery} />
      </div>
      <ClosingCta name={item.name} href={enquire} label="Enquire Now" />
    </article>
  )
}

import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { GalleryGrid, type GalleryImage } from '@/components/GalleryGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'
import { slugParams } from '@/lib/staticParams'
import { pageMetadata } from '@/lib/seo'

type Params = Promise<{ slug: string }>

// Pre-built for every active entry (instant); saving in the admin refreshes it.
export const revalidate = 60
export const generateStaticParams = slugParams('galleries')

// cache() dedupes the fetch across generateMetadata + the page render.
const getGallery = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'galleries',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const gallery = await getGallery(slug)
  if (!gallery) return {}
  const firstImage = Array.isArray(gallery.images) ? gallery.images[0]?.image : undefined
  return pageMetadata(gallery.meta, { title: gallery.title, image: firstImage })
}

export default async function GalleryDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const gallery = await getGallery(slug)
  if (!gallery) notFound()

  const images: GalleryImage[] = (Array.isArray(gallery.images) ? gallery.images : [])
    .map((row) => {
      const image = row && typeof row.image === 'object' ? (row.image as { url?: string; alt?: string }) : null
      if (!image?.url) return null
      return { url: image.url, alt: image.alt ?? undefined, caption: row.caption ?? undefined }
    })
    .filter((v) => v !== null) as GalleryImage[]

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title={gallery.title} />
      <div className="mt-10">
        <GalleryGrid images={images} />
      </div>
    </div>
  )
}

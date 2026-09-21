import { notFound } from 'next/navigation'
import React from 'react'

import { GalleryGrid, type GalleryImage } from '@/components/GalleryGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

type Params = Promise<{ slug: string }>

async function getGallery(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'galleries',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export default async function GalleryDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const gallery = await getGallery(slug)
  if (!gallery) notFound()

  const images: GalleryImage[] = (Array.isArray(gallery.images) ? gallery.images : [])
    .map((row) => {
      const image = row && typeof row.image === 'object' ? row.image : null
      return image?.url ? { url: image.url, alt: image.alt ?? undefined, caption: row.caption ?? undefined } : null
    })
    .filter((v): v is GalleryImage => v !== null)

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title={gallery.title} />
      <div className="mt-10">
        <GalleryGrid images={images} />
      </div>
    </div>
  )
}

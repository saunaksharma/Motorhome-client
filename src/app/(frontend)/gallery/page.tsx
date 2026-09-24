import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'
import { focalPosition } from '@/lib/utils'

export const metadata = { title: 'Gallery' }

// Refresh from the CMS at most once a minute in production.
export const revalidate = 60

export default async function GalleryPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'galleries',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title="GALLERY" subtitle="Snaps from the road" />

      {docs.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((gallery) => {
            const photos = Array.isArray(gallery.images) ? gallery.images : []
            const first = photos[0]
            const image = first && typeof first.image === 'object' ? first.image : null
            // Album card in the tour-card style: photo-led, title + photo count on a soft fade.
            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.slug}`}
                className="reveal group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-green/10 sm:aspect-[4/3]"
              >
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt ?? gallery.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ objectPosition: focalPosition(image) }}
                  />
                ) : (
                  <div className="pattern-green h-full w-full" />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-heading text-xs uppercase tracking-[0.25em] text-gold">
                    {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-white">{gallery.title}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">No galleries yet.</p>
      )}
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

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
            const first = Array.isArray(gallery.images) ? gallery.images[0] : null
            const image = first && typeof first.image === 'object' ? first.image : null
            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3]">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt ?? gallery.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display text-xl italic text-green">{gallery.title}</h3>
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

import React from 'react'

import { GalleryGrid, type GalleryImage } from '@/components/GalleryGrid'
import { SectionHeading } from '@/components/SectionHeading'

type Media = { url?: string | null; alt?: string | null }
const asMedia = (v: unknown): Media | null => (typeof v === 'object' && v !== null ? (v as Media) : null)

// "Photo Gallery" section for a caravan / innovation: the cover photo plus every
// gallery image, opened in the lightbox. Hidden when there are no extra photos.
export function PhotoGallery({ cover, gallery }: { cover?: unknown; gallery?: unknown }) {
  const rows = Array.isArray(gallery) ? (gallery as { image?: unknown }[]) : []
  const extra = rows.map((row) => asMedia(row?.image)).filter((m): m is Media => Boolean(m?.url))
  if (extra.length === 0) return null

  const coverMedia = asMedia(cover)
  const images: GalleryImage[] = [coverMedia, ...extra]
    .filter((m): m is Media => Boolean(m?.url))
    .map((m) => ({ url: m.url as string, alt: m.alt ?? undefined }))

  return (
    <section className="mt-16">
      <SectionHeading title="Photo Gallery" />
      <div className="mt-8">
        <GalleryGrid images={images} />
      </div>
    </section>
  )
}

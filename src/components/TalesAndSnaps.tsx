import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

import { BlogCard, type BlogCardData } from '@/components/BlogCard'
import { GalleryGrid, type GalleryImage } from '@/components/GalleryGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { Tabs } from '@/components/Tabs'

type Album = {
  id: number | string
  title: string
  slug?: string | null
  images?: ({ image?: unknown; caption?: string | null } | null)[] | null
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

// "Tales & Snaps" (the client's own naming, 2022 brief): Tales = stories from the
// road (article cards), Snaps = photo albums (photo grid + link to the full album).
// Used on tour and caravan pages. A tab only appears when it has content, and the
// whole section is hidden when both are empty.
export function TalesAndSnaps({ tales = [], snaps = [] }: { tales?: unknown[]; snaps?: unknown[] }) {
  const articles = tales.filter(isObject) as unknown as BlogCardData[]
  const albums = (snaps.filter(isObject) as unknown as Album[]).filter((a) => (a.images ?? []).length > 0)
  if (articles.length === 0 && albums.length === 0) return null

  const talesPanel = (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.slice(0, 6).map((article) => (
        <BlogCard key={article.id} article={article} />
      ))}
    </div>
  )

  const snapsPanel = (
    <div className="space-y-12">
      {albums.map((album) => {
        const photos: GalleryImage[] = (album.images ?? [])
          .map((row): GalleryImage | null => {
            const media = row && isObject(row.image) ? (row.image as { url?: string; alt?: string }) : null
            return media?.url ? { url: media.url, alt: media.alt ?? album.title, caption: row?.caption ?? undefined } : null
          })
          .filter((photo): photo is GalleryImage => photo !== null)
        return (
          <div key={album.id}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-xl tracking-wide text-green">{album.title}</h3>
              {album.slug && (
                <Link
                  href={`/gallery/${album.slug}`}
                  className="inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-wider text-green hover:text-gold"
                >
                  View album ({photos.length}) <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            <GalleryGrid images={photos.slice(0, 8)} />
          </div>
        )
      })}
    </div>
  )

  const tabs = [
    ...(articles.length > 0 ? [{ label: `Tales (${articles.length})`, content: talesPanel }] : []),
    ...(albums.length > 0 ? [{ label: `Snaps (${albums.length})`, content: snapsPanel }] : []),
  ]

  return (
    <section className="mt-16">
      <SectionHeading title="Tales & Snaps" subtitle="Stories and photos from the road" />
      <div className="mt-8">
        <Tabs tabs={tabs} />
      </div>
    </section>
  )
}

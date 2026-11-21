import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { siteURL as serverURL } from '@/lib/siteUrl'

// Detail collections and the URL path they live under.
const detailCollections = [
  ['caravans', '/caravans'],
  ['tours', '/tours'],
  ['innovations', '/innovations'],
  ['blog-articles', '/blog'],
  ['galleries', '/gallery'],
  ['pages', ''], // admin text pages (Terms, Privacy, FAQ…) live at /<slug>
] as const

// Rebuilt hourly (not only on deploy), so pages the client edits show up with a fresh date.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const staticPaths = ['', '/about', '/dream-big-with-us', '/caravans', '/tours', '/innovations', '/blog', '/gallery', '/build', '/contact']
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${serverURL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  for (const [collection, base] of detailCollections) {
    const { docs } = await payload.find({
      collection,
      where: { active: { equals: true } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    })
    for (const doc of docs) {
      if (doc.slug) {
        // lastModified = when it was last edited — Google uses it to decide what to re-crawl first.
        entries.push({ url: `${serverURL}${base}/${doc.slug}`, lastModified: doc.updatedAt, changeFrequency: 'weekly', priority: 0.6 })
      }
    }
  }

  return entries
}

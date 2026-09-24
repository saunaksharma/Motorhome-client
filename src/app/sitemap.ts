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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const staticPaths = ['', '/about', '/caravans', '/tours', '/innovations', '/blog', '/gallery', '/build', '/contact']
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
    })
    for (const doc of docs) {
      if (doc.slug) {
        entries.push({ url: `${serverURL}${base}/${doc.slug}`, changeFrequency: 'weekly', priority: 0.6 })
      }
    }
  }

  return entries
}

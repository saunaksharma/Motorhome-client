import type { CollectionSlug } from 'payload'

import { getPayloadClient } from '@/lib/payload'

// generateStaticParams for a `/<something>/[slug]` page: pre-build one page per
// active document so every detail page is served instantly. New slugs added later
// are built on first visit, and saving in the admin refreshes them.
export const slugParams = (collection: CollectionSlug) => async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection,
    where: { active: { equals: true } },
    limit: 1000,
    depth: 0,
    pagination: false,
  })
  return docs
    .map((doc) => (doc as { slug?: string | null }).slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }))
}

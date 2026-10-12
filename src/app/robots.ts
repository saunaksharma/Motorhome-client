import type { MetadataRoute } from 'next'

import { siteURL as serverURL } from '@/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    // Photos used to be served from /api/media/file/… (now the storage bucket); old links to that path
    // stay crawlable (Google Images, link previews) — the more specific Allow beats Disallow /api.
    rules: { userAgent: '*', allow: ['/', '/api/media/file/'], disallow: ['/admin', '/api'] },
    sitemap: `${serverURL}/sitemap.xml`,
  }
}

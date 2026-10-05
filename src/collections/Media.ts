import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media & Accounts',
    description: 'Every photo used on the website. Upload here, then pick it on any page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Photo description',
      type: 'text',
      required: true,
      admin: { description: 'A few words about the photo, e.g. "Willow caravan at sunset in Ladakh". Helps Google and blind visitors.' },
    },
  ],
  upload: {
    // Let Vercel's CDN keep each photo for a week after the first request, so repeat requests
    // (resized copies, admin thumbnails) don't read Blob storage every time — the free plan
    // allows only 10K Blob reads a month. URLs are unchanged.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Vercel-CDN-Cache-Control', 'max-age=604800')
      return headers
    },
  },
}

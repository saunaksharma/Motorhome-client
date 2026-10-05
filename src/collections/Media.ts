import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media & Accounts',
    description: 'Every photo used on the website. Upload here, then pick it on any page. Photos only — videos go on YouTube and into Site Settings → Video Showcase.',
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
    // Photos only: a video picked as a "photo" shows as a broken image, and video files would use
    // up the hosting allowance (videos are YouTube links — see Video Showcase).
    mimeTypes: ['image/*'],
    // Let Vercel's CDN keep each photo for a week after the first request, so repeat requests
    // (resized copies, admin thumbnails) don't read Blob storage every time — the free plan
    // allows only 10K Blob reads a month. URLs are unchanged.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Vercel-CDN-Cache-Control', 'max-age=604800')
      return headers
    },
  },
}

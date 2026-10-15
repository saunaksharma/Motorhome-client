import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'
import { validateYouTube } from '../lib/youtube'

// Testimonials — the "Honest Review" swipe carousel (SPEC page 16).
// Two card styles: a big photo card, or a star-rating + quote card. A YouTube link turns the card
// into a video testimonial (plays in the card on click).
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'reviewerName',
    defaultColumns: ['reviewerName', 'style', 'rating', 'active'],
    group: 'Homepage',
    description: 'Customer testimonials shown under the homepage slideshow.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'reviewerName', type: 'text', required: true },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'quote',
      options: [
        { label: 'Quote (rating + text)', value: 'quote' },
        { label: 'Featured (big photo)', value: 'featured' },
      ],
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Star rating, 1–5.' },
    },
    { name: 'quote', type: 'textarea', admin: { description: 'The review text.' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'video',
      label: 'YouTube video (optional)',
      type: 'text',
      validate: validateYouTube,
      admin: {
        description:
          'Paste a YouTube link (a Short is fine) and this card plays the video instead of showing the photo. The cards follow "Sort order", so any pattern works — e.g. photo, video, photo, video.',
      },
    },
    ...listingMeta,
  ],
}

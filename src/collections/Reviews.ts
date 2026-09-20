import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// Testimonials — the "Honest Review" swipe carousel (SPEC page 16).
// Two card styles: a big photo card, or a star-rating + quote card.
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'reviewerName',
    defaultColumns: ['reviewerName', 'rating', 'active', 'featured'],
    group: 'Content',
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
    ...listingMeta,
  ],
}

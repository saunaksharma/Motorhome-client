import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'

// "Snaps" — an image gallery a tour (or caravan) can link to (SPEC page 51).
export const Galleries: CollectionConfig = {
  slug: 'galleries',
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active'],
    group: 'Website Content',
    description: 'Photo albums shown on the Gallery page. Add photos to an album, then drag them to change the order.',
    // "Preview" button in the editor opens the live page.
    preview: (doc) => `/gallery/${doc.slug}`,
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'images',
      type: 'array',
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    ...listingMeta,
  ],
}

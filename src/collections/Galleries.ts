import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'

// "Snaps" — an image gallery a tour (or caravan) can link to (SPEC page 51).
export const Galleries: CollectionConfig = {
  slug: 'galleries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active'],
    group: 'Content',
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

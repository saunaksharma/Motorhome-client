import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// The homepage "TIPS" accordion (SPEC pages 29, 32-37). Each tip expands to
// show its body, with an optional video link. Accordion order = sortOrder.
export const Tips: CollectionConfig = {
  slug: 'tips',
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
    { name: 'body', type: 'richText' },
    { name: 'videoUrl', type: 'text', admin: { description: 'Optional YouTube / clip link.' } },
    ...listingMeta,
  ],
}

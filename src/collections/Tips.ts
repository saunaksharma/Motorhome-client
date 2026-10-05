import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// The homepage "TIPS" accordion (SPEC pages 29, 32-37). Each tip expands to
// show its body, with an optional video link. Accordion order = sortOrder.
export const Tips: CollectionConfig = {
  slug: 'tips',
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active'],
    group: 'Homepage',
    description: 'The TIPS list on the homepage. Each tip opens to show its text (use bullet points like the others).',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'videoUrl', type: 'text', admin: { hidden: true } }, // not shown on the site — hidden (data kept)
    ...listingMeta,
  ],
}

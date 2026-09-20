import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// Shared "tick-list with icons" source for caravans (SPEC page 47).
// A caravan references Features via relationship fields filtered by `category`,
// giving the admin an icon tick-list per section, plus a free-text "additional".
export const Features: CollectionConfig = {
  slug: 'features',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'active'],
    group: 'Shared',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Icon shown next to this feature on the site.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Specification', value: 'spec' },
        { label: 'Inclusion', value: 'inclusion' },
        { label: 'Exclusion', value: 'exclusion' },
        { label: 'Unique Feature', value: 'unique-feature' },
        { label: 'Add-on', value: 'add-on' },
      ],
    },
    ...listingMeta,
  ],
}

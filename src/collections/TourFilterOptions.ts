import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// The options shown in the Tours listing filters (SPEC page 49).
// A tour references these via relationship fields filtered by `group`.
export const TourFilterOptions: CollectionConfig = {
  slug: 'tour-filter-options',
  labels: {
    singular: 'Tour Filter Option',
    plural: 'Tour Filter Options',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'active'],
    group: 'Lists & Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Ladakh", "7–15 Days", "Riverside Caravanning".' },
    },
    {
      name: 'group',
      type: 'select',
      required: true,
      options: [
        { label: 'Duration Band', value: 'duration-band' },
        { label: 'Location', value: 'location' },
        { label: 'Preference', value: 'preference' },
      ],
    },
    ...listingMeta,
  ],
}

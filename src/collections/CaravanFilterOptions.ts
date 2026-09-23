import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// The options shown in the Caravans listing filters (SPEC page 41).
// A caravan references these via relationship fields filtered by `group`.
export const CaravanFilterOptions: CollectionConfig = {
  slug: 'caravan-filter-options',
  labels: {
    singular: 'Caravan Filter Option',
    plural: 'Caravan Filter Options',
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
      admin: { description: 'e.g. "Delhi", "Chauffeur Driven", "8–12 Berth", "Zenith".' },
    },
    {
      name: 'group',
      type: 'select',
      required: true,
      options: [
        { label: 'Base Location', value: 'base-location' },
        { label: 'Drive Type', value: 'drive-type' },
        { label: 'Berth Range', value: 'berth-range' },
        { label: 'Class', value: 'class' },
      ],
    },
    ...listingMeta,
  ],
}

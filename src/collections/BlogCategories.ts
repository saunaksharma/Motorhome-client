import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// The blog "Featuring" filter values (SPEC page 52): Caravans, Tours,
// Camping Trip Tips, Camper Maintenance, Camping Trip Reports, etc.
export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  labels: {
    singular: 'Blog Category',
    plural: 'Blog Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'active'],
    group: 'Lists & Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    ...listingMeta,
  ],
}

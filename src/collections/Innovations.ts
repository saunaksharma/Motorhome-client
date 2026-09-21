import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'

// "Our Innovations" — specialized vehicles (Arcade on Wheels, Vanity Van, …).
// Same card pattern as caravans, with a simple category badge.
export const Innovations: CollectionConfig = {
  slug: 'innovations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'active', 'featured'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),
    { name: 'category', type: 'text', admin: { description: 'Badge, e.g. "Gaming", "Beauty".' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Gallery images' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'shortDescription', type: 'textarea', admin: { description: 'Used on cards.' } },
    { name: 'description', type: 'richText' },
    { name: 'seats', type: 'text', admin: { description: 'e.g. "6".' } },
    { name: 'sleeps', type: 'text', admin: { description: 'e.g. "6 people".' } },
    { name: 'baseLocation', type: 'text', admin: { description: 'e.g. "Delhi".' } },
    ...listingMeta,
  ],
}

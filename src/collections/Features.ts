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
    group: 'Lists & Settings',
    description: 'The master list of features you can tick on each caravan.',
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
      // Starts as the shared stand-in icon, so a feature can be added by name alone — the website
      // then picks a matching icon from the name (IconFeatureList / featureIcon).
      defaultValue: async ({ req }) =>
        (await req.payload.find({ collection: 'media', where: { filename: { equals: 'feature-icon.svg' } }, limit: 1, depth: 0 })).docs[0]?.id,
      admin: {
        description: 'Optional: leave the default and the website picks a matching icon from the name. Upload your own icon to replace it.',
      },
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

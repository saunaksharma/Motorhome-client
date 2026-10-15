import type { CollectionConfig } from 'payload'

import { listingMetaWithFeatured } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'
import { additional, featureList } from '../fields/featureList'
import { videosField } from '../fields/videoList'

// "Our Innovations" — specialized vehicles (Arcade on Wheels, Vanity Van, …).
// Same card pattern as caravans, with a simple category badge.
export const Innovations: CollectionConfig = {
  slug: 'innovations',
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'active', 'featured'],
    group: 'Website Content',
    // "Preview" button in the editor opens the live page.
    preview: (doc) => `/innovations/${doc.slug}`,
    description: 'Specialised vehicles (arcade, lounger, vanity van...).',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),
    { name: 'category', label: 'Badge', type: 'text', admin: { description: 'Badge, e.g. "Gaming", "Beauty".' } },
    { name: 'heroImage', label: 'Cover photo', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Gallery images' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    // Videos + Tales & Snaps — the same as on caravans (client), in one box (layout only).
    {
      type: 'collapsible',
      label: 'Videos, Tales & Snaps',
      admin: { description: 'Each part shows on the vehicle page once filled in: videos as "Watch it in action", then the Tales & Snaps tabs.' },
      fields: [
        videosField('videos', 'vehicle', 'Watch it in action'),
        {
          name: 'relatedArticles',
          label: 'Tales (related blog posts)',
          type: 'relationship',
          relationTo: 'blog-articles',
          hasMany: true,
          admin: { description: 'Blog posts about this vehicle — shown in the "Tales" tab.' },
        },
        {
          name: 'snaps',
          label: 'Snaps (photo albums)',
          type: 'relationship',
          relationTo: 'galleries',
          hasMany: true,
          admin: { description: 'Gallery albums with this vehicle — shown in the "Snaps" tab.' },
        },
      ],
    },
    { name: 'shortDescription', label: 'Card text', type: 'textarea', admin: { description: 'One or two lines shown on the vehicle card.' } },
    { name: 'description', label: 'Full description', type: 'richText', admin: { description: 'The text on the vehicle page.' } },
    { name: 'seats', type: 'text', admin: { description: 'e.g. "6".' } },
    { name: 'sleeps', type: 'text', admin: { description: 'e.g. "6 people".' } },
    { name: 'baseLocation', type: 'text', admin: { description: 'e.g. "Delhi".' } },
    // What the hire includes / doesn't (client) — the same tick-lists as caravans.
    featureList('inclusions', "What's included", 'inclusion'),
    additional('additionalInclusions', 'Other inclusions (not in the list above)', 'vehicle'),
    featureList('exclusions', 'Not included', 'exclusion'),
    additional('additionalExclusions', 'Other exclusions (not in the list above)', 'vehicle'),
    ...listingMetaWithFeatured,
  ],
}

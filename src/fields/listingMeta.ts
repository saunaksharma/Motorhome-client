import type { Field } from 'payload'

// Shared on every content collection, per the brief:
// "everything needs sort order, featured flag, active/inactive".
// "Featured" only does something for tours, caravans and innovations (the homepage rows), so
// everywhere else it's hidden (data kept) — `withFeatured` turns it on.
const listingFields = (featured: boolean): Field[] => [
  {
    name: 'sortOrder',
    label: 'Order',
    type: 'number',
    defaultValue: 0,
    admin: {
      position: 'sidebar',
      description: 'Lower numbers show first (1, 2, 3…).',
    },
  },
  {
    name: 'featured',
    label: 'Show on the homepage',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      hidden: !featured,
      description: 'Tick to show it in its row on the homepage.',
    },
  },
  {
    name: 'active',
    label: 'Show on the website',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      position: 'sidebar',
      description: 'Untick to hide it from the website without deleting it.',
    },
  },
]

export const listingMeta = listingFields(false)
export const listingMetaWithFeatured = listingFields(true)

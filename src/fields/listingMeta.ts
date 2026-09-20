import type { Field } from 'payload'

// Shared on every content collection, per the brief:
// "everything needs sort order, featured flag, active/inactive".
export const listingMeta: Field[] = [
  {
    name: 'sortOrder',
    type: 'number',
    defaultValue: 0,
    admin: {
      position: 'sidebar',
      description: 'Lower numbers show first.',
    },
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    admin: { position: 'sidebar' },
  },
  {
    name: 'active',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      position: 'sidebar',
      description: 'Uncheck to hide from the site.',
    },
  },
]

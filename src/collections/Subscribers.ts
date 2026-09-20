import type { CollectionConfig } from 'payload'

// Newsletter sign-ups — "Join The Caravan CLUB" (SPEC page 48).
// Anyone can subscribe (create); reads stay admin-only by default.
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    group: 'Submissions',
  },
  access: {
    create: () => true,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
  ],
}

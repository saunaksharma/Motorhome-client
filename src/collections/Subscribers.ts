import type { CollectionConfig } from 'payload'

import { rejectBots } from '../hooks/formProtection'

// Newsletter sign-ups — "Join The Caravan CLUB" (SPEC page 48).
// Anyone can subscribe (create); reads stay admin-only by default.
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    group: 'Inbox',
    description: 'People who joined the newsletter (Join The Caravan CLUB).',
  },
  access: {
    create: () => true,
  },
  hooks: {
    beforeOperation: [rejectBots],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
  ],
}

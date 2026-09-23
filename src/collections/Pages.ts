import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slugField'

// Generic content pages the client can create unlimited of — Terms, Privacy, FAQ,
// Returning Customer benefits, Influencer Programme, Partner With Us, B2B, etc.
// Each renders at /<slug>. This is the core "no developer needed" promise.
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'active'],
    group: 'Website Content',
    // "Preview" button in the editor opens the live page.
    preview: (doc) => `/${doc.slug}`,
    description: 'Extra pages like Terms, Privacy, FAQ. Each one lives at yoursite.com/<slug>.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'body', type: 'richText' },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}

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
    {
      name: 'form',
      label: 'Button below the text',
      type: 'select',
      // Was a review form; the client now takes reviews on Google only (value kept, so saved pages still work).
      options: [{ label: '"Write a review on Google" (Returning Customer Benefits)', value: 'review' }],
      admin: { description: 'Optional. Opens the Google review link from Site Settings → Business Details.' },
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}

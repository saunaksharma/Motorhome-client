import type { CollectionConfig } from 'payload'

import { faqsField } from '../fields/faqs'
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
    {
      name: 'showTips',
      label: 'Show the Tips first',
      type: 'checkbox',
      admin: { description: 'Shows your Tips (Homepage → Tips) at the top of this page, before the text — used by the Tips & FAQs page.' },
    },
    { name: 'body', type: 'richText' },
    faqsField('under the text, each answer opening on click (e.g. the Tips & FAQs page)'),
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

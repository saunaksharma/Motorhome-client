import type { GlobalConfig } from 'payload'

// The "Dream Big With Us" page (/dream-big-with-us) — the client's partner programme for owners of
// caravans built by Motorhome Adventures (her PDF, 2026-10-15). Opened by the homepage Dream Big
// button and the footer's "Partner With Us". Every part is edited here; empty parts are hidden.
export const DreamBig: GlobalConfig = {
  slug: 'dream-big',
  label: 'Dream Big page',
  admin: {
    group: 'Homepage',
    preview: () => '/dream-big-with-us',
    description: 'The "Dream Big With Us" page (partner programme), opened by the homepage Dream Big button and the footer.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Dream Big with Us' },
    { name: 'tagline', type: 'text', admin: { description: 'One line under the heading, e.g. "Turn Your Caravan into a Smart Investment".' } },
    { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'The photo beside the opening text.' } },
    { name: 'intro', label: 'Opening text', type: 'richText' },
    { name: 'howHeading', label: 'How it works — heading', type: 'text', defaultValue: 'Here’s how it works' },
    { name: 'how', label: 'How it works — text', type: 'richText' },
    {
      name: 'statement',
      label: 'Big line',
      type: 'text',
      admin: { description: 'Shown large at the end of "How it works", e.g. "No marketing. No management. No stress."' },
    },
    { name: 'statementNote', label: 'Line under the big line', type: 'text' },
    { name: 'benefitsHeading', label: 'Benefits — heading', type: 'text', defaultValue: 'Why our owners love this model' },
    {
      name: 'benefits',
      type: 'array',
      labels: { singular: 'Benefit', plural: 'Benefits' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'closing', label: 'Closing text', type: 'textarea' },
    { name: 'ctaLabel', label: 'Button 1 text', type: 'text', defaultValue: 'Book Your Consultation' },
    { name: 'ctaLink', label: 'Button 1 link', type: 'text', admin: { description: 'e.g. the Brevo B2B booking page.' } },
    { name: 'secondCtaLabel', label: 'Button 2 text (optional)', type: 'text' },
    { name: 'secondCtaLink', label: 'Button 2 link', type: 'text', admin: { description: 'e.g. the caravan-building website. Leave the text empty to hide this button.' } },
  ],
}

import type { Field } from 'payload'

// Questions & answers, each opening on click (caravan, innovation and text pages; also given to Google).
// `where`: the admin note's "shown …" part.
export const faqsField = (where: string): Field => ({
  name: 'faqs',
  label: "FAQ's",
  type: 'array',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { description: `Questions & answers shown ${where}.` },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
})

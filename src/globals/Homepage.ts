import type { GlobalConfig } from 'payload'

// Editable homepage content sections (SPEC section 3). Note: About Us lives on
// the homepage (it redirects to Home), so its text/images are edited here —
// design page 53 requires "About us Content change - Image and Written".
// Hero slides, reviews, tips, featured caravans/tours are their own collections
// pulled in by featured/sortOrder, so they are NOT duplicated here.
// The "Which tier" block is deferred until the client picks the copy (page 30 vs 31).
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
  },
  fields: [
    // "Where Every Journey Finds a Story" (SPEC page 16)
    {
      name: 'reviewsIntro',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'aboutBlurb', type: 'richText' },
      ],
    },
    // About Us sections — "How It All Began", "The People Behind the Wheel", etc. (pages 24-28)
    {
      name: 'aboutSections',
      type: 'array',
      labels: { singular: 'About section', plural: 'About sections' },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imageSide',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Image on left', value: 'left' },
            { label: 'Image on right', value: 'right' },
          ],
        },
      ],
    },
    // "Our Footprint" stat cards (page 38)
    {
      name: 'footprint',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "15+", "365 Days".' } },
        { name: 'label', type: 'text', admin: { description: 'e.g. "Trail Masters".' } },
        { name: 'caption', type: 'text' },
      ],
    },
    // "Dream Big With Us" CTA banner (page 39)
    {
      name: 'dreamBigCta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaLink', type: 'text' },
      ],
    },
  ],
}

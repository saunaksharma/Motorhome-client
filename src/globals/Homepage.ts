import type { GlobalConfig } from 'payload'

// Editable homepage content sections (SPEC section 3). Note: About Us lives on
// the homepage (it redirects to Home), so its text/images are edited here —
// design page 53 requires "About us Content change - Image and Written".
// Hero slides, reviews, tips, featured caravans/tours are their own collections
// pulled in by featured/sortOrder, so they are NOT duplicated here.
// The "Which tier" block is deferred until the client picks the copy (page 30 vs 31).
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Site Settings', preview: () => '/' },
  access: {
    read: () => true,
  },
  fields: [
    // "Where Every Journey Finds a Story" (SPEC page 16)
    {
      name: 'reviewsIntro',
      type: 'group',
      admin: { hidden: true }, // not shown on the site — hidden (data kept)
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
        {
          name: 'year',
          type: 'text',
          admin: { description: 'Shown as the big outlined year above the heading in "Our Story", e.g. "1993".' },
        },
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imageSide',
          type: 'select',
          defaultValue: 'left',
          admin: { hidden: true }, // the Our Story layout no longer uses it — hidden (data kept)
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
      admin: {
        description:
          'The three arches. In every text, " · " starts a new line (e.g. "India · Nepal · Bhutan · Tibet"). A short big text like "15+" is shown extra large.',
      },
      fields: [
        { name: 'intro', label: 'Small text above (optional)', type: 'text', admin: { description: 'e.g. "1 Day Trip · Or".' } },
        { name: 'value', label: 'Big text', type: 'text', required: true, admin: { description: 'e.g. "15+", "365 Days".' } },
        { name: 'caption', label: 'Small text below (optional)', type: 'text', admin: { description: 'e.g. "Years · Driver & Helper · Experience".' } },
        { name: 'label', label: 'Name under the arch', type: 'text', admin: { description: 'e.g. "Trail Masters".' } },
      ],
    },
    // "Dream Big With Us" CTA banner (page 39)
    {
      name: 'dreamBigCta',
      type: 'group',
      admin: { description: 'The "Dream Big With Us" banner: a heading and two buttons (design page 39). Leave a button\'s text empty to hide it.' },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'ctaLabel', label: 'Button 1 text (outlined)', type: 'text' },
        { name: 'ctaLink', label: 'Button 1 link', type: 'text', admin: { description: 'e.g. /blog/… or /about' } },
        { name: 'secondCtaLabel', label: 'Button 2 text (white)', type: 'text' },
        { name: 'secondCtaLink', label: 'Button 2 link', type: 'text', admin: { description: 'e.g. /blog/… or /contact' } },
      ],
    },
  ],
}

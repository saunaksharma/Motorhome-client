import type { GlobalConfig } from 'payload'

import { validateYouTube } from '../lib/youtube'

// Editable homepage content sections (SPEC section 3). Note: About Us lives on
// the homepage (it redirects to Home), so its text/images are edited here —
// design page 53 requires "About us Content change - Image and Written".
// Hero slides, reviews, tips, featured caravans/tours are their own collections
// pulled in by featured/sortOrder, so they are NOT duplicated here.
// The "Which tier" block is deferred until the client picks the copy (page 30 vs 31).
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Sections',
  admin: {
    group: 'Homepage',
    preview: () => '/',
    description: 'Our Story (the chapters with the year), Our Footprint (the three arches) and the Dream Big banner. The slideshow, reviews and tips have their own sections in this menu.',
  },
  access: {
    read: () => true,
  },
  fields: [
    // The homepage's one h1 (SEO + clarity): fixed, not rotating, above the slideshow text.
    {
      name: 'heroTitle',
      label: 'Main heading (top of the homepage)',
      type: 'text',
      admin: {
        description:
          'One line saying what you offer — shown small above the slideshow text, and the main heading Google reads. Leave empty for "Caravan & Motorhome Rentals and Tours across India".',
      },
    },
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
      label: 'Our Story',
      type: 'array',
      labels: { singular: 'Chapter', plural: 'Chapters' },
      admin: { description: 'The story chapters, in order. Drag to reorder; the first one opens the section.' },
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
          name: 'video',
          label: 'YouTube video (optional)',
          type: 'text',
          validate: validateYouTube,
          admin: {
            description:
              'Paste a YouTube link — the video plays here instead of the photo (muted, on loop; visitors can turn the sound on).',
          },
        },
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
      label: 'Our Footprint',
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
      label: 'Dream Big banner',
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

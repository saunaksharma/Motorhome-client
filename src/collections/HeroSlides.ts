import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// The homepage hero carousel (SPEC pages 1-14). Client-editable image, text,
// and CTA link (design page 53: "Slider Image, Slider written Data, Book now
// button linking/edit"). Carousel order = sortOrder.
export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  admin: {
    useAsTitle: 'headingLine2',
    defaultColumns: ['headingLine2', 'ctaLabel', 'active'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'headingLine1', type: 'text', admin: { description: 'e.g. "CHOOSE YOUR".' } },
    { name: 'headingLine2', type: 'text', admin: { description: 'Highlighted line, e.g. "HOME AWAY HOME".' } },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'ctaLabel', type: 'text', admin: { description: 'e.g. "BOOK NOW" or "RENT NOW".' } },
    { name: 'ctaLink', type: 'text' },
    ...listingMeta,
  ],
}

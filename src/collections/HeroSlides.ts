import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'

// The homepage hero carousel (SPEC pages 1-14). Client-editable image, text,
// and CTA link (design page 53: "Slider Image, Slider written Data, Book now
// button linking/edit"). Carousel order = sortOrder.
export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'headingLine2',
    defaultColumns: ['headingLine2', 'headingLine1', 'sortOrder', 'active'],
    group: 'Homepage',
    description: 'The big photo slideshow at the top of the homepage.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'headingLine1', label: 'Heading — first line', type: 'text', admin: { description: 'e.g. "CHOOSE YOUR".' } },
    { name: 'headingLine2', label: 'Heading — second line (highlighted)', type: 'text', admin: { description: 'Highlighted line, e.g. "HOME AWAY HOME".' } },
    { name: 'backgroundImage', label: 'Photo', type: 'upload', relationTo: 'media', admin: { description: 'A wide landscape photo. Set its focus point in Media so phones crop it well.' } },
    { name: 'ctaLabel', label: 'Button text', type: 'text', admin: { description: 'e.g. "BOOK NOW" or "RENT NOW".' } },
    { name: 'ctaLink', label: 'Button link', type: 'text', admin: { description: 'Where the button goes, e.g. /tours/the-adventures-of-ladakh or /caravans/willow.' } },
    ...listingMeta,
  ],
}

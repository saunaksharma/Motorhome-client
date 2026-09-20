import type { CollectionConfig, Field } from 'payload'

import { listingMeta } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'

// A filter value limited to one tour filter group.
const filterValue = (name: string, label: string, group: string, hasMany = false): Field => ({
  name,
  label,
  type: 'relationship',
  relationTo: 'tour-filter-options',
  hasMany,
  filterOptions: { group: { equals: group } },
})

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'active', 'featured'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),

    // Media
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Gallery images' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },

    // Copy
    { name: 'shortDescription', type: 'textarea', admin: { description: 'Used on cards.' } },
    { name: 'description', type: 'richText' },

    // Card quick-specs + listing filters (SPEC pages 22, 49)
    { name: 'durationLabel', type: 'text', admin: { description: 'Shown on the card, e.g. "15 Days".' } },
    filterValue('durationBand', 'Duration Band', 'duration-band'),
    { name: 'routeLabel', type: 'text', admin: { description: 'e.g. "Delhi – Ladakh – Delhi".' } },
    filterValue('location', 'Location', 'location'),
    filterValue('preference', 'Preference', 'preference', true),
    { name: 'season', type: 'text', admin: { description: 'e.g. "May – September".' } },

    // Route Map — day-by-day itinerary (SPEC page 51)
    {
      name: 'itinerary',
      label: 'Route Map',
      type: 'array',
      labels: { singular: 'Day', plural: 'Days' },
      fields: [
        { name: 'dayTitle', type: 'text', required: true, admin: { description: 'e.g. "Day 1: Delhi → Corbett".' } },
        { name: 'description', type: 'richText' },
      ],
    },

    // Media highlights (Quick Overview / Caravan Trips / Fun Activities / Vlog, SPEC page 50)
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Fun Activities".' } },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        { name: 'videoUrl', type: 'text', admin: { description: 'YouTube link or short clip URL.' } },
      ],
    },

    // Call to action
    { name: 'ctaLabel', type: 'text', defaultValue: 'RESERVE YOUR RIDE' },
    { name: 'ctaLink', type: 'text' },

    ...listingMeta,
  ],
}

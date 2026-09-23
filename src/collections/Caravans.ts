import type { CollectionConfig, Field } from 'payload'

import { listingMeta } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'

// --- small local helpers so each section reads as one line ---

// A tick-list of Features limited to one category. The custom admin component
// renders every option as a checkbox with its icon; the front-end shows only
// the ticked ones. filterOptions is kept so validation stays category-scoped.
const featureList = (name: string, label: string, category: string): Field => ({
  name,
  label,
  type: 'relationship',
  relationTo: 'features',
  hasMany: true,
  filterOptions: { category: { equals: category } },
  admin: {
    components: {
      Field: {
        path: '/components/admin/FeatureTickList#FeatureTickList',
        clientProps: { category, label },
      },
    },
  },
})

// The matching free-text "or write additional" box for a section (SPEC page 47).
const additional = (name: string, label: string): Field => ({
  name,
  label,
  type: 'text',
  admin: { description: 'Anything not in the tick-list above (free text).' },
})

// A single-select filter value limited to one filter group.
const filterValue = (name: string, label: string, group: string): Field => ({
  name,
  label,
  type: 'relationship',
  relationTo: 'caravan-filter-options',
  filterOptions: { group: { equals: group } },
})

export const Caravans: CollectionConfig = {
  slug: 'caravans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'class', 'driveType', 'baseLocation', 'featured'],
    group: 'Website Content',
    // "Preview" button in the editor opens the live page.
    preview: (doc) => `/caravans/${doc.slug}`,
    description: 'Your caravans. Tick the features each one has; only ticked ones show on the site.',
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

    // Card quick-specs (the icon line on caravan cards, SPEC page 20/21)
    { name: 'sleeps', type: 'text', admin: { description: 'e.g. "4–6 People".' } },
    { name: 'chargesFrom', type: 'text', admin: { description: 'e.g. "Charges Start From Delhi".' } },
    { name: 'baseVehicle', type: 'text', admin: { description: 'e.g. "Tata 4300 wb Chassis".' } },

    // Listing filters (SPEC page 41)
    filterValue('baseLocation', 'Base Location', 'base-location'),
    filterValue('driveType', 'Drive Type', 'drive-type'),
    filterValue('berthRange', 'Berth Range', 'berth-range'),
    filterValue('class', 'Class', 'class'),

    // Features — the tick-lists + "additional" per section (SPEC pages 44–47)
    featureList('specifications', 'Specifications', 'spec'),
    additional('additionalSpecifications', 'Additional specifications'),
    featureList('uniqueFeatures', 'Unique Features', 'unique-feature'),
    additional('additionalUniqueFeatures', 'Additional unique features'),
    featureList('inclusions', 'Inclusions', 'inclusion'),
    additional('additionalInclusions', 'Additional inclusions'),
    featureList('exclusions', 'Exclusions', 'exclusion'),
    additional('additionalExclusions', 'Additional exclusions'),
    featureList('addOns', 'Add-ons', 'add-on'),
    additional('additionalAddOns', 'Additional add-ons'),

    // Media highlights (Quick Look / Walk Through / Unique Feature / Vlog, SPEC page 42)
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Walk Through".' } },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        { name: 'videoUrl', type: 'text', admin: { description: 'YouTube link or short clip URL.' } },
      ],
    },

    // Related content (2022 brief, caravan detail page): FAQs + up to 3 videos + related articles.
    {
      name: 'faqs',
      label: "FAQ's",
      type: 'array',
      labels: { singular: 'FAQ', plural: 'FAQs' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'relatedVideos',
      label: 'Related videos',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'Video', plural: 'Videos' },
      admin: { description: 'Up to 3 YouTube vlog / walk-through links.' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'url', type: 'text', required: true, admin: { description: 'YouTube link or playlist URL.' } },
      ],
    },
    {
      name: 'relatedArticles',
      label: 'Related articles',
      type: 'relationship',
      relationTo: 'blog-articles',
      hasMany: true,
      admin: { description: 'Pick from existing blog articles (the first 4 show on the page).' },
    },

    // Call to action
    { name: 'ctaLabel', type: 'text', defaultValue: 'GO CARAVANNING!' },
    { name: 'ctaLink', type: 'text' },

    ...listingMeta,
  ],
}

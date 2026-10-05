import type { CollectionConfig, Field } from 'payload'

import { listingMetaWithFeatured } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'
import { retiredVideosField } from '../fields/videoList'

// --- small local helpers so each section reads as one line ---

// A tick-list of Features limited to one category. The custom admin component
// renders every option as a checkbox with its icon; the front-end shows only
// the ticked ones. filterOptions is kept so validation stays category-scoped.
// `editable` (Specifications, Unique features): each ticked item can be re-worded for this caravan
// only — e.g. tick "Fridge", type "90 L Fridge" (client) — stored in `featureLabels`.
const featureList = (name: string, label: string, category: string, editable = false): Field => ({
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
        clientProps: { category, label, editable },
      },
    },
  },
})

// The matching free-text "or write additional" box for a section (SPEC page 47).
// Shown on the site exactly like a ticked item (IconFeatureList splits on commas/new lines).
const additional = (name: string, label: string): Field => ({
  name,
  label,
  type: 'text',
  admin: {
    description:
      'Only for something this caravan has that is NOT in the tick-list above. Separate items with commas (e.g. "Solar panel, Roof deck"). Each one appears on the website just like a ticked item.',
  },
})

// One feature section in the editor: its tick-list + its "other" box, with a plain-English note.
const featureSection = (label: string, description: string, fields: Field[]): Field => ({
  type: 'collapsible',
  label,
  admin: { initCollapsed: true, description },
  fields,
})

// Kept in the database but not shown on the website — hidden so the editor stays simple.
const unused = (field: Field): Field => ({ ...field, admin: { ...(field.admin ?? {}), hidden: true } }) as Field

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
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'class', 'driveType', 'baseLocation', 'featured', 'active'],
    group: 'Website Content',
    // "Preview" button in the editor opens the live page.
    preview: (doc) => `/caravans/${doc.slug}`,
    description: 'Your caravans. Tick the features each one has; only ticked ones show on the site.',
  },
  access: {
    read: () => true,
  },
  // Grouped into plain-English sections (collapsibles only change the editor's layout —
  // field names and stored data are unchanged).
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'The caravan\'s name, e.g. "Willow".' } },
    slugField(),

    {
      type: 'collapsible',
      label: 'Photos',
      admin: {
        description:
          'Use landscape (wide) photos. The cover is the main picture on the caravan\'s page and card — an outside view works best. Gallery photos appear in "Photo Gallery" in the order listed (drag to reorder).',
      },
      fields: [
        { name: 'heroImage', label: 'Cover photo', type: 'upload', relationTo: 'media' },
        {
          name: 'gallery',
          type: 'array',
          labels: { singular: 'Photo', plural: 'Gallery photos' },
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Description & quick facts',
      fields: [
        {
          name: 'shortDescription',
          label: 'Card text',
          type: 'textarea',
          admin: { description: 'One or two lines — shown on the caravan\'s card in listings.' },
        },
        { name: 'description', label: 'Full description', type: 'richText', admin: { description: 'The full text under the photo on the caravan\'s page.' } },
        { name: 'sleeps', type: 'text', admin: { description: 'Shown as "Sleeps", e.g. "4–6 People".' } },
        { name: 'baseVehicle', type: 'text', admin: { description: 'Shown as "Base vehicle", e.g. "Tata 4300 wb Chassis".' } },
        // Listing filters (SPEC page 41) — also shown as facts on the page.
        filterValue('class', 'Class', 'class'),
        filterValue('driveType', 'Drive Type', 'drive-type'),
        filterValue('baseLocation', 'Base Location', 'base-location'),
        filterValue('berthRange', 'Berth Range (for the filter)', 'berth-range'),
      ],
    },

    // Features — the tick-lists + "other" box per section (SPEC pages 44–47). Each list's
    // options come from Lists & Settings → Features (category = the section).
    featureSection(
      'Features — Specifications',
      'Tick what this caravan has — only ticked items show on its page. A ticked item gets a text box: change its wording for this caravan only (e.g. "90 L Fridge"). Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('specifications', 'Specifications', 'spec', true), additional('additionalSpecifications', 'Other specifications (not in the list above)')],
    ),
    featureSection(
      'Features — Unique features',
      'What makes this caravan special. Tick the ones it has, and change the wording of a ticked one for this caravan if needed. Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('uniqueFeatures', 'Unique Features', 'unique-feature', true), additional('additionalUniqueFeatures', 'Other unique features (not in the list above)')],
    ),
    featureSection(
      'Features — What\'s included',
      'Included in the price. Shown under "What\'s included". Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('inclusions', 'Inclusions', 'inclusion'), additional('additionalInclusions', 'Other inclusions (not in the list above)')],
    ),
    featureSection(
      'Features — Not included',
      'NOT included in the price (shown crossed out under "Not included"). Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('exclusions', 'Exclusions', 'exclusion'), additional('additionalExclusions', 'Other exclusions (not in the list above)')],
    ),
    featureSection(
      'Features — Add-ons',
      'Optional extras guests can ask for (games, bonfire…). The "Add Ons+" tab only appears when at least one is ticked or typed. Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('addOns', 'Add-ons', 'add-on'), additional('additionalAddOns', 'Other add-ons (not in the list above)')],
    ),
    // This caravan's own wording for ticked Specifications / Unique features ({ featureId: text }),
    // edited inside those tick-lists (FeatureTickList) — so not shown as a field of its own.
    { name: 'featureLabels', type: 'json', admin: { hidden: true } },

    {
      type: 'collapsible',
      label: 'Extras (optional)',
      admin: {
        initCollapsed: true,
        description:
          'Leave empty to hide. Each part only appears on the page when filled in.',
      },
      fields: [
        {
          name: 'faqs',
          label: "FAQ's",
          type: 'array',
          labels: { singular: 'FAQ', plural: 'FAQs' },
          admin: { description: 'Questions & answers shown near the bottom of the caravan\'s page.' },
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
        retiredVideosField('relatedVideos'),
        // "Tales & Snaps" (2022 brief): stories + photo albums from trips with this caravan.
        {
          name: 'relatedArticles',
          label: 'Tales (related blog posts)',
          type: 'relationship',
          relationTo: 'blog-articles',
          hasMany: true,
          admin: { description: 'Blog posts about this caravan — shown in the "Tales" tab.' },
        },
        {
          name: 'snaps',
          label: 'Snaps (photo albums)',
          type: 'relationship',
          relationTo: 'galleries',
          hasMany: true,
          admin: { description: 'Gallery albums from trips with this caravan — shown in the "Snaps" tab.' },
        },
      ],
    },

    // Not used by the website (kept so no stored data is lost; hidden from the editor).
    unused({
      name: 'highlights',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        { name: 'videoUrl', type: 'text' },
      ],
    }),
    unused({ name: 'chargesFrom', type: 'text' }),
    unused({ name: 'ctaLabel', type: 'text', defaultValue: 'GO CARAVANNING!' }),
    unused({ name: 'ctaLink', type: 'text' }),

    ...listingMetaWithFeatured,
  ],
}

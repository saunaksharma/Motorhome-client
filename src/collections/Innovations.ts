import type { CollectionConfig } from 'payload'

import { listingMetaWithFeatured } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'
import { faqsField } from '../fields/faqs'
import { additional, featureList, featureSection } from '../fields/featureList'
import { videosField } from '../fields/videoList'

// "Our Innovations" — specialized vehicles (Arcade on Wheels, Vanity Van, …).
// Same card pattern as caravans, with a simple category badge.
export const Innovations: CollectionConfig = {
  slug: 'innovations',
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sortOrder', 'category', 'active', 'featured'],
    group: 'Website Content',
    // "Preview" button in the editor opens the live page.
    preview: (doc) => `/innovations/${doc.slug}`,
    description: 'Specialised vehicles (arcade, lounger, vanity van...).',
  },
  access: {
    read: () => true,
  },
  // Laid out like the caravan editor (client), in plain-English sections. Collapsibles only change
  // the editor's layout — field names and stored data are unchanged.
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'The vehicle\'s name, e.g. "Vanity Van".' } },
    slugField(),

    {
      type: 'collapsible',
      label: 'Photos',
      admin: {
        description:
          'Use landscape (wide) photos. The cover is the main picture on the vehicle\'s page and card. Gallery photos appear in "Photo Gallery" (and the scroll reel) in the order listed (drag to reorder).',
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
      label: 'Videos — Watch it in action',
      fields: [videosField('videos', 'vehicle', 'Watch it in action')],
    },

    {
      type: 'collapsible',
      label: 'Description & quick facts',
      fields: [
        { name: 'shortDescription', label: 'Card text', type: 'textarea', admin: { description: 'One or two lines — shown on the vehicle\'s card in listings, and in the scroll reel on its page.' } },
        { name: 'description', label: 'Full description', type: 'richText', admin: { description: 'The full text under the photo on the vehicle\'s page.' } },
        { name: 'category', label: 'Badge', type: 'text', admin: { description: 'Shown on the card and above the name, e.g. "Gaming", "Beauty".' } },
        { name: 'seats', type: 'text', admin: { description: 'Shown as "Seats", e.g. "6".' } },
        { name: 'sleeps', type: 'text', admin: { description: 'Shown as "Sleeps", e.g. "6 people".' } },
        { name: 'baseLocation', label: 'Based in', type: 'text', admin: { description: 'Shown as "Based in", e.g. "Delhi".' } },
      ],
    },

    // Features — the same tick-lists as caravans (options from Lists & Settings → Features).
    featureSection(
      'Features — Specifications',
      'Tick what this vehicle has — only ticked items show on its page. A ticked item gets a text box: change its wording for this vehicle only. Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('specifications', 'Specifications', 'spec', true), additional('additionalSpecifications', 'Other specifications (not in the list above)', 'vehicle')],
    ),
    featureSection(
      'Features — Unique features',
      'What makes this vehicle special. Tick the ones it has, and change the wording of a ticked one for this vehicle if needed. Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('uniqueFeatures', 'Unique Features', 'unique-feature', true), additional('additionalUniqueFeatures', 'Other unique features (not in the list above)', 'vehicle')],
    ),
    featureSection(
      'Features — What\'s included',
      'Included in the price. Shown under "What\'s included". Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('inclusions', "What's included", 'inclusion'), additional('additionalInclusions', 'Other inclusions (not in the list above)', 'vehicle')],
    ),
    featureSection(
      'Features — Not included',
      'NOT included in the price (shown lighter under "Not included"). Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('exclusions', 'Not included', 'exclusion'), additional('additionalExclusions', 'Other exclusions (not in the list above)', 'vehicle')],
    ),
    featureSection(
      'Features — Add-ons',
      'Optional extras guests can ask for (games, bonfire…). The "Add Ons+" tab only appears when at least one is ticked or typed. Missing from the list? Type it in "Add a new feature" below the list.',
      [featureList('addOns', 'Add-ons', 'add-on'), additional('additionalAddOns', 'Other add-ons (not in the list above)', 'vehicle')],
    ),
    // This vehicle's own wording for ticked Specifications / Unique features ({ featureId: text }),
    // edited inside those tick-lists (FeatureTickList) — so not shown as a field of its own.
    { name: 'featureLabels', type: 'json', admin: { hidden: true } },

    {
      type: 'collapsible',
      label: 'Extras (optional)',
      admin: { initCollapsed: true, description: 'Leave empty to hide. Each part only appears on the page when filled in.' },
      fields: [
        faqsField("near the bottom of the vehicle's page"),
        // "Tales & Snaps": stories + photo albums with this vehicle.
        {
          name: 'relatedArticles',
          label: 'Tales (related blog posts)',
          type: 'relationship',
          relationTo: 'blog-articles',
          hasMany: true,
          admin: { description: "Blog posts about this vehicle, shown in the Tales tab. Pick from your blog articles (a web link can't be pasted here; to use a new story, first add it in Blog Articles)." },
        },
        {
          name: 'snaps',
          label: 'Snaps (photo albums)',
          type: 'relationship',
          relationTo: 'galleries',
          hasMany: true,
          admin: { description: 'Albums with this vehicle, shown in the Snaps tab. Pick from your photo albums (to use new photos, first add an album in Galleries).' },
        },
      ],
    },

    ...listingMetaWithFeatured,
  ],
}

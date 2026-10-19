import type { Field } from 'payload'

// Feature tick-lists shared by caravans and innovations.

// A tick-list of Features limited to one category. The custom admin component
// renders every option as a checkbox with its icon; the front-end shows only
// the ticked ones. filterOptions is kept so validation stays category-scoped.
// `editable` (Specifications, Unique features): each ticked item can be re-worded for this caravan
// only — e.g. tick "Fridge", type "90 L Fridge" (client) — stored in `featureLabels`.
export const featureList = (name: string, label: string, category: string, editable = false): Field => ({
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
export const additional = (name: string, label: string, what = 'caravan'): Field => ({
  name,
  label,
  type: 'text',
  admin: {
    description:
      `Only for something this ${what} has that is NOT in the tick-list above. Separate items with commas (e.g. "Solar panel, Roof deck"). Each one appears on the website just like a ticked item.`,
  },
})

// One feature section in the editor: its tick-list + its "other" box, with a plain-English note.
export const featureSection = (label: string, description: string, fields: Field[]): Field => ({
  type: 'collapsible',
  label,
  admin: { initCollapsed: true, description },
  fields,
})

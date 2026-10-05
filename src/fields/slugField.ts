import type { Field } from 'payload'

const toSlug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // "Kástro" → "Kastro", "Aégis" → "Aegis"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

// A URL slug that auto-fills from another field (default: "name") when left blank.
// Reused by every page-like collection (caravans, tours, blog, ...).
export const slugField = (from = 'name'): Field => ({
  name: 'slug',
  label: 'Web address',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  // Blank is fine in the editor: the hook below fills it from the name on save (the database
  // still requires a value). Without this, the admin refused to save a blank "Web address".
  validate: () => true as const,
  admin: {
    position: 'sidebar',
    description: 'Filled in automatically from the name — leave it empty. Changing it later breaks old links to this page.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return toSlug(value)
        const source = data?.[from]
        return typeof source === 'string' ? toSlug(source) : value
      },
    ],
  },
})

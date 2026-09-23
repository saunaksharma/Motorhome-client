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
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL path. Auto-filled from the title if left blank.',
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

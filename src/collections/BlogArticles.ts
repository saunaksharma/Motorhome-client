import type { CollectionConfig } from 'payload'

import { listingMeta } from '../fields/listingMeta'
import { slugField } from '../fields/slugField'

// "Tales" — blog articles (SPEC page 52). A tour links to a related article.
export const BlogArticles: CollectionConfig = {
  slug: 'blog-articles',
  labels: {
    singular: 'Blog Article',
    plural: 'Blog Articles',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'active'],
    group: 'Website Content',
    // "Preview" button in the editor opens the live page.
    preview: (doc) => `/blog/${doc.slug}`,
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short summary for cards.' } },
    { name: 'body', type: 'richText' },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      admin: { description: 'The "Featuring" tags for this article.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', description: 'Used for the "Published Since" sort.' },
    },
    ...listingMeta,
  ],
}

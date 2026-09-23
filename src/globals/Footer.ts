import type { GlobalConfig } from 'payload'

// Site footer (SPEC pages 40, 48). Fully client-editable link columns, socials,
// and the "Join The Caravan CLUB" newsletter block (design page 53 requires
// "Footer Link and content edit option").
export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site Settings' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      labels: { singular: 'Social link', plural: 'Social links' },
      fields: [
        { name: 'platform', type: 'text', required: true, admin: { description: 'e.g. "Instagram", "Facebook".' } },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Join The Caravan CLUB' },
        { name: 'subtext', type: 'text' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'SUBSCRIBE NOW' },
      ],
    },
  ],
}

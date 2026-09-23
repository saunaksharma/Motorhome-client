import type { GlobalConfig } from 'payload'

// Site header/navigation (SPEC page 20). Stores the nav data (labels + links);
// the visual treatment (icon bar vs text nav — open question) is a front-end
// concern handled in Phase 2, so this is variant-independent.
export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Site Settings' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navItems',
      type: 'array',
      labels: { singular: 'Nav item', plural: 'Nav items' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
      ],
    },
  ],
}

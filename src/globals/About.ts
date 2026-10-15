import type { GlobalConfig } from 'payload'

// RETIRED (client, 2026-10-15: "About us duplication"): its story repeated the homepage's Our Story,
// and the Canva says About Us = the homepage — /about now redirects to /#our-story (next.config).
// Hidden and unused; kept only so its database table (and content) isn't dropped.
export const About: GlobalConfig = {
  slug: 'about',
  admin: { group: 'Site Settings', hidden: true },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'headline', type: 'text', defaultValue: 'About Us' },
    { name: 'intro', type: 'richText', admin: { description: 'The opening story / who we are.' } },
    { name: 'video', label: 'Photo', type: 'upload', relationTo: 'media', admin: { description: 'Optional photo shown beside the story.' } },
    {
      name: 'team',
      label: 'The Team',
      type: 'array',
      labels: { singular: 'Member', plural: 'Team members' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', admin: { description: 'e.g. "Founder", "Head Driver".' } },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'hiring',
      type: 'group',
      label: 'Join our family',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Motorhome Adventures Family is growing!' },
        { name: 'text', type: 'textarea', admin: { description: 'A line about working with the team.' } },
        { name: 'ctaLabel', type: 'text', defaultValue: 'See open roles' },
        { name: 'ctaLink', type: 'text', admin: { description: 'Link to your LinkedIn hiring section.' } },
      ],
    },
    { name: 'instagramUrl', type: 'text', admin: { description: 'Instagram profile URL.' } },
    { name: 'youtubeUrl', type: 'text', admin: { description: 'YouTube channel URL.' } },
  ],
}

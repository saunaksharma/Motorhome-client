import type { GlobalConfig } from 'payload'

// The About Us page (2022 brief, page 11): story, the team (photo + "who is who"),
// a growing-family / hiring block, and social embeds. All client-editable.
export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'headline', type: 'text', defaultValue: 'About Us' },
    { name: 'intro', type: 'richText', admin: { description: 'The opening story / who we are.' } },
    { name: 'video', type: 'upload', relationTo: 'media', admin: { description: 'Optional intro video or photo.' } },
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

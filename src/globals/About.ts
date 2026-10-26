import type { GlobalConfig } from 'payload'

// The About Us page (2022 brief, page 11): story, the team (photo + "who is who"),
// a growing-family / hiring block, and social embeds. All client-editable.
export const About: GlobalConfig = {
  slug: 'about',
  admin: { group: 'Site Settings', preview: () => '/about' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'headline', type: 'text', defaultValue: 'About Us' },
    // The story itself now comes from Homepage → Our Story (shown in full here) — hidden, data kept.
    { name: 'intro', type: 'richText', admin: { hidden: true } },
    { name: 'video', label: 'Photo', type: 'upload', relationTo: 'media', admin: { hidden: true } },
    // The staff section (client): a circle per person — photo, name, designation. Add as many as you like.
    {
      name: 'teamHeading',
      label: 'Team section — title',
      type: 'text',
      defaultValue: 'Meet Our Team',
      admin: { description: 'The title above the circles, e.g. "Meet Our Team" or "Our Staff".' },
    },
    {
      name: 'teamIntro',
      label: 'Team section — short line (optional)',
      type: 'textarea',
      admin: { description: 'One or two lines under the title. Leave empty to show none.' },
    },
    {
      name: 'team',
      label: 'The Team',
      type: 'array',
      labels: { singular: 'Person', plural: 'People' },
      admin: { description: 'Each person shows as a round photo with their name and designation on the About Us page, in this order (drag to reorder). "Add Person" for more.' },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'A square photo, about 800 × 800, face in the centre. No photo yet? Their initials show instead.' },
        },
        { name: 'name', type: 'text', required: true },
        { name: 'role', label: 'Designation', type: 'text', admin: { description: 'e.g. "Founder", "Operations Manager", "Head Driver".' } },
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

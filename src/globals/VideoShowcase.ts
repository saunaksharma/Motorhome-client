import type { GlobalConfig } from 'payload'

// One row of videos shown on every page except the homepage (client, Canva page 44: big rounded
// tiles, tall + wide, scrolling sideways). Same videos everywhere — edited once, here.
// YouTube links (not uploaded files): YouTube hosts and streams them for free, in the right
// quality for each phone, and they don't use up the website's hosting/storage allowance.
export const VideoShowcase: GlobalConfig = {
  slug: 'video-showcase',
  label: 'Video Showcase',
  admin: {
    group: 'Site Settings',
    description:
      'The row of videos shown on every page except the homepage (tours, caravans, innovations, blog, gallery…). Empty = the row is hidden.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Optional title above the videos, e.g. "Life on the road". Leave empty for none.' },
    },
    {
      name: 'videos',
      type: 'array',
      labels: { singular: 'Video', plural: 'Videos' },
      admin: { description: 'Drag to change the order. Mix tall (Shorts) and wide videos, as on the design.' },
      fields: [
        {
          name: 'url',
          label: 'YouTube link',
          type: 'text',
          required: true,
          admin: { description: 'Paste the link from YouTube — a normal video or a Short.' },
        },
        { name: 'title', type: 'text', admin: { description: 'Optional, shown on the tile.' } },
        {
          name: 'shape',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Automatic (Shorts tall, others wide)', value: 'auto' },
            { label: 'Tall', value: 'tall' },
            { label: 'Wide', value: 'wide' },
          ],
        },
      ],
    },
  ],
}

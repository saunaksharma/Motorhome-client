import type { GlobalConfig } from 'payload'

import { videoListFields } from '../fields/videoList'

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
      'The "Watch it in action" row of videos, shown on every page except the homepage (caravans, tours, innovations, blog, gallery…). Empty = the row is hidden.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      label: 'Title above the videos',
      type: 'text',
      defaultValue: 'Watch it in action',
      admin: { description: 'Shown above the videos. Leave empty for no title.' },
    },
    {
      name: 'videos',
      type: 'array',
      labels: { singular: 'Video', plural: 'Videos' },
      label: 'Shared videos',
      admin: { description: "Shown on every page except the homepage — after the page's own videos on caravan, tour and vehicle pages. Drag to change the order. Mix tall (Shorts) and wide videos, as on the design." },
      fields: videoListFields,
    },
  ],
}

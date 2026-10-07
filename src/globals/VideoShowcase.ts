import type { GlobalConfig } from 'payload'

import { videoListFields } from '../fields/videoList'

// RETIRED (client, 2026-10-07): videos are now per caravan / tour / innovation (`videosField`).
// Hidden and unused; kept only so its database tables (and the old demo list) aren't dropped.
export const VideoShowcase: GlobalConfig = {
  slug: 'video-showcase',
  label: 'Video Showcase',
  admin: {
    hidden: true,
    group: 'Site Settings',
    description:
      'The "Watch it in action" row of videos, shown on every caravan, tour and innovation page (the same videos on each). Empty = the row is hidden.',
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
      admin: { description: "The same videos, in this order, on every caravan, tour and innovation page. Drag to change the order. Mix tall (Shorts) and wide videos, as on the design." },
      fields: videoListFields,
    },
  ],
}

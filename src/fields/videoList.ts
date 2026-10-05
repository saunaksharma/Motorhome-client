import type { Field } from 'payload'

import { isYouTubeShort, validateYouTube } from '../lib/youtube'

// A list of YouTube videos for the "Watch it in action" row (Site Settings → Video Showcase).
export const videoListFields: Field[] = [
  {
    name: 'url',
    label: 'YouTube link',
    type: 'text',
    required: true,
    validate: validateYouTube,
    admin: { description: 'Paste the link from YouTube — a normal video or a Short. (Instagram links cannot play on the website.)' },
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
  // Filled on save by asking YouTube whether the video is a Short, so "Automatic" gets the right
  // tile shape however the link was copied (a Short shared as a /watch link included).
  {
    name: 'isShort',
    type: 'checkbox',
    admin: { hidden: true },
    hooks: {
      beforeChange: [async ({ siblingData, value }) => (await isYouTubeShort(String(siblingData?.url ?? ''))) ?? value],
    },
  },
]

// Per-page video lists on caravans / tours / innovations — RETIRED (user: one row of the same
// videos on every page is simpler for the client). Hidden and unused; kept in the config only so
// their database tables stay (removing them would make the schema push drop tables).
export const retiredVideosField = (name: string): Field => ({
  name,
  type: 'array',
  admin: { hidden: true },
  fields: videoListFields,
})

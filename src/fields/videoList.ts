import type { Field } from 'payload'

import { isYouTubeShort, validateYouTube } from '../lib/youtube'

// A list of YouTube videos for the "Watch it in action" row — used by Site Settings → Video
// Showcase (shared, every page) and by each caravan / tour / innovation (its own, shown first).
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

// A page's own videos (caravan / tour / innovation).
export const ownVideosField = (name: string, what: string): Field => ({
  name,
  label: 'Watch it in action — videos',
  type: 'array',
  labels: { singular: 'Video', plural: 'Videos' },
  admin: {
    description: `This ${what}'s own videos, shown first in the "Watch it in action" row on its page. The shared videos from Site Settings → Video Showcase follow them. Drag to reorder.`,
  },
  fields: videoListFields,
})

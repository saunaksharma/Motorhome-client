import type { Field } from 'payload'

import { isYouTubeShort, validateYouTube } from '../lib/youtube'

// The YouTube videos of one caravan / tour / innovation — the video row on its own page.
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
    // Hidden: shapes are detected on save (isShort below), so the client only pastes a link.
    admin: { hidden: true },
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

// Each caravan / tour / innovation has its own videos (client), shown only on its own page.
export const videosField = (name: string, what: string, sectionTitle: string): Field => ({
  name,
  label: 'Videos (YouTube)',
  type: 'array',
  labels: { singular: 'Video', plural: 'Videos' },
  admin: {
    description: `YouTube videos for this ${what} only — shown on its page under "${sectionTitle}". Paste the link; tall Shorts and wide videos are sorted automatically. Leave empty for no video section. Drag to reorder.`,
  },
  fields: videoListFields,
})

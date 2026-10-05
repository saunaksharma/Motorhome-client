import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

import { VideoRow, type ShowcaseVideo } from './VideoRow'
import { parseYouTube } from './YouTubeEmbed'

// The client's video row (Canva page 44), the same on every page except the homepage — edited
// once in Site Settings → Video Showcase. Shows nothing until a video is added there.
export async function VideoShowcase() {
  const payload = await getPayloadClient()
  const { heading, videos: list } = await payload.findGlobal({ slug: 'video-showcase', depth: 0 })

  const videos: ShowcaseVideo[] = (list ?? []).flatMap((v) => {
    const parsed = parseYouTube(v.url)
    if (!parsed?.id) return []
    const tall = v.shape === 'tall' || (v.shape !== 'wide' && parsed.short)
    return [{ id: parsed.id, url: v.url, title: v.title?.trim() || null, tall }]
  })
  if (videos.length === 0) return null

  return (
    <section aria-label={heading || 'Videos'} className="py-12">
      {heading && (
        <div className="mb-8">
          <SectionHeading title={heading} />
        </div>
      )}
      <VideoRow videos={videos} />
    </section>
  )
}

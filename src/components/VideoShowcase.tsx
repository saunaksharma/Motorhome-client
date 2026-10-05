import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

import { VideoRow, type ShowcaseVideo } from './VideoRow'
import { parseYouTube } from '@/lib/youtube'

// The client's "Watch it in action" video row (Canva page 44): the SAME videos, in the same
// order, on every page except the homepage — from Site Settings → Video Showcase. Shows nothing
// when there are none.
// The layout shows it above the footer; a page that renders it itself (or `<NoVideoShowcase />`)
// hides that copy — see `[data-showcase-slot]` in globals.css.
// Keeps the Canva rhythm (tall, wide, tall, wide…) whatever order videos were added in: the two
// shapes alternate, each keeping its own order, starting with the first video's shape. When one
// shape runs out, the rest follow.
function alternate(videos: ShowcaseVideo[]): ShowcaseVideo[] {
  const tall = videos.filter((v) => v.tall)
  const wide = videos.filter((v) => !v.tall)
  const out: ShowcaseVideo[] = []
  let wantTall = videos[0]?.tall ?? true
  while (tall.length || wide.length) {
    const from = (wantTall && tall.length) || !wide.length ? tall : wide
    out.push(from.shift()!)
    wantTall = !wantTall
  }
  return out
}

export async function VideoShowcase() {
  const payload = await getPayloadClient()
  const { heading, videos: list } = await payload.findGlobal({ slug: 'video-showcase', depth: 0 })

  const videos: ShowcaseVideo[] = (list ?? []).flatMap((v) => {
    const parsed = parseYouTube(v.url)
    if (!parsed?.id) return []
    const tall = v.shape === 'tall' || (v.shape !== 'wide' && (v.isShort ?? parsed.short))
    return [{ id: parsed.id, url: v.url, title: v.title?.trim() || null, tall }]
  })
  if (videos.length === 0) return null

  return (
    <section data-video-showcase aria-label={heading || 'Videos'} className="py-12">
      {heading && (
        <div className="mb-8">
          <SectionHeading title={heading} />
        </div>
      )}
      <VideoRow videos={alternate(videos)} />
    </section>
  )
}

// Marker for a page that shouldn't show the layout's video row at all (the homepage).
export function NoVideoShowcase() {
  return <span hidden data-video-showcase />
}

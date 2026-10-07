import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { parseYouTube } from '@/lib/youtube'

import { VideoRow, type ShowcaseVideo } from './VideoRow'

type VideoItem = { url: string; title?: string | null; shape?: string | null; isShort?: boolean | null }

// The same rhythm on every page (client, Canva page 44): tall, wide, tall, wide… — always starting
// with a tall video when there is one; each shape keeps its own order; when one shape runs out, the
// rest follow.
function canvaRhythm(videos: ShowcaseVideo[]): ShowcaseVideo[] {
  const tall = videos.filter((v) => v.tall)
  const wide = videos.filter((v) => !v.tall)
  const out: ShowcaseVideo[] = []
  for (let wantTall = true; tall.length || wide.length; wantTall = !wantTall) {
    out.push(((wantTall && tall.length) || !wide.length ? tall : wide).shift()!)
  }
  return out
}

// One caravan / tour / innovation's own YouTube videos (its "Videos (YouTube)" box in the admin), as
// the big tall/wide tile row from the Canva. Shows nothing when the item has no videos.
export function VideoShowcase({ heading, videos: list }: { heading: string; videos?: VideoItem[] | null }) {
  const videos: ShowcaseVideo[] = (list ?? []).flatMap((v) => {
    const parsed = parseYouTube(v.url)
    if (!parsed?.id) return []
    const tall = v.shape === 'tall' || (v.shape !== 'wide' && (v.isShort ?? parsed.short))
    return [{ id: parsed.id, url: v.url, title: v.title?.trim() || null, tall }]
  })
  if (videos.length === 0) return null

  return (
    <section aria-label={heading} className="py-12">
      <div className="mb-8">
        <SectionHeading title={heading} />
      </div>
      <VideoRow videos={canvaRhythm(videos)} />
    </section>
  )
}

'use client'

import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { youTubeEmbedUrl } from '@/lib/youtube'

export type ShowcaseVideo = { id: string; url: string; title: string | null; tall: boolean }

const hqThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

// One tile: the video's picture with a play button (client: nothing starts by itself). Clicking
// plays it right in the tile, with sound. Scrolling away from the section stops it and shows the
// picture again. YouTube's player loads only on click, so pages stay fast.
function VideoTile({ video }: { video: ShowcaseVideo }) {
  const ref = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  // While playing, stop once the tile is scrolled out of view.
  useEffect(() => {
    const tile = ref.current
    if (!playing || !tile) return
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting || setPlaying(false))
    observer.observe(tile)
    return () => observer.disconnect()
  }, [playing])

  const src = youTubeEmbedUrl(video.url)
  if (!src) return null
  const label = video.title || 'Video'

  return (
    <div
      ref={ref}
      className={cn(
        'relative shrink-0 snap-start overflow-hidden rounded-[2rem] bg-green shadow-[0_24px_50px_-30px_rgb(13_71_63/0.6)]',
        // One height for the whole row at every size (client), as on the Canva. Tall = Shorts
        // (9:16). Wide = 16:9 from sm up; on phones a 16:9 at that height is wider than the
        // screen, so it's 86% of the screen instead and plays centred in it (see the iframe).
        'h-[280px] sm:h-[380px] lg:h-[440px]',
        video.tall ? 'aspect-[9/16]' : 'w-[86vw] sm:aspect-video sm:w-auto',
      )}
    >
      {/* The picture: always underneath, and around a wide video on phones. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail; nothing to optimise, no hosting cost */}
      <img
        src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
        alt=""
        loading="lazy"
        // Sharp HD thumbnail; videos without one get YouTube's 120 px grey stand-in (or an
        // error) — then fall back to the always-present smaller thumbnail.
        onLoad={(e) => e.currentTarget.naturalWidth <= 120 && (e.currentTarget.src = hqThumb(video.id))}
        onError={(e) => (e.currentTarget.src = hqThumb(video.id))}
        className="absolute inset-0 size-full object-cover"
      />
      {playing ? (
        <iframe
          src={`${src}&autoplay=1`}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className={cn(
            'absolute border-0',
            video.tall ? 'inset-0 size-full' : 'inset-x-0 top-1/2 aspect-video w-full -translate-y-1/2 sm:inset-0 sm:size-full sm:translate-y-0',
          )}
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${label}`} className="group absolute inset-0 size-full text-left">
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-green shadow-lg transition group-hover:scale-110 group-hover:bg-white sm:size-16">
            <Play className="size-5 translate-x-0.5 fill-current sm:size-7" />
          </span>
          {video.title && (
            <span className="absolute inset-x-4 bottom-4 font-heading text-xs font-bold uppercase leading-snug tracking-wide text-white drop-shadow sm:inset-x-5 sm:bottom-5 sm:text-base">
              {video.title}
            </span>
          )}
        </button>
      )}
    </div>
  )
}

// The sideways-scrolling row (Canva page 44). Swipe on phones; ← → buttons on larger screens.
export function VideoRow({ videos }: { videos: ShowcaseVideo[] }) {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (direction: 1 | -1) => track.current?.scrollBy({ left: direction * track.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <div className="relative">
      <div
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video, i) => (
          <VideoTile key={`${video.id}-${i}`} video={video} />
        ))}
      </div>
      {videos.length > 1 && (
        <div className="mt-5 hidden justify-end gap-2 sm:flex">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              aria-label={direction < 0 ? 'Previous videos' : 'Next videos'}
              className="rounded-full border border-green/20 p-2 text-green transition hover:border-green hover:bg-green hover:text-white"
            >
              {direction < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import React from 'react'

import { cn } from '@/lib/utils'

// YouTube link (watch / youtu.be / shorts / embed / playlist) → privacy-friendly embed URL, or
// null if it isn't a YouTube link. `ambient` = plays by itself, muted, on loop (like a moving
// photo); the visitor can unmute or go full screen from the player.
export function youTubeEmbedUrl(link: string, ambient = false): string | null {
  let url: URL
  try {
    url = new URL(link.trim())
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\.|^m\./, '')
  const id =
    host === 'youtu.be'
      ? url.pathname.slice(1)
      : host === 'youtube.com' || host === 'youtube-nocookie.com'
        ? url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1]
        : null
  const list = url.searchParams.get('list')
  if (!id && !list) return null

  const params = new URLSearchParams({ rel: '0', playsinline: '1' })
  if (list) params.set('list', list)
  if (ambient) {
    params.set('autoplay', '1')
    params.set('mute', '1')
    params.set('loop', '1')
    if (id && !list) params.set('playlist', id) // YouTube loops a single video only via its own playlist
  }
  const path = id ? `embed/${id.slice(0, 11)}` : 'embed/videoseries'
  return `https://www.youtube-nocookie.com/${path}?${params}`
}

// The video playing right on the page (client: no links out to YouTube). Loads only when
// scrolled near, 16:9. Renders nothing for a link that isn't YouTube.
export function YouTubeEmbed({ url, title, ambient = false, className }: { url: string; title: string; ambient?: boolean; className?: string }) {
  const src = youTubeEmbedUrl(url, ambient)
  if (!src) return null
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className={cn('aspect-video w-full border-0', className)}
    />
  )
}

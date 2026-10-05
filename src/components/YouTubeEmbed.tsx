import React from 'react'

import { cn } from '@/lib/utils'
import { youTubeEmbedUrl } from '@/lib/youtube'

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

// YouTube link helpers, shared by the website (embeds) and the admin (link check).

// The video id (and playlist, if any) of a YouTube link; `short` = a /shorts/ link (tall video).
export function parseYouTube(link: string): { id: string | null; list: string | null; short: boolean } | null {
  let url: URL
  try {
    url = new URL(link.trim())
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\.|^m\./, '')
  const fromPath = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1]
  const id =
    host === 'youtu.be'
      ? url.pathname.slice(1, 12) || null
      : host === 'youtube.com' || host === 'youtube-nocookie.com'
        ? url.searchParams.get('v') ?? fromPath ?? null
        : null
  const list = host.includes('youtu') ? url.searchParams.get('list') : null
  if (!id && !list) return null
  return { id, list, short: url.pathname.startsWith('/shorts/') }
}

// YouTube link (watch / youtu.be / shorts / embed / playlist) → privacy-friendly embed URL, or
// null if it isn't a YouTube link. `ambient` = plays by itself, muted, on loop (like a moving
// photo); the visitor can unmute or go full screen from the player.
export function youTubeEmbedUrl(link: string, ambient = false): string | null {
  const parsed = parseYouTube(link)
  if (!parsed) return null
  const { id, list } = parsed

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

// Admin check for fields that take a YouTube link: an Instagram / Facebook / other link would
// be saved and then silently not shown, so it's refused with a plain explanation.
// (Replaces Payload's own check, so a required field's "empty" message is kept here.)
export const validateYouTube = (value: unknown, options?: { required?: boolean }): true | string => {
  if (!value) return options?.required ? 'Paste a YouTube link here.' : true
  return typeof value === 'string' && parseYouTube(value)
    ? true
    : 'Only YouTube links can play on the website (Instagram or Facebook links cannot). Post the clip on YouTube — a Short is fine — and paste that link.'
}

// Is this YouTube video a Short (tall)? YouTube serves /shorts/<id> only for Shorts and redirects
// normal videos to /watch. Asked once, when a video is saved in the admin. null = couldn't tell.
export async function isYouTubeShort(link: string): Promise<boolean | null> {
  const id = parseYouTube(link)?.id
  if (!id) return null
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(4000) })
    return res.status === 200 ? true : res.status >= 300 && res.status < 400 ? false : null
  } catch {
    return null
  }
}

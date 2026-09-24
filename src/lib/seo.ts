import type { Metadata } from 'next'

type Meta =
  { title?: string | null; description?: string | null; image?: unknown } | null | undefined

const urlOf = (image: unknown) =>
  typeof image === 'object' && image !== null
    ? ((image as { url?: string | null }).url ?? undefined)
    : undefined

// Page metadata from the SEO tab, falling back to the page's own title/summary/photo
// when the client hasn't filled it in. Relative URLs (image, canonical) resolve via
// metadataBase. `path` is the page's own address, e.g. "/tours/the-spiti-sojourn".
export function pageMetadata(
  meta: Meta,
  fallback: { title: string; path: string; description?: string | null; image?: unknown },
): Metadata {
  const title = meta?.title || fallback.title
  const description = meta?.description || fallback.description || undefined
  const image = urlOf(meta?.image) || urlOf(fallback.image)
  return {
    title,
    description,
    alternates: { canonical: fallback.path },
    // A page's openGraph replaces the layout's, so repeat the site-wide fields.
    openGraph: {
      type: 'website',
      siteName: 'Motorhome Adventures',
      url: fallback.path,
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

// Plain text from a rich-text (Lexical) field, cut to about one search-result
// snippet — used as a fallback description for pages that only have a body.
export function plainText(richText: unknown, max = 160): string | undefined {
  const parts: string[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { text?: unknown; children?: unknown[]; root?: unknown }
    if (typeof n.text === 'string') parts.push(n.text)
    if (n.root) walk(n.root)
    if (Array.isArray(n.children)) n.children.forEach(walk)
  }
  walk(richText)
  const text = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (!text) return undefined
  return text.length <= max ? text : text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

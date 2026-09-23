import type { Metadata } from 'next'

type Meta = { title?: string | null; description?: string | null; image?: unknown } | null | undefined

const urlOf = (image: unknown) =>
  typeof image === 'object' && image !== null ? ((image as { url?: string | null }).url ?? undefined) : undefined

// Page metadata from the SEO tab, falling back to the page's own title/summary/photo
// when the client hasn't filled it in. Relative image URLs resolve via metadataBase.
export function pageMetadata(
  meta: Meta,
  fallback: { title: string; description?: string | null; image?: unknown },
): Metadata {
  const title = meta?.title || fallback.title
  const description = meta?.description || fallback.description || undefined
  const image = urlOf(meta?.image) || urlOf(fallback.image)
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
  }
}

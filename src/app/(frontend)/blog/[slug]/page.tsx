import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'
import { slugParams } from '@/lib/staticParams'
import { pageMetadata } from '@/lib/seo'

type Params = Promise<{ slug: string }>

// Photos placed inside an article go through next/image (resized for the screen,
// lazy-loaded) instead of the full-size original. Anything else renders as default.
type UploadDoc = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null; mimeType?: string | null }
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: (args) => {
    const doc = args.node.value as UploadDoc
    if (typeof doc !== 'object' || !doc?.url || !doc.width || !doc.height || !doc.mimeType?.startsWith('image')) {
      return typeof defaultConverters.upload === 'function' ? defaultConverters.upload(args) : null
    }
    return <Image src={doc.url} alt={doc.alt ?? ''} width={doc.width} height={doc.height} sizes="(max-width: 832px) 100vw, 800px" />
  },
})

// Pre-built for every active entry (instant); saving in the admin refreshes it.
export const revalidate = 60
export const generateStaticParams = slugParams('blog-articles')

const getArticle = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-articles',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  return pageMetadata(article.meta, { title: article.title, path: `/blog/${slug}`, description: article.excerpt, image: article.coverImage })
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const image = typeof article.coverImage === 'object' ? article.coverImage : null
  const categories = (Array.isArray(article.category) ? article.category : []).filter(
    (c) => typeof c === 'object' && c !== null,
  ) as { id: number | string; name: string }[]
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <article className="mx-auto max-w-[800px] px-4 py-12">
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <span
              key={category.id}
              className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-green"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      <h1 className="mt-4 text-center font-display text-4xl text-green max-[359px]:text-[1.9rem] sm:text-5xl">
        {article.title}
      </h1>
      {date && (
        <p className="mt-2 text-center text-sm uppercase tracking-wide text-muted-foreground">{date}</p>
      )}

      {image?.url && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={image.url} alt={image.alt ?? article.title} fill sizes="800px" className="object-cover" />
        </div>
      )}

      {article.body && (
        <div className="rich-text mt-8 space-y-4 leading-relaxed">
          <RichText data={article.body} converters={converters} />
        </div>
      )}
    </article>
  )
}

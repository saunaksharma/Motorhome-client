import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Params = Promise<{ slug: string }>

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
  return pageMetadata(article.meta, { title: article.title, description: article.excerpt, image: article.coverImage })
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

      <h1 className="mt-4 text-center font-display text-4xl italic text-green sm:text-5xl">
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
        <div className="mt-8 space-y-4 leading-relaxed">
          <RichText data={article.body} />
        </div>
      )}
    </article>
  )
}

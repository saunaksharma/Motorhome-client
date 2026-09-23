import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export type BlogCardData = {
  id: number | string
  title: string
  slug?: string | null
  coverImage?: unknown
  excerpt?: string | null
  category?: unknown
  publishedAt?: string | null
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : null

// A blog article card for the listing grid.
export function BlogCard({ article }: { article: BlogCardData }) {
  const image = typeof article.coverImage === 'object' ? (article.coverImage as { url?: string; alt?: string }) : null
  const categories = (Array.isArray(article.category) ? article.category : []).filter(
    (c): c is { name: string } => typeof c === 'object' && c !== null && 'name' in c,
  )
  const date = formatDate(article.publishedAt)

  return (
    <Link
      href={article.slug ? `/blog/${article.slug}` : '#'}
      className="spotlight reveal group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green/15 to-gold/15" />
        )}
        {categories[0] && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-green">
            {categories[0].name}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl italic text-green">{article.title}</h3>
        {article.excerpt && <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>}
        {date && <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{date}</p>}
      </div>
    </Link>
  )
}

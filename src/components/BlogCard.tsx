import { BookOpen } from 'lucide-react'
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
      className="reveal group flex flex-col overflow-hidden rounded-3xl bg-green/[0.06] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(13_71_63/0.45)]"
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
          // No cover photo yet: a branded panel instead of an empty box.
          <div className="pattern-green grid h-full w-full place-items-center">
            <BookOpen className="size-10 text-gold/70" />
          </div>
        )}
        {categories[0] && (
          <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {categories[0].name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-semibold leading-snug tracking-wide text-green">{article.title}</h3>
        {article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-green/70">{article.excerpt}</p>}
        {date && (
          <p className="mt-auto pt-4 font-heading text-xs uppercase tracking-[0.15em] text-green/50">{date}</p>
        )}
      </div>
    </Link>
  )
}

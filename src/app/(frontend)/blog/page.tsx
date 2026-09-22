import type { Where } from 'payload'
import React from 'react'

import { BlogCard } from '@/components/BlogCard'
import { FilterBar } from '@/components/FilterBar'
import { SearchBox } from '@/components/SearchBox'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>

export const metadata = { title: 'Blog' }

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const payload = await getPayloadClient()

  const { docs: categories } = await payload.find({
    collection: 'blog-categories',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 100,
  })

  const where: Where = { active: { equals: true } }
  if (params.category) where.category = { in: [Number(params.category)] } // hasMany
  if (params.q) where.title = { like: params.q }

  const sort = params.sort === 'oldest' ? 'publishedAt' : '-publishedAt'

  const { docs: articles } = await payload.find({
    collection: 'blog-articles',
    where,
    sort,
    depth: 1,
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <SectionHeading title="BLOGS" />

      <div className="mt-8 flex flex-wrap items-end justify-center gap-4">
        <SearchBox placeholder="Search articles…" />
        <FilterBar
          filters={[
            { label: 'Featuring', param: 'category', options: categories.map((c) => ({ id: c.id, name: c.name })) },
            {
              label: 'Published Since',
              param: 'sort',
              options: [
                { id: 'latest', name: 'Latest to Oldest' },
                { id: 'oldest', name: 'Oldest to Latest' },
              ],
            },
          ]}
        />
      </div>

      {articles.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">No articles found.</p>
      )}
    </div>
  )
}

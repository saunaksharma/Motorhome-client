import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { PageBanner } from '@/components/PageBanner'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

// Renders a client-authored content page at /<slug> (Terms, Privacy, FAQ, ...).
// Named routes (caravans, tours, about, ...) take precedence over this catch-all.
type Params = Promise<{ slug: string }>

export const revalidate = 60

const getPage = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, active: { equals: true } },
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return pageMetadata(page.meta, { title: page.title })
}

export default async function ContentPage({ params }: { params: Params }) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <article>
      <PageBanner title={page.title} />
      <div className="mx-auto max-w-[820px] px-4 py-12">
        {page.body ? (
          <div className="space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:italic [&_h2]:text-green [&_a]:text-green [&_a]:underline">
            <RichText data={page.body} />
          </div>
        ) : (
          <p className="text-muted-foreground">This page is being written. Please check back soon.</p>
        )}
      </div>
    </article>
  )
}

import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { CaravanFaqs, faqJsonLd } from '@/components/CaravanFaqs'
import { CtaButton } from '@/components/CtaButton'
import { JsonLd } from '@/components/JsonLd'
import { PageBanner } from '@/components/PageBanner'
import { TipsAccordion } from '@/components/sections/TipsAccordion'
import { getPayloadClient } from '@/lib/payload'
import { slugParams } from '@/lib/staticParams'
import { pageMetadata, plainText } from '@/lib/seo'

// Renders a client-authored content page at /<slug> (Terms, Privacy, FAQ, ...).
// Named routes (caravans, tours, about, ...) take precedence over this catch-all.
type Params = Promise<{ slug: string }>

export const revalidate = 60
export const generateStaticParams = slugParams('pages')

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
  return pageMetadata(page.meta, { title: page.title, path: `/${slug}`, description: plainText(page.body) })
}

export default async function ContentPage({ params }: { params: Params }) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()
  // The page's optional button (Pages → "Button below the text"): the client's Google review link.
  const googleReviewLink =
    page.form === 'review' ? (await (await getPayloadClient()).findGlobal({ slug: 'business', depth: 0 })).googleReviewLink?.trim() : null

  // Optional FAQ list under the text (e.g. Tips & FAQs), also given to Google.
  const faqs = Array.isArray(page.faqs) ? page.faqs : []

  return (
    <article>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <PageBanner title={page.title} />
      {/* Tips & FAQs (client): the Tips first, then the page's FAQs. */}
      {page.showTips && <TipsAccordion />}
      <div className="mx-auto max-w-[820px] px-4 py-12">
        {page.body ? (
          <div className="rich-text space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-green [&_a]:text-green [&_a]:underline">
            <RichText data={page.body} />
          </div>
        ) : (
          !page.showTips && faqs.length === 0 && <p className="text-muted-foreground">This page is being written. Please check back soon.</p>
        )}
        {faqs.length > 0 && (
          <div className={page.body ? 'mt-12' : undefined}>
            <CaravanFaqs faqs={faqs} />
          </div>
        )}
        {googleReviewLink && (
          <div className="mt-10 text-center">
            <CtaButton href={googleReviewLink} label="Write a review on Google" solid />
          </div>
        )}
      </div>
    </article>
  )
}

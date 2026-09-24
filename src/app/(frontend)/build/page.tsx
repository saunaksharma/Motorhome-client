import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { InnovationCard } from '@/components/InnovationCard'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

// "Build Your Own" — the design links this to an external site. Until the client
// provides that URL, this page shows the pitch plus the vehicles they have already
// built (their Innovations) as proof, and sends visitors to the enquiry form.
export const metadata = {
  title: 'Build Your Own',
  description:
    'Dream it, and we’ll build it on wheels — custom motorhome conversions and specialty vehicles by Motorhome Adventures.',
  alternates: { canonical: '/build' },
}
// Refresh from the CMS at most once a minute in production.
export const revalidate = 60

const BUILD_ENQUIRY = '/contact?destination=Custom%20Build'

export default async function BuildPage() {
  const payload = await getPayloadClient()
  const { docs: builds } = await payload.find({
    collection: 'innovations',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    limit: 6,
  })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-[800px] text-center">
        <SectionHeading as="h1" title="BUILD YOUR OWN" subtitle="Dream it, and we'll build it on wheels" />
        <p className="mt-8 leading-relaxed text-muted-foreground">
          From luxury motorhome conversions to specialty vehicles — tell us what you have in mind
          and our team will craft it for you.
        </p>
        <div className="mt-8">
          <CtaButton href={BUILD_ENQUIRY} label="Start Your Build" />
        </div>
      </div>

      {builds.length > 0 && (
        <section className="mt-20 sm:mt-24">
          <SectionHeading title="BUILT BY US" subtitle="Specialized vehicles for unique experiences" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {builds.map((item) => (
              <InnovationCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <p className="mb-5 font-heading text-lg text-green">Have something in mind?</p>
            <CtaButton href={BUILD_ENQUIRY} label="Start Your Build" />
          </div>
        </section>
      )}
    </div>
  )
}

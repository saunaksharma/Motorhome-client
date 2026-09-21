import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { SectionHeading } from '@/components/SectionHeading'

// "Build Your Own" — the design links this to an external site. Until the
// client provides that URL, this is a simple placeholder page.
export const metadata = { title: 'Build Your Own — Motorhome Adventures' }

export default function BuildPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-20 text-center">
      <SectionHeading title="BUILD YOUR OWN" subtitle="Dream it, and we'll build it on wheels" />
      <p className="mt-8 leading-relaxed text-muted-foreground">
        From luxury motorhome conversions to specialty vehicles — tell us what you have in mind
        and our team will craft it for you.
      </p>
      <div className="mt-8">
        <CtaButton href="/contact?destination=Custom Build" label="Start Your Build" />
      </div>
    </div>
  )
}

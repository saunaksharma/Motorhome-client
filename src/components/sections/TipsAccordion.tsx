import { RichText } from '@payloadcms/richtext-lexical/react'
import { ChevronDown, Lightbulb } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

// "TIPS" accordion on a green background. Uses native <details> — accessible
// and requires no client JavaScript.
export async function TipsAccordion() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tips',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
  })

  if (docs.length === 0) return null

  return (
    <section className="pattern-green py-16">
      <div className="mx-auto max-w-[1000px] px-4">
        <div className="mb-10 flex items-center justify-center gap-3">
          <Lightbulb className="size-8 text-gold" />
          <SectionHeading title="TIPS" light />
        </div>

        <div className="space-y-4">
          {docs.map((tip) => (
            <details key={tip.id} className="group rounded-xl border border-gold/60 bg-white/5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-display text-lg italic text-white">
                {tip.title}
                <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              {tip.body && (
                <div className="rich-text space-y-3 px-5 pb-5 leading-relaxed text-white/90">
                  <RichText data={tip.body} />
                </div>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

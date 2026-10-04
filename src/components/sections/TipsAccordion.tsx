import { RichText } from '@payloadcms/richtext-lexical/react'
import { Lightbulb } from 'lucide-react'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'

// "TIPS" as on the client's Canva (pages 29 + 37): a rounded green panel (doodle pattern) on the
// page's cream pattern, a white bulb + "TIPS", and each tip a white outlined pill with a white
// triangle; its bullet points open underneath. All white — no gold (client). Native <details>:
// accessible, no client JavaScript. Linked from the footer as /#tips.
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
    <section id="tips" className="scroll-mt-24 px-3 py-16 sm:px-6">
      <div className="pattern-green mx-auto max-w-[1100px] rounded-[2rem] px-5 py-10 text-white sm:rounded-[2.5rem] sm:px-12 sm:py-14">
        <h2 className="flex items-end gap-1 font-display text-4xl leading-none sm:text-5xl">
          <Lightbulb aria-hidden className="size-10 shrink-0 -translate-y-3 sm:size-12" strokeWidth={1.5} />
          Tips
        </h2>

        <div className="mt-6 max-w-[780px] space-y-4 sm:mt-8 sm:space-y-5">
          {docs.map((tip) => (
            <details key={tip.id} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-4 rounded-full border-2 border-white px-5 py-3.5 font-display text-[15px] leading-snug max-sm:tracking-wide sm:gap-5 sm:border-[3px] sm:px-8 sm:py-4 sm:text-xl [&::-webkit-details-marker]:hidden">
                <svg aria-hidden viewBox="0 0 24 16" className="w-6 shrink-0 transition-transform group-open:rotate-180 sm:w-8">
                  <path d="M2 2h20L12 14z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
                {tip.title}
              </summary>
              {tip.body && (
                <div className="rich-text px-5 pb-2 pt-4 text-[15px] font-bold leading-relaxed sm:px-10 sm:text-lg">
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

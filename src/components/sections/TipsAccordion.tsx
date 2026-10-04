import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { racing } from '@/lib/fonts'
import { getPayloadClient } from '@/lib/payload'
import { cn } from '@/lib/utils'

// Light bulb with rays and a pencil inside, as drawn next to "TIPS" on the Canva.
function BulbIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 1v3M4.5 5.5l2.2 2.2M27.5 5.5l-2.2 2.2M1 16h3M28 16h3" />
      <path d="M20 27c.3-1.5 1-2.5 2.2-3.7a9 9 0 1 0-12.4 0C11 24.5 11.7 25.5 12 27" />
      <path d="M12 31h8M13 35h6M14.5 39h3" />
      <path d="m18.5 11.5-5 5-.8 2.6 2.6-.8 5-5z" />
    </svg>
  )
}

// "TIPS" exactly as the client's Canva (pages 29 + 37): a rounded green panel (doodle pattern)
// on the page's cream pattern, the bulb + "TIPS", and each tip a thick white pill with a big
// white triangle and the title in Racing Sans One; its bullet points open underneath in bold
// Lato. All white — no gold (client). Native <details>: accessible, no client JavaScript.
// Linked from the footer as /#tips.
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
      <div className="pattern-green mx-auto max-w-[1100px] rounded-[2rem] px-4 py-9 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-12">
        <h2 className={cn(racing.className, 'flex items-end gap-1 pl-3 text-4xl leading-none tracking-normal sm:pl-5 sm:text-5xl')}>
          <BulbIcon className="w-8 shrink-0 -translate-y-2 sm:w-11" />
          Tips
        </h2>

        <div className="mt-3 max-w-[820px] space-y-3 sm:space-y-4">
          {docs.map((tip) => (
            <details key={tip.id} className="group">
              <summary
                className={cn(
                  racing.className,
                  'flex cursor-pointer list-none items-center gap-3 rounded-full border-[3px] border-white px-5 py-3 text-lg leading-tight tracking-normal sm:gap-5 sm:border-4 sm:px-8 sm:py-4 sm:text-[1.75rem] [&::-webkit-details-marker]:hidden',
                )}
              >
                <svg aria-hidden viewBox="0 0 24 16" className="w-7 shrink-0 transition-transform group-open:rotate-180 sm:w-11">
                  <path d="M2 2h20L12 14z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
                {tip.title}
              </summary>
              {tip.body && (
                <div className="rich-text px-6 pb-2 pt-4 text-[15px] font-bold leading-relaxed sm:px-12 sm:text-lg">
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

import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'

export type Faq = { question?: string | null; answer?: string | null }

// FAQs near the foot of a caravan page (related articles live in "Tales & Snaps"). Native
// <details> = accordion with no JS. The caravan's own "Watch it in action" videos were removed
// (client): that title now heads the shared video row (VideoShowcase) above this.
export function RelatedContent({ faqs = [] }: { faqs?: Faq[] }) {
  if (!faqs.some((f) => f.question)) return null

  return (
    <section>
      <SectionHeading title="FAQ's" />
      <div className="mx-auto mt-8 max-w-[760px] space-y-3">
        {faqs.filter((f) => f.question).map((faq, index) => (
          <details key={index} className="group rounded-xl border border-border bg-card px-5 py-4">
            <summary className="cursor-pointer list-none font-display text-green marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            {faq.answer && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>}
          </details>
        ))}
      </div>
    </section>
  )
}

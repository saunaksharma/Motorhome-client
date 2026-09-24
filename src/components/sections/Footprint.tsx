import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getHomepage } from '@/lib/payload'

// "Our Footprint" — three arched stat cards (design page 38) from `sm` up. On phones
// the arches would stack into tall domes, so they become one compact green panel
// with the stats split by thin gold lines.
export async function Footprint() {
  const home = await getHomepage()
  const stats = home?.footprint ?? []
  if (stats.length === 0) return null

  return (
    <section className="mx-auto max-w-[1100px] px-4 py-16">
      <SectionHeading title="OUR FOOTPRINT" />

      <div className="mt-10 divide-y divide-gold/25 overflow-hidden rounded-3xl bg-green sm:grid sm:grid-cols-3 sm:gap-8 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:bg-transparent">
        {stats.map((stat, index) => (
          <div key={index} className="px-6 py-6 text-center sm:p-0">
            <div className="text-white sm:rounded-b-2xl sm:rounded-t-full sm:bg-green sm:px-6 sm:py-10">
              <div className="font-display text-2xl uppercase tracking-wide text-gold">{stat.value}</div>
              {stat.caption && <div className="mt-1 text-sm text-white/80 sm:mt-2">{stat.caption}</div>}
            </div>
            {stat.label && (
              <div className="mt-2 font-heading text-xs uppercase tracking-[0.25em] text-white/60 sm:mt-3 sm:text-lg sm:tracking-wide sm:text-green">
                {stat.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

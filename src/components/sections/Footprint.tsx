import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getHomepage } from '@/lib/payload'

// "Our Footprint" — three arched stat cards (design page 38).
export async function Footprint() {
  const home = await getHomepage()
  const stats = home?.footprint ?? []
  if (stats.length === 0) return null

  return (
    <section className="mx-auto max-w-[1100px] px-4 py-16">
      <SectionHeading title="OUR FOOTPRINT" />

      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="rounded-b-2xl rounded-t-full bg-green px-6 py-10 text-white">
              <div className="font-display text-2xl italic text-gold">{stat.value}</div>
              {stat.caption && <div className="mt-2 text-sm text-white/80">{stat.caption}</div>}
            </div>
            {stat.label && (
              <div className="mt-3 font-heading text-lg uppercase tracking-wide text-green">
                {stat.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

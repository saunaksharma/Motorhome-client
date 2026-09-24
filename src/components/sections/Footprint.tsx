import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { getHomepage } from '@/lib/payload'

// A value like "India • Nepal • Bhutan • Tibet" is shown one item per line, as on the
// client's previous site (INDIA / NEPAL / BHUTAN / TIBET).
const lines = (value?: string | null) =>
  (value ?? '')
    .split(/\s*[•·|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean)

// "Our Footprint" — three arched stat cards in one row at every size (design page 38 and
// the previous site), just smaller on phones. A thin ring around each arch echoes the
// old site's double-arch frame.
export async function Footprint() {
  const home = await getHomepage()
  const stats = home?.footprint ?? []
  if (stats.length === 0) return null

  return (
    <section className="mx-auto max-w-[1100px] px-4 py-16">
      <SectionHeading title="OUR FOOTPRINT" />

      <div className="mt-10 grid grid-cols-3 items-end gap-3 sm:gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex min-h-[150px] flex-col items-center justify-center rounded-b-xl rounded-t-full bg-green px-2 pb-4 pt-9 text-white ring-1 ring-green/25 ring-offset-4 ring-offset-background sm:min-h-[230px] sm:rounded-b-2xl sm:px-6 sm:pb-10 sm:pt-16 sm:ring-offset-8">
              {lines(stat.value).map((line) => (
                <div key={line} className="font-display text-[15px] leading-tight uppercase text-gold sm:text-2xl">
                  {line}
                </div>
              ))}
              {stat.caption && (
                <div className="mt-1.5 text-[10px] leading-snug uppercase tracking-wide text-white/80 sm:mt-3 sm:text-sm">
                  {stat.caption}
                </div>
              )}
            </div>
            {stat.label && (
              <div className="mt-3 font-heading text-[10px] font-black uppercase leading-tight tracking-wide text-green sm:mt-4 sm:text-lg">
                {stat.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

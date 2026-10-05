import { Anton, Bebas_Neue } from 'next/font/google'
import React from 'react'

import { getHomepage } from '@/lib/payload'
import { cn } from '@/lib/utils'

// The Canva's poster faces for this section only (design page 38): Anton for the title,
// Bebas Neue inside the arches. Loaded here so other pages don't download them.
const anton = Anton({ weight: '400', subsets: ['latin'] })
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'] })

// " · " (or • or |) in the admin text starts a new line: "India · Nepal" → INDIA / NEPAL.
const lines = (value?: string | null) =>
  (value ?? '')
    .split(/\s*[•·|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean)

// "Our Footprint", built to the client's Canva (design page 38) on every screen size: a green
// frame (bars top and bottom, tapered brackets at the sides, as on the Canva) holding the title and three green
// arches, each inside a thin outline whose legs run down past the arch's name. Phones get the
// same picture, smaller, still three in one row. Sizes inside an arch are in cqw (% of the
// arch's width), so the text keeps the Canva's proportions at any width.
export async function Footprint() {
  const home = await getHomepage()
  const stats = home?.footprint ?? []
  if (stats.length === 0) return null

  return (
    <section className="px-3 py-14 sm:px-6 sm:py-20">
      <div className="@container/frame relative mx-auto max-w-[1160px] px-[4%] py-[5%] sm:py-[3.5%]">
        {/* The frame, measured off the Canva export (page 38, 4000 px): four separate strokes of one
            rounded box, each tapering where it curves, corners left open — bars top/bottom inset
            4.3% from the sides (0.55% thick), side brackets inset 10.5% from top/bottom (0.75%
            thick). Their ends are long, slim tapers (oval corners: long along the stroke, short
            across it), not hooks. Sizes in cqw of the frame, so it matches at every width (with a
            minimum thickness on phones). */}
        <span aria-hidden className="pointer-events-none absolute inset-x-[4.3%] top-0 h-1/3 rounded-tl-[3cqw_1cqw] rounded-tr-[3cqw_1cqw] border-t-[length:max(3px,0.6cqw)] border-green" />
        <span aria-hidden className="pointer-events-none absolute inset-x-[4.3%] bottom-0 h-1/3 rounded-bl-[3cqw_1cqw] rounded-br-[3cqw_1cqw] border-b-[length:max(3px,0.6cqw)] border-green" />
        <span aria-hidden className="pointer-events-none absolute inset-y-[10.5%] left-0 w-1/4 rounded-tl-[1.3cqw_3.5cqw] rounded-bl-[1.3cqw_3.5cqw] border-l-[length:max(4px,0.75cqw)] border-green" />
        <span aria-hidden className="pointer-events-none absolute inset-y-[10.5%] right-0 w-1/4 rounded-tr-[1.3cqw_3.5cqw] rounded-br-[1.3cqw_3.5cqw] border-r-[length:max(4px,0.75cqw)] border-green" />

        <h2
          className={cn(
            anton.className,
            '-skew-x-[10deg] text-center text-[length:max(26px,6.2cqw)] uppercase leading-none text-green drop-shadow-[0_2px_1px_rgb(13_71_63/0.25)]',
          )}
        >
          Our Footprint
        </h2>

        <div className="mt-[4%] grid grid-cols-3 gap-[3%] sm:mt-[2.5%]">
          {stats.map((stat, index) => {
            const value = lines(stat.value)
            // One short value like "15+" is the poster number; longer single values are big.
            const valueSize =
              value.length > 1 ? 'text-[length:21cqw]' : value[0].replace(/\s/g, '').length <= 4 ? 'text-[length:48cqw]' : 'text-[length:26cqw]'
            return (
              <div key={index} className="@container mx-auto w-full sm:w-[72%]">
                <div className="rounded-t-full border-x-2 border-t-2 border-green/55 px-[4cqw] pt-[4cqw] sm:border-x-[3px] sm:border-t-[3px]">
                  <div
                    className={cn(
                      bebas.className,
                      '@container flex aspect-[5/6] flex-col items-center justify-center overflow-hidden rounded-t-full bg-green px-[5cqw] pt-[10cqw] text-center uppercase leading-[1.08] text-white',
                    )}
                  >
                    {lines(stat.intro).map((line) => (
                      <span key={line} className="text-[length:20cqw]">
                        {line}
                      </span>
                    ))}
                    {value.map((line) => (
                      <span key={line} className={cn(valueSize, value.length === 1 && 'leading-[0.95]')}>
                        {line}
                      </span>
                    ))}
                    {lines(stat.caption).map((line) => (
                      <span key={line} className="text-[length:15cqw]">
                        {line}
                      </span>
                    ))}
                  </div>
                  {stat.label && (
                    <div className="whitespace-nowrap pt-[3cqw] text-center font-heading text-[length:10.5cqw] font-bold uppercase leading-none tracking-tight text-green">
                      {stat.label}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

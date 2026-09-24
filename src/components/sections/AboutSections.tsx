import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import React from 'react'

import { getHomepage } from '@/lib/payload'
import { cn } from '@/lib/utils'

// The About Us story blocks (they live on the homepage). Image left or right
// per section, rich text rendered from the CMS.
export async function AboutSections() {
  const home = await getHomepage()
  const sections = home?.aboutSections ?? []
  if (sections.length === 0) return null

  return (
    <section className="mx-auto max-w-[1100px] space-y-16 px-4 py-16">
      {sections.map((section, index) => {
        const image = typeof section.image === 'object' ? section.image : null
        const imageOnRight = section.imageSide === 'right'
        return (
          <div key={index} className="grid items-center gap-8 md:grid-cols-2">
            <div
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-2xl bg-green/10',
                imageOnRight && 'md:order-2',
              )}
            >
              {image?.url && (
                <Image
                  src={image.url}
                  alt={image.alt ?? section.heading}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>

            <div>
              <h2 className="font-display text-3xl text-green sm:text-4xl">
                {section.heading}
              </h2>
              <div className="mt-4 h-1 w-24 rounded bg-gold" />
              {section.body && (
                <div className="rich-text mt-4 space-y-3 leading-relaxed">
                  <RichText data={section.body} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}

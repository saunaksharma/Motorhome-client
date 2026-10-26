import Image from 'next/image'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { focalPosition } from '@/lib/utils'

type Person = {
  name?: string | null
  role?: string | null
  photo?: { url?: string | null; focalX?: number | null; focalY?: number | null } | number | null
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

// The About page's staff section (client): a round photo per person with their name and
// designation, from Site Settings → About → The Team. Rows stay centred however many people there
// are (1, 5 or 20); a person without a photo yet shows their initials on the green pattern.
export function TeamSection({ heading, intro, people }: { heading?: string | null; intro?: string | null; people: Person[] }) {
  const team = people.filter((person) => person.name?.trim())
  if (team.length === 0) return null

  return (
    <section aria-label={heading || 'Meet Our Team'}>
      <SectionHeading title={heading || 'Meet Our Team'} />
      {intro && <p className="mx-auto mt-4 max-w-[640px] text-center leading-relaxed text-green/75">{intro}</p>}

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12">
        {team.map((person, index) => {
          const photo = typeof person.photo === 'object' && person.photo?.url ? person.photo : null
          return (
            <li key={index} className="group w-[150px] text-center sm:w-[184px]">
              {/* Gold ring with a little air between it and the photo. */}
              <div className="mx-auto size-32 rounded-full p-1.5 ring-2 ring-gold/60 transition-all duration-500 group-hover:-translate-y-1 group-hover:ring-gold sm:size-40">
                <div className="relative size-full overflow-hidden rounded-full bg-green/10 shadow-[0_18px_40px_-20px_rgb(13_71_63/0.55)]">
                  {photo ? (
                    <Image
                      src={photo.url!}
                      alt={person.name!}
                      fill
                      sizes="(max-width: 639px) 128px, 160px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: focalPosition(photo) }}
                    />
                  ) : (
                    <div aria-hidden className="pattern-green grid size-full place-items-center font-display text-3xl text-gold sm:text-4xl">
                      {initials(person.name!)}
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-5 text-balance font-display text-lg leading-snug text-green sm:text-xl">{person.name}</p>
              {person.role && (
                <p className="mt-1.5 text-balance font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-gold sm:text-xs">{person.role}</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

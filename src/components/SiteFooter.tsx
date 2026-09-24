import {
  Ban,
  BookOpen,
  Briefcase,
  CalendarCheck,
  Caravan,
  ChevronRight,
  CircleHelp,
  FileText,
  Gift,
  Handshake,
  House,
  Lightbulb,
  MapPinned,
  Newspaper,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { NewsletterForm } from './NewsletterForm'
import { SocialIcon } from './SocialIcon'

type Media = { url?: string | null; alt?: string | null }
export type Business = {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  mapUrl?: string | null
  hours?: string | null
}
type FooterData = {
  logo?: Media | number | null
  backgroundImage?: Media | number | null
  columns?: ({ heading: string; links?: ({ label: string; link: string } | null)[] | null } | null)[] | null
  socials?: ({ platform: string; url: string } | null)[] | null
  newsletter?: { heading?: string | null; subtext?: string | null; ctaLabel?: string | null } | null
}

const asMedia = (v: unknown): Media | null => (typeof v === 'object' && v !== null ? (v as Media) : null)

// The small icon before each footer link, as on the old site (Font Awesome there; picked
// from the link's label here, so links the client adds in the admin get one too).
const LINK_ICONS: [RegExp, LucideIcon][] = [
  [/home/i, House],
  [/tour/i, MapPinned],
  [/caravan|motorhome/i, Caravan],
  [/innovation|tip/i, Lightbulb],
  [/blog|stor/i, Newspaper],
  [/terms/i, FileText],
  [/cancel/i, Ban],
  [/privacy/i, ShieldCheck],
  [/faq|help/i, CircleHelp],
  [/book|visit|contact/i, CalendarCheck],
  [/collab|influenc/i, Handshake],
  [/b2b|business|partner/i, Briefcase],
  [/returning|benefit|reward/i, Gift],
  [/guide|about/i, BookOpen],
]
const linkIcon = (label: string) => LINK_ICONS.find(([re]) => re.test(label))?.[1] ?? ChevronRight

// Footer copied from the client's previous site (includes/footer.html): the footer photo
// under a 40% black film; centred logo + MOTORHOME ADVENTURES (Cinzel gold); link columns
// with bold white headings on a 2px gold rule and white capital links with an icon (gold +
// nudge right on hover); a centred row of social icons above a thin gold line; copyright.
// The newsletter is its own band above (the old footer had none). All of it is edited in
// the admin (Site Settings → Footer / Business Details).
export function SiteFooter({ data, business }: { data: FooterData; business?: Business | null }) {
  const nl = data?.newsletter ?? {}
  const logo = asMedia(data?.logo)
  const bg = asMedia(data?.backgroundImage)
  const columns = (data?.columns ?? []).filter(Boolean) as {
    heading: string
    links?: ({ label: string; link: string } | null)[] | null
  }[]
  const socials = (data?.socials ?? []).filter(Boolean) as { platform: string; url: string }[]
  // Contact column only when there's more than WhatsApp (that has its own floating button).
  const hasContact = Boolean(business?.phone || business?.email || business?.address)

  return (
    <>
      {/* Newsletter band */}
      <section className="pattern-green mt-16 px-4 py-12 text-center text-white">
        <h2 className="font-display text-3xl">{nl.heading || 'Join The Caravan Club'}</h2>
        {nl.subtext && <p className="mt-2 text-white/85">{nl.subtext}</p>}
        <NewsletterForm ctaLabel={nl.ctaLabel || 'SUBSCRIBE NOW'} />
      </section>

      <footer className="relative min-h-[500px] bg-[#1a4d3e] px-3 py-6 text-white sm:px-4 sm:py-8 md:px-6 md:py-12">
        {bg?.url && <Image src={bg.url} alt="" fill sizes="100vw" className="object-cover" />}
        <div aria-hidden className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto max-w-[1200px]">
          {/* Logo + brand name */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 md:mb-10 md:gap-4">
            {logo?.url && (
              <Image src={logo.url} alt="Motorhome Adventures logo" width={88} height={88} className="size-12 object-contain sm:size-16 md:size-[5.5rem]" />
            )}
            <span className="text-center font-brand text-[clamp(1.2rem,4vw,2rem)] font-bold uppercase leading-[1.2] tracking-[0.2em] text-brand-gold">
              Motorhome Adventures
            </span>
          </div>

          {/* Link columns */}
          <div className="mb-10 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:gap-10">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-4 border-b-2 border-brand-gold pb-2.5 font-display text-sm font-bold uppercase text-white sm:text-base md:mb-5 md:text-lg">
                  {col.heading}
                </h3>
                <div className="flex flex-col gap-3">
                  {(col.links ?? []).filter(Boolean).map((l) => {
                    const Icon = linkIcon(l!.label)
                    return (
                      <Link
                        key={l!.label}
                        href={l!.link || '#'}
                        className="inline-flex items-center gap-2 py-1 text-xs uppercase text-white transition-all duration-300 hover:translate-x-[5px] hover:text-brand-gold sm:text-[13px] md:py-[5px] md:text-sm"
                      >
                        <Icon aria-hidden className="size-4 shrink-0" />
                        {l!.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Contact details — edited in Site Settings → Business Details. */}
            {hasContact && (
              <div>
                <h3 className="mb-4 border-b-2 border-brand-gold pb-2.5 font-display text-sm font-bold uppercase text-white sm:text-base md:mb-5 md:text-lg">
                  Reach Us
                </h3>
                <div className="flex flex-col gap-3 text-xs uppercase sm:text-[13px] md:text-sm">
                  {business?.phone && (
                    <a href={`tel:${business.phone.replace(/[^\d+]/g, '')}`} className="py-1 hover:text-brand-gold">
                      {business.phone}
                    </a>
                  )}
                  {business?.email && (
                    <a href={`mailto:${business.email}`} className="py-1 normal-case hover:text-brand-gold">
                      {business.email}
                    </a>
                  )}
                  {business?.address && <p className="whitespace-pre-line normal-case text-white/85">{business.address}</p>}
                  {business?.mapUrl && (
                    <a href={business.mapUrl} target="_blank" rel="noopener noreferrer" className="py-1 hover:text-brand-gold">
                      Find us on Google Maps ↗
                    </a>
                  )}
                  {business?.hours && <p className="normal-case text-white/85">{business.hours}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Socials */}
          {socials.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-4 border-t-2 border-brand-gold/30 pt-5 sm:gap-5 md:mt-10 md:gap-[30px] md:pt-[30px]">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="p-2 text-white transition-all duration-300 hover:scale-110 hover:text-brand-gold"
                >
                  <SocialIcon platform={s.platform} className="size-6 md:size-8" />
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <div className="mt-10 border-t border-white/20 pt-5 text-center">
            <p className="text-xs text-white/80 md:text-sm">
              © {new Date().getFullYear()} Motorhome Adventures. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

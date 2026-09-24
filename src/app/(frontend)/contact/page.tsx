import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import React from 'react'

import { BookingForm } from '@/components/BookingForm'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

export const metadata = { title: 'Reserve Your Adventure' }
// Pre-built (instant); saving Business Details in the admin refreshes it.
export const revalidate = 60

// One contact detail: gold icon + text, optionally a link.
function Detail({
  icon,
  href,
  external,
  children,
}: {
  icon: React.ReactNode
  href?: string
  external?: boolean
  children: React.ReactNode
}) {
  const body = (
    <>
      <span className="mt-0.5 shrink-0 text-gold">{icon}</span>
      <span>{children}</span>
    </>
  )
  const className = 'flex items-start gap-3 text-sm text-green'
  return href ? (
    <a
      href={href}
      className={`${className} hover:text-gold`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}

// The form fills "Destination" from the link in the browser. Contact details
// come from Site Settings → Business Details; empty ones are simply not shown.
export default async function ContactPage() {
  const payload = await getPayloadClient()
  const business = await payload.findGlobal({ slug: 'business', depth: 0 })
  const { phone, whatsapp, email, address, mapUrl, hours } = business ?? {}
  const hasDetails = Boolean(phone || whatsapp || email || address || hours)

  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      <SectionHeading
        title="RESERVE YOUR ADVENTURE"
        subtitle="Tell us about your trip and we’ll be in touch"
      />

      {hasDetails && (
        <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
          {phone && (
            <Detail
              icon={<Phone className="size-4" />}
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            >
              {phone}
            </Detail>
          )}
          {whatsapp && (
            <Detail
              icon={<MessageCircle className="size-4" />}
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              external
            >
              Chat with us on WhatsApp
            </Detail>
          )}
          {email && (
            <Detail icon={<Mail className="size-4" />} href={`mailto:${email}`}>
              {email}
            </Detail>
          )}
          {hours && <Detail icon={<Clock className="size-4" />}>{hours}</Detail>}
          {address && (
            <Detail icon={<MapPin className="size-4" />} href={mapUrl || undefined} external>
              <span className="whitespace-pre-line">{address}</span>
            </Detail>
          )}
        </div>
      )}

      <div className="mt-10">
        <BookingForm />
      </div>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { Honeypot } from './Honeypot'

const inputClass = 'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm'

// One labelled field wrapper.
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-heading uppercase tracking-wide text-green">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
    </label>
  )
}

export type EnquiryType = 'tour' | 'caravan' | 'innovation'
export type EnquiryChoices = Record<EnquiryType, string[]>

// What the visitor is enquiring about decides the one field that changes (client):
// Tour → "Itinerary", Caravan → "Caravan", Innovation → "Vehicle Type", each a list from the CMS.
const TYPES: { value: EnquiryType; label: string; field: string }[] = [
  { value: 'tour', label: 'Tour', field: 'Itinerary' },
  { value: 'caravan', label: 'Caravan', field: 'Caravan' },
  { value: 'innovation', label: 'Innovation', field: 'Vehicle Type' },
]
const NOT_SURE = 'Not sure yet'
const isType = (v: string | null): v is EnquiryType => TYPES.some((t) => t.value === v)

// "Reserve Your Adventure" booking form → public Enquiries endpoint.
// Opened from a tour / caravan / vehicle page (/contact?type=caravan&destination=Willow) it is
// LOCKED to that one product (client): no Tour/Caravan/Innovation switch, no list — just the
// product. Opened plainly (header "Book your call") the visitor picks the type and the product.
export function BookingForm({ choices }: { choices: EnquiryChoices }) {
  const [type, setType] = useState<EnquiryType>('tour')
  const [destination, setDestination] = useState('')
  // null until the link has been read, so neither version flashes before the other.
  const [locked, setLocked] = useState<boolean | null>(null)
  const [sending, setSending] = useState(false)

  // Read the link in the browser, so the page itself can be pre-built and load instantly.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const linkType = params.get('type')
    const linkDestination = params.get('destination')?.trim() ?? ''
    // One-time read of the link after hydration (keeps /contact static); not a render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isType(linkType)) setType(linkType)
    setDestination(linkDestination)
    setLocked(isType(linkType) && linkDestination !== '')
  }, [])
  const field = TYPES.find((t) => t.value === type)!
  // A pre-filled name that isn't in the list (e.g. "Custom Build") is still offered.
  const options = [...choices[type], ...(destination && !choices[type].includes(destination) && destination !== NOT_SURE ? [destination] : [])]
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setSending(true)
    setError('')
    try {
      const data = Object.fromEntries(new FormData(form).entries())
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setDone(true)
        form.reset()
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body?.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="font-display text-2xl text-green">Thank you!</h3>
        <p className="mt-2 text-muted-foreground">We&apos;ve got your request and will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4 sm:grid-cols-2">
      <Honeypot />
      <input type="hidden" name="enquiryType" value={type} />
      {locked && (
        <div className="rounded-2xl border-l-4 border-green bg-card px-5 py-4 shadow-sm ring-1 ring-green/10 sm:col-span-2">
          <input type="hidden" name="destination" value={destination} />
          <p className="font-heading text-xs uppercase tracking-[0.2em] text-green/60">{field.field}</p>
          <p className="mt-1 font-display text-xl text-green">{destination}</p>
        </div>
      )}
      {locked === false && (
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 font-heading text-sm uppercase tracking-wide text-green">I&apos;m enquiring about</legend>
          <div className="grid grid-cols-3 gap-1 rounded-full border border-border bg-card p-1">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                aria-pressed={type === t.value}
                onClick={() => {
                  setType(t.value)
                  setDestination('')
                }}
                className={cn(
                  'rounded-full px-2 py-2.5 font-heading text-[13px] font-bold uppercase tracking-wide transition-colors max-[359px]:px-1 max-[359px]:text-[11px] max-[359px]:tracking-normal sm:text-sm',
                  type === t.value ? 'bg-green text-white' : 'text-green hover:bg-green/5',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <Field label="First Name" required>
        <input name="firstName" required autoComplete="given-name" className={inputClass} />
      </Field>
      <Field label="Last Name" required>
        <input name="lastName" required autoComplete="family-name" className={inputClass} />
      </Field>
      <Field label="Email" required>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Phone Number" required>
        <input name="phone" type="tel" required autoComplete="tel" className={inputClass} />
      </Field>
      {/* Company + Preferred Travel Dates removed (client); the list gets the full row. */}
      {locked === false && (
        <div className="sm:col-span-2">
          <Field label={field.field}>
            <select name="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className={inputClass}>
              <option value="">Select…</option>
              {options.map((name) => (
                <option key={name}>{name}</option>
              ))}
              <option>{NOT_SURE}</option>
            </select>
          </Field>
        </div>
      )}
      {/* Group Size + Additional Requirements removed too (client); Budget gets the full row. */}
      <div className="sm:col-span-2">
        <Field label="Budget Range">
          <select name="budgetRange" className={inputClass} defaultValue="">
            <option value="">Select…</option>
            <option>Under ₹50,000</option>
            <option>₹50,000 – ₹1,00,000</option>
            <option>₹1,00,000 – ₹2,00,000</option>
            <option>₹2,00,000+</option>
          </select>
        </Field>
      </div>

      {error && (
        <p className="text-sm text-destructive sm:col-span-2" role="status">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-full bg-green px-8 py-3.5 font-heading font-semibold uppercase tracking-wider text-white transition hover:bg-green/90 disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Book your call with our specialist'}
        </button>
      </div>
    </form>
  )
}

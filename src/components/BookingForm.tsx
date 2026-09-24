'use client'

import React, { useEffect, useRef, useState } from 'react'

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

// "Reserve Your Adventure" booking form → public Enquiries endpoint.
export function BookingForm() {
  const destinationRef = useRef<HTMLInputElement>(null)
  const [sending, setSending] = useState(false)

  // Pre-fill "Destination" from the link (e.g. /contact?destination=Willow) in the
  // browser, so the page itself can be pre-built and load instantly.
  useEffect(() => {
    const destination = new URLSearchParams(window.location.search).get('destination')
    if (destination && destinationRef.current && !destinationRef.current.value) {
      destinationRef.current.value = destination
    }
  }, [])
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
      <Field label="Company">
        <input name="company" autoComplete="organization" className={inputClass} />
      </Field>
      <Field label="Destination">
        <input ref={destinationRef} name="destination" className={inputClass} />
      </Field>
      <Field label="Preferred Travel Dates">
        <input name="preferredTravelDates" placeholder="e.g. March 2027" className={inputClass} />
      </Field>
      <Field label="Group Size">
        <select name="groupSize" className={inputClass} defaultValue="">
          <option value="">Select…</option>
          <option>1-2</option>
          <option>3-4</option>
          <option>5-6</option>
          <option>7+</option>
        </select>
      </Field>
      <Field label="Budget Range">
        <select name="budgetRange" className={inputClass} defaultValue="">
          <option value="">Select…</option>
          <option>Under ₹50,000</option>
          <option>₹50,000 – ₹1,00,000</option>
          <option>₹1,00,000 – ₹2,00,000</option>
          <option>₹2,00,000+</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Additional Requirements">
          <textarea name="requirements" rows={4} className={inputClass} />
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
          {sending ? 'Sending…' : 'Book Now'}
        </button>
      </div>
    </form>
  )
}

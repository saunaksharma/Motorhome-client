'use client'

import React, { useState } from 'react'

import { Field, inputClass } from './BookingForm'
import { Honeypot } from './Honeypot'

// The returning-customer review (client's review format) → Inbox → Customer reviews.
// After sending, the client's next step: screenshot it and share it on Instagram, tagging us.
export function ReviewForm({ caravans }: { caravans: string[] }) {
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/review-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Optional questions left blank aren't sent (an empty choice isn't a valid "Would you choose us again?").
        body: JSON.stringify(Object.fromEntries([...new FormData(form).entries()].filter(([, value]) => value !== ''))),
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
        <h3 className="font-display text-2xl text-green">Thank you for your review!</h3>
        <p className="mx-auto mt-3 max-w-[560px] text-muted-foreground">
          Take a screenshot and share it on your Instagram, along with a picture from the trip with our caravan. Tag us and
          you&apos;re good to go!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8">
      <Honeypot />
      <h2 className="font-display text-2xl text-green sm:col-span-2">Write your review</h2>
      <Field label="Your name" required>
        <input name="name" required autoComplete="name" className={inputClass} />
      </Field>
      <Field label="Email" required>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Caravan you rented" required>
        <select name="caravan" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select…
          </option>
          {caravans.map((name) => (
            <option key={name}>{name}</option>
          ))}
          <option>Other</option>
        </select>
      </Field>
      <Field label="Number of days">
        <input name="days" inputMode="numeric" className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Where you travelled">
          <input name="travelledTo" className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Your experience with the caravan">
          <textarea name="caravanExperience" rows={3} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Your experience with the on-board staff">
          <textarea name="staffExperience" rows={3} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Would you choose our services again?">
          <select name="chooseAgain" defaultValue="" className={inputClass}>
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </select>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="One reason why you would recommend our caravan to others?" required>
          <textarea name="recommendReason" required rows={3} className={inputClass} />
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
          {sending ? 'Sending…' : 'Submit your review'}
        </button>
      </div>
    </form>
  )
}

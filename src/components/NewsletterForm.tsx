'use client'

import React, { useState } from 'react'

// "Join The Caravan CLUB" signup — posts to the public Subscribers endpoint.
export function NewsletterForm({ ctaLabel = 'SUBSCRIBE NOW' }: { ctaLabel?: string }) {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setMsg("Thanks — you're on the list!")
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setMsg(data?.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setMsg('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button className="cta-button cta-button--on-green" type="submit" disabled={busy}>
        {busy ? '…' : ctaLabel}
      </button>
      {msg && (
        <p className="newsletter-form__msg" role="status">
          {msg}
        </p>
      )}
    </form>
  )
}

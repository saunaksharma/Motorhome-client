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
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2"
    >
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
        className="min-w-60 flex-1 rounded-full border border-white/40 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-gold"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-full border-2 border-white px-8 py-3 font-heading font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-green disabled:opacity-60"
      >
        {busy ? '…' : ctaLabel}
      </button>
      {msg && (
        <p className="mt-2.5 w-full text-center text-sm text-white/90" role="status">
          {msg}
        </p>
      )}
    </form>
  )
}

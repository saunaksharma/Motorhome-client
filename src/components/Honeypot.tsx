import React from 'react'

// Spam trap: a field real visitors never see or reach by keyboard. Bots that fill
// every input set it, and the server rejects those submissions
// (see src/hooks/formProtection.ts — the name must match HONEYPOT_FIELD).
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}

'use client'

import React from 'react'

// Above the Enquiries / Subscribers lists: download everything as a CSV for Brevo (client).
export function ExportCsvButton({ collection }: { collection: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <a className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} href={`/api/${collection}/export`} download>
        Download for Brevo (CSV)
      </a>
      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Then in Brevo: Contacts → Import contacts → upload this file.</span>
    </div>
  )
}

import React from 'react'

// Structured data for search engines (schema.org JSON-LD). "<" is escaped so text
// typed in the admin can never close the script tag (per the Next.js JSON-LD guide).
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

'use client'

import { useField } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type Feature = { id: number; name: string; icon?: { url?: string } | number | null }

// Custom admin field: shows every Feature in a category as a checkbox with its
// icon. Ticking includes it on the caravan (front-end shows only ticked ones).
// Reads/writes the same relationship value as the default field.
export function FeatureTickList({
  path,
  category,
  label,
}: {
  path?: string
  category: string
  label?: string
}) {
  const { value, setValue } = useField<(number | { id: number })[]>({ path })
  const [options, setOptions] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/features?where[category][equals]=${category}&depth=1&limit=200&sort=name`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setOptions(data?.docs ?? [])
      })
      .catch(() => {
        if (!cancelled) setOptions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category])

  const selectedIds = (value ?? []).map((v) => (typeof v === 'object' ? v.id : v)) as number[]
  const isChecked = (id: number) => selectedIds.includes(id)

  const toggle = (id: number) => {
    setValue(isChecked(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      {label && <div style={{ marginBottom: 8, fontWeight: 600 }}>{label}</div>}

      {loading ? (
        <p style={{ opacity: 0.6 }}>Loading options…</p>
      ) : options.length === 0 ? (
        <p style={{ opacity: 0.6 }}>
          No “{category}” features yet — add some in the Features collection.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 8,
          }}
        >
          {options.map((feature) => {
            const iconUrl =
              feature.icon && typeof feature.icon === 'object' ? feature.icon.url : undefined
            const checked = isChecked(feature.id)
            return (
              <label
                key={feature.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '8px 10px',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 6,
                  background: checked ? 'var(--theme-elevation-100)' : 'transparent',
                }}
              >
                <input type="checkbox" checked={checked} onChange={() => toggle(feature.id)} />
                {iconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={iconUrl} alt="" width={18} height={18} style={{ objectFit: 'contain' }} />
                )}
                <span>{feature.name}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

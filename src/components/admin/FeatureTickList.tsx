'use client'

import { useField } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type Feature = { id: number; name: string; icon?: { url?: string } | number | null }

// Custom admin field: shows every Feature in a category as a checkbox with its
// icon. Ticking includes it on the caravan (front-end shows only ticked ones).
// Reads/writes the same relationship value as the default field.
// "Add a new feature" (client): type a name → it's created in Features (this category, stand-in
// icon — the site picks one from the name) and ticked here; every caravan can then tick it.
export function FeatureTickList({
  path,
  category,
  label,
  editable = false,
}: {
  path?: string
  category: string
  label?: string
  editable?: boolean
}) {
  const { value, setValue } = useField<(number | { id: number })[]>({ path })
  // This caravan's own wording per ticked feature ({ featureId: text }) — the hidden
  // `featureLabels` field, shared by the Specifications and Unique features lists.
  const { value: labels, setValue: setLabels } = useField<Record<string, string> | null>({ path: 'featureLabels' })
  const [options, setOptions] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

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

  // Empty or unchanged wording = use the feature's own name (key removed).
  const setLabel = (feature: Feature, text: string) => {
    const next = { ...(labels ?? {}) }
    if (text.trim() && text.trim() !== feature.name) next[String(feature.id)] = text
    else delete next[String(feature.id)]
    setLabels(Object.keys(next).length ? next : null)
  }

  const addFeature = async () => {
    const name = newName.trim()
    if (!name || adding) return
    setAddError('')
    // Already in the list (any capitals)? Just tick it.
    const existing = options.find((o) => o.name.toLowerCase() === name.toLowerCase())
    if (existing) {
      if (!isChecked(existing.id)) setValue([...selectedIds, existing.id])
      setNewName('')
      return
    }
    setAdding(true)
    try {
      const res = await fetch('/api/features?depth=1', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category }),
      })
      const data = await res.json()
      if (!res.ok || !data?.doc) throw new Error(data?.errors?.[0]?.message || 'Could not add it — please try again.')
      const doc = data.doc as Feature
      setOptions((list) => [...list, doc].sort((a, b) => a.name.localeCompare(b.name)))
      setValue([...selectedIds, doc.id])
      setNewName('')
    } catch (error) {
      setAddError(error instanceof Error ? error.message : 'Could not add it — please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      {label && <div style={{ marginBottom: 8, fontWeight: 600 }}>{label}</div>}

      {loading ? (
        <p style={{ opacity: 0.6 }}>Loading options…</p>
      ) : options.length === 0 ? (
        <p style={{ opacity: 0.6 }}>Nothing in this list yet — add the first one below.</p>
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
              <div
                key={feature.id}
                style={{
                  padding: '8px 10px',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 6,
                  background: checked ? 'var(--theme-elevation-100)' : 'transparent',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(feature.id)} />
                  {iconUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconUrl} alt="" width={18} height={18} style={{ objectFit: 'contain' }} />
                  )}
                  <span>{feature.name}</span>
                </label>
                {/* Ticked + editable list: this caravan's own wording (e.g. "90 L Fridge"). */}
                {editable && checked && (
                  <input
                    type="text"
                    value={labels?.[String(feature.id)] ?? feature.name}
                    onChange={(e) => setLabel(feature, e.target.value)}
                    aria-label={`Wording for ${feature.name} on this caravan`}
                    title="Change the wording for this caravan only, e.g. 90 L Fridge"
                    style={{
                      width: '100%',
                      marginTop: 6,
                      padding: '5px 8px',
                      border: '1px solid var(--theme-elevation-250)',
                      borderRadius: 4,
                      background: 'var(--theme-input-bg, transparent)',
                      color: 'inherit',
                      fontSize: 13,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add a new feature by name: created for every caravan, and ticked on this one. */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, maxWidth: 520 }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault() // don't submit the whole caravan form
              void addFeature()
            }
          }}
          placeholder="Add a new feature, e.g. Solar panel"
          aria-label={`Add a new feature to ${label ?? 'this list'}`}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: '1px solid var(--theme-elevation-250)',
            borderRadius: 6,
            background: 'var(--theme-input-bg, transparent)',
            color: 'inherit',
          }}
        />
        <button
          type="button"
          onClick={() => void addFeature()}
          disabled={adding || !newName.trim()}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: 'none',
            background: 'var(--theme-success-500, #0d473f)',
            color: '#fff',
            fontWeight: 600,
            cursor: adding || !newName.trim() ? 'default' : 'pointer',
            opacity: adding || !newName.trim() ? 0.5 : 1,
          }}
        >
          {adding ? 'Adding…' : '+ Add'}
        </button>
      </div>
      {addError && <p style={{ color: 'var(--theme-error-500, #b42318)', marginTop: 6 }}>{addError}</p>}
    </div>
  )
}

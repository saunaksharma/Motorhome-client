'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export type FilterOption = { id: number | string; name: string }

// One labelled dropdown that writes its value to a URL query param.
function FilterSelect({
  label,
  param,
  options,
}: {
  label: string
  param: string
  options: FilterOption[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const onChange = (value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(param, value)
    else next.delete(param)
    router.push(next.toString() ? `${pathname}?${next.toString()}` : pathname)
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-heading uppercase tracking-wide text-green">{label}</span>
      <select
        value={params.get(param) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-44 rounded-full border border-border bg-card px-4 py-2"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.id} value={String(option.id)}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  )
}

// The caravans/tours listing filter bar. Each field maps to a URL param so
// results are server-rendered and shareable.
export function FilterBar({ filters }: { filters: { label: string; param: string; options: FilterOption[] }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {filters.map((filter) => (
        <FilterSelect key={filter.param} label={filter.label} param={filter.param} options={filter.options} />
      ))}
    </div>
  )
}

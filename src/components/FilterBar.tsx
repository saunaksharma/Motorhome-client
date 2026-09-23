'use client'

import { ChevronDown, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'

export type FilterOption = { id: number | string; name: string }
type Filter = { label: string; param: string; options: FilterOption[] }

// The listing filter bar: one white pill-shaped panel of labelled dropdowns (native
// <select> underneath, so it stays accessible and uses the phone's own picker).
// Each dropdown maps to a URL param, so a filtered view is shareable.
//   default        — pre-built pages (caravans/tours): the URL is updated in place and
//                    FilteredGrid filters in the browser (instant, no server request).
//   serverFiltered — pages that filter on the server (blog): navigate so it re-renders.
export function FilterBar({ filters, serverFiltered = false }: { filters: Filter[]; serverFiltered?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const apply = (next: URLSearchParams) => {
    const url = next.toString() ? `${pathname}?${next.toString()}` : pathname
    if (serverFiltered) router.replace(url, { scroll: false })
    else window.history.replaceState(null, '', url)
  }

  const setValue = (param: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(param, value)
    else next.delete(param)
    apply(next)
  }

  const clearAll = () => {
    const next = new URLSearchParams(params.toString())
    filters.forEach((f) => next.delete(f.param))
    apply(next)
  }

  const anyActive = filters.some((f) => params.get(f.param))

  return (
    <div className="mx-auto grid w-fit max-w-full grid-cols-2 items-center gap-1 rounded-3xl bg-white p-1.5 shadow-[0_12px_32px_-18px_rgb(13_71_63/0.35)] ring-1 ring-green/10 sm:flex sm:flex-wrap sm:justify-center sm:rounded-full">
      {filters.map((filter) => {
        const value = params.get(filter.param) ?? ''
        return (
          <label
            key={filter.param}
            className={cn(
              'relative flex min-w-40 cursor-pointer flex-col rounded-full px-5 py-2 transition-colors hover:bg-green/[0.05]',
              value && 'bg-green/[0.08] hover:bg-green/[0.1]',
            )}
          >
            <span className="font-heading text-[10px] uppercase tracking-[0.25em] text-green/50">{filter.label}</span>
            <select
              value={value}
              onChange={(e) => setValue(filter.param, e.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-6 font-heading text-sm tracking-wide text-green outline-none"
            >
              <option value="">All</option>
              {filter.options.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute bottom-2.5 right-4 size-4 text-gold" />
          </label>
        )
      })}
      {anyActive && (
        <button
          type="button"
          onClick={clearAll}
          className="col-span-2 inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 font-heading text-xs uppercase tracking-wider text-green/60 transition-colors hover:text-green"
        >
          <X className="size-3.5" /> Clear
        </button>
      )}
    </div>
  )
}

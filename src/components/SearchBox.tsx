'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

// Text search that writes ?q to the URL while preserving other params.
export function SearchBox({ placeholder = 'Search…' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = String(new FormData(e.currentTarget).get('q') ?? '').trim()
    const next = new URLSearchParams(params.toString())
    if (query) next.set('q', query)
    else next.delete('q')
    router.push(next.toString() ? `${pathname}?${next.toString()}` : pathname)
  }

  return (
    // Same white pill panel as FilterBar, so the two sit together as one toolbar.
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_12px_32px_-18px_rgb(13_71_63/0.35)] ring-1 ring-green/10"
    >
      <input
        name="q"
        defaultValue={params.get('q') ?? ''}
        placeholder={placeholder}
        aria-label="Search"
        className="min-w-52 bg-transparent font-heading text-sm tracking-wide text-green outline-none placeholder:text-green/40"
      />
      <button
        type="submit"
        aria-label="Search"
        className="grid size-10 place-items-center rounded-full bg-green text-gold transition hover:bg-green/90"
      >
        <Search className="size-4" />
      </button>
    </form>
  )
}

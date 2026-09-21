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
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        name="q"
        defaultValue={params.get('q') ?? ''}
        placeholder={placeholder}
        aria-label="Search"
        className="min-w-56 rounded-full border border-border bg-card px-4 py-2 text-sm"
      />
      <button
        type="submit"
        aria-label="Search"
        className="rounded-full bg-green p-2.5 text-white transition hover:bg-green/90"
      >
        <Search className="size-4" />
      </button>
    </form>
  )
}

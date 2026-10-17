'use client'

import React, { useEffect, useRef, useState } from 'react'

// Brings the story section to life (after 21st.dev's "Sticky Scroll Reveal" + "Timeline"):
// marks the chapter nearest the middle of the screen (and its photo) with `data-on`, and
// sets `--story-progress` (0 → 1) for the gold timeline beam. Without JS everything is
// simply shown — the section only dims/crossfades once `data-ready` is set.
// `collapsed`: only the first chapter shows, with a "Read more" that opens the rest in place
// (client: homepage). The other chapters are in the page all along, just hidden.
export function StoryScroll({ children, className, collapsed = false }: { children: React.ReactNode; className?: string; collapsed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(!collapsed)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
    const photos = Array.from(root.querySelectorAll<HTMLElement>('[data-photo]'))

    const setActive = (index: number) => {
      chapters.forEach((c, i) => c.toggleAttribute('data-on', i === index))
      photos.forEach((p, i) => p.toggleAttribute('data-on', i === index))
    }
    setActive(0)
    root.setAttribute('data-ready', '')

    // The chapter crossing the middle band of the screen is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(chapters.indexOf(entry.target as HTMLElement))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    chapters.forEach((c) => observer.observe(c))

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - rect.top) / rect.height))
        root.style.setProperty('--story-progress', progress.toFixed(3))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={ref} className={className} data-collapsed={open ? undefined : ''}>
      {children}
      {!open && (
        <div className="text-center lg:col-span-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border-2 border-green px-8 py-3 font-heading font-semibold uppercase tracking-wider text-green transition-colors hover:bg-green hover:text-white"
          >
            Read more
          </button>
        </div>
      )}
    </div>
  )
}

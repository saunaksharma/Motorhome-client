'use client'

import React, { useEffect, useRef } from 'react'

// Backup driver for the caravan-page ZoomCollage on browsers without CSS scroll-driven
// animations (iPhones before iOS 26): pins the stage and plays the same sequence from the
// scroll position — title card fades up (0–25%), grid zooms 1 → 0.29 (15–65%), film lifts
// (15–60%), shade (50–75%), final title/button (60–88%). Supported browsers use the CSS
// version in globals.css; reduced-motion visitors keep the static finished collage.
export function CollageDriver() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>('.collage')
    if (!section) return
    if (CSS.supports('animation-timeline: view()')) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const find = (selector: string) => section.querySelector<HTMLElement>(selector)
    const grid = find('.collage-grid')
    const intro = find('.collage-intro')
    const film = find('.collage-film')
    const shade = find('.collage-shade')
    const text = find('.collage-text')
    if (!grid || !intro || !film || !shade || !text) return
    section.setAttribute('data-js', '')

    const range = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)))
    const update = () => {
      const rect = section.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)))
      grid.style.transform = `translate(-50%, -50%) scale(${1 - 0.71 * range(p, 0.15, 0.65)})`
      const i = range(p, 0, 0.25)
      intro.style.opacity = String(1 - i)
      intro.style.transform = `translateY(${-70 * i}px)`
      film.style.opacity = String(1 - 0.5 * range(p, 0.15, 0.6))
      shade.style.opacity = String(range(p, 0.5, 0.75))
      const t = range(p, 0.6, 0.88)
      text.style.opacity = String(t)
      text.style.transform = `translateY(${40 * (1 - t)}px)`
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <span ref={ref} hidden />
}

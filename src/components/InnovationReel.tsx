'use client'

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

import { CtaButton } from '@/components/CtaButton'

type Photo = { url: string; alt?: string | null }

// The innovation pages' scroll moment (caravans have ZoomCollage) — a "showroom coverflow", after
// hover.dev's "Horizontal scroll carousel", Swiper's coverflow and Apple TV's ambient backdrops:
//   the section pins while you scroll and the vehicle's photos glide right → left over a glossy
//   showroom floor (a faint reflection under each). The photo in the centre comes forward — full
//   size, bright, flat — while its neighbours turn away in 3D, shrink and dim, fading into the dark
//   at the screen edges. Behind them the name in huge gold outline letters drifts the other way
//   (depth), the backdrop takes on the centre photo's colours (laptops and up), and a gold line
//   along the bottom fills as you go.
// JS (one rAF per scroll; transforms and opacity only) so it also runs in iPhone Safari. Without
// JS, or with reduced motion, it is a plain swipeable row of photos. Styles: `.reel*` in globals.css.
export function InnovationReel({
  eyebrow,
  title,
  text,
  photos,
  cta,
}: {
  eyebrow?: string | null
  title: string
  text?: string | null
  photos: Photo[]
  cta: { href: string; label: string }
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const track = section.querySelector<HTMLElement>('[data-track]')!
    const cards = Array.from(track.children) as HTMLElement[]
    const glows = Array.from(section.querySelectorAll<HTMLElement>('[data-glow] > *'))
    const name = section.querySelector<HTMLElement>('[data-name]')!
    const bar = section.querySelector<HTMLElement>('[data-bar]')!
    section.setAttribute('data-ready', '')

    let step = 0
    let frame = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      const position = progress * (cards.length - 1) // which photo is centred (fractional)
      track.style.transform = `translate3d(${-position * step}px, 0, 0)`
      cards.forEach((card, i) => {
        const d = i - position // < 0: left of centre, > 0: right of it
        const near = Math.min(Math.abs(d), 1.5)
        card.style.transform = `perspective(1400px) rotateY(${Math.max(-1, Math.min(1, d)) * -32}deg) scale(${1 - near * 0.17})`
        card.style.zIndex = String(100 - Math.round(near * 10))
        ;(card.lastElementChild as HTMLElement).style.opacity = String(Math.min(Math.abs(d), 1) * 0.62)
        if (glows[i]) glows[i].style.opacity = String(Math.max(0, 1 - Math.abs(d)))
      })
      name.style.transform = `translate3d(calc(-50% + ${(0.5 - progress) * 24}%), -50%, 0)`
      bar.style.transform = `scaleX(${progress})`
    }
    // Card spacing, and a scroll length that gives each photo a comfortable stretch of scrolling.
    const layout = () => {
      step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0
      section.style.height = `calc(100svh + ${Math.round(step * (cards.length - 1) * 0.8)}px)`
      update()
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    layout()
    const observer = new ResizeObserver(layout)
    observer.observe(section.firstElementChild as HTMLElement)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={ref} aria-label={`${title} — photos`} className="reel relative bg-[#0a0e0d] text-white">
      <div className="reel-stage relative overflow-hidden">
        {/* Ambient backdrop: the centre photo's colours, blurred (laptops and up; JS sets which). */}
        <div aria-hidden data-glow className="reel-glow pointer-events-none absolute inset-0 hidden sm:block">
          {photos.map((photo, i) => (
            <Image key={i} src={photo.url} alt="" fill sizes="(max-width: 639px) 1px, 30vw" quality={40} className="object-cover" />
          ))}
        </div>
        <div aria-hidden className="reel-vignette pointer-events-none absolute inset-0" />

        {/* Decorative: the name in huge outline letters, drifting behind the photos. */}
        <p aria-hidden data-name className="reel-name pointer-events-none absolute left-1/2 top-1/2 whitespace-nowrap font-display uppercase leading-none">
          {title}
        </p>

        <div className="reel-content relative flex flex-col justify-center gap-6 py-12 sm:gap-8">
          <div className="px-6 text-center">
            {eyebrow && <p className="font-heading text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</p>}
            <h2 className="mt-2 text-balance font-display text-3xl sm:text-5xl">{title}</h2>
          </div>

          {/* The window stays put (soft edges); the track inside it moves. */}
          <div className="reel-window">
            <div data-track className="reel-track flex">
              {photos.map((photo, i) => (
                <figure key={i} className="reel-card relative m-0 aspect-[4/3] shrink-0 overflow-hidden rounded-[1.75rem] bg-white/5 ring-1 ring-white/10">
                  <Image src={photo.url} alt={photo.alt ?? title} fill sizes="(max-width: 639px) 80vw, 600px" className="object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-black opacity-0" />
                </figure>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 px-6 text-center">
            {text && <p className="max-w-xl text-white/80 sm:text-lg">{text}</p>}
            <CtaButton href={cta.href} label={cta.label} gold />
          </div>
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/10">
          <div data-bar className="h-full origin-left scale-x-0 bg-gold shadow-[0_0_10px_1px_rgb(201_162_62/0.55)]" />
        </div>
      </div>
    </section>
  )
}

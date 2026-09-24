'use client'

import { useEffect } from 'react'

// Backup for browsers without CSS scroll-driven animations (iPhones before iOS 26): the
// `.reveal` fade-ups and `.reveal-bar` lines play when they scroll into view, via an
// IntersectionObserver. Browsers that support the CSS version, and visitors who prefer
// reduced motion, are left alone. Content is only hidden once this script is running.
export function ScrollFallback() {
  useEffect(() => {
    if (CSS.supports('animation-timeline: view()')) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('no-sda')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    const observe = () =>
      document.querySelectorAll('.reveal:not([data-in]), .reveal-bar:not([data-in])').forEach((el) => observer.observe(el))
    observe()
    // Pages change without a full reload — pick up new sections as they appear.
    const mutations = new MutationObserver(observe)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])
  return null
}

'use client'

import { useEffect, useRef } from 'react'

/**
 * Fixed 2px top bar; width reflects scroll depth. Updates coalesced via requestAnimationFrame.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef<number | null>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const apply = () => {
      pendingRef.current = null
      const doc = document.documentElement
      const scrollTop = window.scrollY ?? doc.scrollTop
      const scrollable = doc.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? scrollTop / scrollable : 0
      const pct = Math.min(100, Math.max(0, ratio * 100))
      bar.style.width = `${pct}%`
    }

    const onScrollOrResize = () => {
      if (pendingRef.current != null) return
      pendingRef.current = window.requestAnimationFrame(() => {
        apply()
        pendingRef.current = null
      })
    }

    apply()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (pendingRef.current != null) {
        window.cancelAnimationFrame(pendingRef.current)
      }
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[1000] h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-0.5 w-0 bg-brutal-ink"
        style={{ width: '0%' }}
      />
    </div>
  )
}

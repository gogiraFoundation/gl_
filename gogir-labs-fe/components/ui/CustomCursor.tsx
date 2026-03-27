'use client'

import { useEffect, useRef } from 'react'

const INTERACTIVE =
  'a[href], button, [role="button"], input[type="submit"], input[type="button"], .project-card-brutal, label[for], select, textarea'

/**
 * 16px white dot → 32px black over interactive targets. Desktop fine pointer only; hidden when reduced motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const fine = window.matchMedia('(pointer: fine)')
    const canHover = window.matchMedia('(hover: hover)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!fine.matches || !canHover.matches || reduced.matches) {
      return
    }

    const dot = dotRef.current
    if (!dot) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    let raf: number | null = null
    let pendingInteractive = false

    const sync = () => {
      raf = null
      const interactive = pendingInteractive
      dot.style.width = interactive ? '32px' : '16px'
      dot.style.height = interactive ? '32px' : '16px'
      dot.style.backgroundColor = interactive ? '#111111' : '#ffffff'
      dot.style.borderColor = interactive ? '#111111' : 'rgba(17,17,17,0.25)'
    }

    const scheduleInteractive = (value: boolean) => {
      pendingInteractive = value
      if (raf != null) return
      raf = window.requestAnimationFrame(sync)
    }

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      const target = e.target as Element | null
      scheduleInteractive(!!target?.closest(INTERACTIVE))
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      if (raf != null) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[999] rounded-full border border-brutal-ink/25 bg-white"
      style={{
        width: 16,
        height: 16,
        transform: 'translate(-100px, -100px) translate(-50%, -50%)',
        willChange: 'transform',
      }}
      aria-hidden
    />
  )
}

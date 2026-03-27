'use client'

import { useCallback, useEffect, useRef } from 'react'

const CODE_LINES = [
  'from rest_framework.decorators import api_view',
  'from rest_framework.response import Response',
  '@api_view(["GET"])',
  'def health(request):',
  '    return Response({"ok": True})  # IAM',
]

/**
 * Faux terminal / code snippet; subtle parallax via rAF-coalesced pointer updates.
 */
export function HeroGeometric() {
  const rootRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })

  const tick = useCallback(() => {
    rafRef.current = null
    const el = rootRef.current
    if (!el) return
    const { x, y } = targetRef.current
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 24
      const ny = (e.clientY / window.innerHeight - 0.5) * 24
      targetRef.current = { x: nx, y: ny }
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [tick])

  return (
    <div
      ref={rootRef}
      className="relative hidden select-none items-center justify-start will-change-transform md:flex md:min-h-[320px] lg:ml-[20px]"
      aria-hidden
    >
      <div className="w-full max-w-[min(100%,280px)] animate-pulse border border-brutal-ink/30 bg-brutal-bg p-3 font-mono text-[10px] leading-relaxed text-brutal-ink shadow-[0_10px_24px_rgba(0,0,0,0.08)] md:max-w-[300px] md:p-3.5 md:text-xs">
        <div className="mb-2 border-b border-brutal-ink/15 pb-2 text-brutal-muted">$ _</div>
        {CODE_LINES.map((line, i) => (
          <div
            key={`${i}-${line.slice(0, 24)}`}
            className={i === CODE_LINES.length - 1 ? 'truncate text-brutal-muted' : 'truncate'}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Home hero instrument panel: pure canvas 2D radar with corner HUD readouts
 * and a thin event log of sweep contacts. aria-hidden; static under
 * prefers-reduced-motion; CSS-hidden below 900px.
 *
 * HUD values are written via refs into empty spans so React re-renders
 * (e.g. essays query settling) do not clobber the live counters.
 */

const TAU = Math.PI * 2
/** rad/s — ~7.85s rotation; calmer next to hero copy */
const SWEEP_SPEED = 0.8

const UPTIME_START = new Date('2026-03-26T00:00:00Z')
const TOTAL_LOC = 24000
const TOTAL_PROJECTS = 3
const BLIP_COUNT = 12
const LOG_MAX = 5

/** Essay accent as RGB — matches --essay-accent #0d5c56 */
const TEAL = '13,92,86'

type Blip = { a: number; r: number; lit: number; pulse: number }

type LogLine = { id: number; text: string }

function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0')
}

function formatUptime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${d}d ${pad(h)}:${pad(m)}:${pad(s % 60)}`
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function bearingDeg(a: number): number {
  return Math.round(((a * 180) / Math.PI + 90 + 360) % 360)
}

function clockStamp(now = new Date()): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function normalizeAngle(a: number): number {
  return ((a % TAU) + TAU) % TAU
}

export function RadarPanel({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uptimeRef = useRef<HTMLSpanElement>(null)
  const locRef = useRef<HTMLSpanElement>(null)
  const projectsRef = useRef<HTMLSpanElement>(null)
  const contactsRef = useRef<HTMLSpanElement>(null)
  const logRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduce = reduceMq.matches

    let W = 0
    let H = 0
    let cx = 0
    let cy = 0
    let R = 0
    let sweep = 0
    let lastHud = 0
    let locT = 0
    let projT = 0
    let last = performance.now()
    let raf = 0
    let running = true
    let looping = false
    let logSeq = 0
    const logLines: LogLine[] = []

    const blips: Blip[] = Array.from({ length: BLIP_COUNT }, () => ({
      a: Math.random() * TAU,
      r: 0.16 + Math.random() * 0.78,
      lit: 0,
      pulse: 1,
    }))

    const pushLog = (text: string) => {
      logSeq += 1
      logLines.unshift({ id: logSeq, text })
      if (logLines.length > LOG_MAX) logLines.length = LOG_MAX
      const list = logRef.current
      if (!list) return
      list.replaceChildren(
        ...logLines.map((line) => {
          const li = document.createElement('li')
          li.textContent = line.text
          return li
        })
      )
    }

    const isPaintable = () => {
      // Ancestor `display:none` still reports child display as block — use box size.
      if (root.offsetParent === null && getComputedStyle(root).position !== 'fixed') {
        return false
      }
      return canvas.clientWidth >= 10 && canvas.clientHeight >= 10
    }

    const resize = () => {
      if (!isPaintable()) {
        W = H = R = 0
        return false
      }
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 10 || rect.height < 10) {
        W = H = R = 0
        return false
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = W / 2
      cy = H / 2
      R = Math.min(W, H) / 2 - 28
      return R > 0
    }

    const draw = (): number => {
      if (R <= 0 || W <= 0) return 0
      ctx.clearRect(0, 0, W, H)

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.4)
      bg.addColorStop(0, `rgba(${TEAL},0.07)`)
      bg.addColorStop(0.65, `rgba(${TEAL},0.02)`)
      bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      ctx.lineWidth = 1
      ctx.strokeStyle = `rgba(${TEAL},0.22)`
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (R * i) / 4, 0, TAU)
        ctx.stroke()
      }

      ctx.strokeStyle = `rgba(${TEAL},0.14)`
      ctx.beginPath()
      ctx.moveTo(cx - R, cy)
      ctx.lineTo(cx + R, cy)
      ctx.moveTo(cx, cy - R)
      ctx.lineTo(cx, cy + R)
      ctx.stroke()

      for (let d = 0; d < 360; d += 5) {
        const a = ((d - 90) * Math.PI) / 180
        const major = d % 45 === 0
        const r1 = R - (major ? 10 : 4)
        ctx.strokeStyle = major ? `rgba(${TEAL},0.45)` : `rgba(${TEAL},0.16)`
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
        ctx.stroke()
      }

      ctx.fillStyle = `rgba(${TEAL},0.48)`
      ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ;(
        [
          ['000', -90],
          ['090', 0],
          ['180', 90],
          ['270', 180],
        ] as const
      ).forEach(([txt, deg]) => {
        const a = (deg * Math.PI) / 180
        ctx.fillText(txt, cx + Math.cos(a) * (R - 18), cy + Math.sin(a) * (R - 18))
      })

      if (!reduce) {
        const SLICES = 36
        const SPREAD = Math.PI * 0.42
        for (let i = 0; i < SLICES; i++) {
          const t = (i + 1) / SLICES
          const a0 = sweep - SPREAD * (1 - i / SLICES)
          const a1 = sweep - SPREAD * (1 - t)
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.arc(cx, cy, R, a0, a1)
          ctx.closePath()
          ctx.fillStyle = `rgba(${TEAL},${0.18 * t * t})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R)
        ctx.strokeStyle = `rgba(${TEAL},0.8)`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      let litCount = 0
      for (const b of blips) {
        const x = cx + Math.cos(b.a) * b.r * R
        const y = cy + Math.sin(b.a) * b.r * R
        if (b.lit > 0.35) litCount++

        if (!reduce && b.lit > 0.02 && b.pulse < 1) {
          ctx.beginPath()
          ctx.arc(x, y, 4 + b.pulse * 16, 0, TAU)
          ctx.strokeStyle = `rgba(${TEAL},${b.lit * 0.55 * (1 - b.pulse)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        const alpha = reduce ? 0.55 : 0.12 + b.lit * 0.88
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, TAU)
        ctx.fillStyle = `rgba(${TEAL},${alpha})`
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, TAU)
      ctx.fillStyle = `rgba(${TEAL},0.9)`
      ctx.fill()

      return litCount
    }

    const updateHud = (now: number, dt: number, contacts: number) => {
      if (contactsRef.current) {
        contactsRef.current.textContent = pad(contacts)
      }

      if (!reduce) {
        locT = Math.min(1, locT + dt / 1.6)
        projT = Math.min(1, projT + dt / 0.9)
      } else {
        locT = 1
        projT = 1
      }

      if (locRef.current) {
        locRef.current.textContent = Math.round(TOTAL_LOC * easeOut(locT)).toLocaleString('en-GB')
      }
      if (projectsRef.current) {
        projectsRef.current.textContent = String(Math.round(TOTAL_PROJECTS * easeOut(projT)))
      }

      if (now - lastHud < 1000 && !reduce) return
      lastHud = now
      if (uptimeRef.current) {
        uptimeRef.current.textContent = formatUptime(Date.now() - UPTIME_START.getTime())
      }
    }

    const updateBlips = (dt: number, prevSweep: number, delta: number) => {
      for (const b of blips) {
        const d = normalizeAngle(b.a - prevSweep)
        if (d < delta) {
          b.lit = 1
          b.pulse = 0
          pushLog(`${clockStamp()} · CONTACT ${pad(bearingDeg(b.a), 3)}° · R ${b.r.toFixed(2)}`)
        }
        b.lit = Math.max(0, b.lit - dt * 0.5)
        b.pulse = Math.min(1, b.pulse + dt * 1.4)
      }
    }

    const frame = (now: number) => {
      if (!running || !looping) return
      if (document.hidden) {
        last = now
        raf = requestAnimationFrame(frame)
        return
      }

      if (!resize()) {
        // Hidden / zero-size (e.g. <900px): stop spinning the loop until RO wakes us.
        stopLoop()
        return
      }

      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      let contacts = 0
      if (!reduce) {
        const prev = sweep
        const delta = dt * SWEEP_SPEED
        sweep = normalizeAngle(sweep + delta)
        updateBlips(dt, prev, delta)
        contacts = draw()
      } else {
        contacts = draw()
      }

      updateHud(now, dt, contacts)
      raf = requestAnimationFrame(frame)
    }

    const startLoop = () => {
      if (looping || !running || reduce) return
      looping = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const stopLoop = () => {
      looping = false
      cancelAnimationFrame(raf)
      raf = 0
    }

    const bootPaint = () => {
      reduce = reduceMq.matches
      if (!resize()) {
        stopLoop()
        return
      }
      if (reduce) {
        locT = 1
        projT = 1
        for (const b of blips) b.lit = 0.6
        draw()
        updateHud(performance.now(), 1, blips.length)
        if (logLines.length === 0) {
          pushLog(`${clockStamp()} · STANDBY · MOTION OFF`)
        }
        stopLoop()
        return
      }
      draw()
      updateHud(performance.now(), 0.05, 0)
      startLoop()
    }

    const onVisibility = () => {
      last = performance.now()
      if (!document.hidden) bootPaint()
    }

    const onMotionChange = () => {
      bootPaint()
    }

    const ro = new ResizeObserver(() => {
      bootPaint()
    })
    ro.observe(root)

    document.addEventListener('visibilitychange', onVisibility)
    reduceMq.addEventListener('change', onMotionChange)

    // Empty HUD spans — set placeholders immediately, then paint when sized.
    if (uptimeRef.current) uptimeRef.current.textContent = '--'
    if (locRef.current) locRef.current.textContent = '0'
    if (projectsRef.current) projectsRef.current.textContent = '0'
    if (contactsRef.current) contactsRef.current.textContent = '00'

    bootPaint()
    // Layout may settle after first paint (fonts / grid).
    requestAnimationFrame(() => bootPaint())

    return () => {
      running = false
      stopLoop()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      reduceMq.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <div ref={rootRef} className={cn('radar-root', className)} aria-hidden="true">
      <div className="radar-panel">
        <canvas ref={canvasRef} className="radar-canvas" />
        <div className="radar-hud">
          <div className="radar-hud-cell radar-tl">
            <span className="radar-k">UPTIME</span>
            <span className="radar-v" ref={uptimeRef} />
          </div>
          <div className="radar-hud-cell radar-tr">
            <span className="radar-k">LOC SHIPPED</span>
            <span className="radar-v" ref={locRef} />
          </div>
          <div className="radar-hud-cell radar-bl">
            <span className="radar-k">PROJECTS</span>
            <span className="radar-v" ref={projectsRef} />
          </div>
          <div className="radar-hud-cell radar-br">
            <span className="radar-k">CONTACTS</span>
            <span className="radar-v" ref={contactsRef} />
          </div>
        </div>
        <div className="radar-scanlines" />
      </div>
      <div className="radar-log">
        <p className="radar-log-label">EVENT LOG</p>
        <ul ref={logRef} className="radar-log-list" />
      </div>
    </div>
  )
}

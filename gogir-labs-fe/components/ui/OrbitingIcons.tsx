'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface OrbitingIconsProps {
  centerIcon: ReactNode
  icons: Array<{ icon: ReactNode; delay?: number }>
  radius?: number
  className?: string
  /** Orbit duration in seconds (satellites and counter-rotation stay in sync). */
  orbitDurationSec?: number
}

export function OrbitingIcons({
  centerIcon,
  icons,
  radius = 100,
  className,
  orbitDurationSec = 80,
}: OrbitingIconsProps) {
  const ring1 = radius * 2
  const ring2 = radius * 2 + 48
  const ring3 = radius * 2 + 96

  return (
    <div className={cn('relative flex h-64 w-full items-center justify-center sm:h-96', className)}>
      {/* Decorative orbital rings (subtle, orangered hues) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="absolute rounded-full border border-[#ff4500]/30 shadow-[inset_0_0_20px_rgba(255,69,0,0.06)]"
          style={{ width: ring1, height: ring1 }}
        />
        <div
          className="absolute animate-solar-ring rounded-full border border-dashed border-[#ff6347]/25"
          style={{
            width: ring2,
            height: ring2,
            animationDuration: `${Math.max(orbitDurationSec * 2.5, 45)}s`,
          }}
        />
        <div
          className="border-[#ff7f50]/12 absolute rounded-full border"
          style={{ width: ring3, height: ring3 }}
        />
      </div>

      {/* Sun (center) */}
      <div
        className={cn(
          'relative z-20 flex h-16 w-16 items-center justify-center rounded-full',
          'bg-gradient-to-br from-[#ff4500] via-[#ff6347] to-[#ff8c00]',
          'animate-solar-pulse shadow-glow-orange sm:h-24 sm:w-24',
          '[&_svg]:h-8 [&_svg]:w-8 [&_svg]:text-white sm:[&_svg]:h-12 sm:[&_svg]:w-12'
        )}
      >
        {centerIcon}
      </div>

      {/* Orbiting satellites */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div
          className="origin-center animate-solar-orbit motion-reduce:animate-none"
          style={{
            width: 0,
            height: 0,
            animationDuration: `${orbitDurationSec}s`,
          }}
        >
          {icons.map((item, index) => {
            const angle = (360 / icons.length) * index
            return (
              <div
                key={index}
                className="absolute flex h-0 w-0 items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg) translateY(-${radius}px)`,
                }}
              >
                <div
                  className={cn(
                    'pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full',
                    'border-2 border-[#ff4500]/55 bg-gradient-to-b from-[#1a0f0a] to-[#0a0a0a]',
                    'shadow-glow-orange transition-transform duration-300 ease-out',
                    'animate-solar-counter motion-reduce:animate-none',
                    'hover:scale-125 hover:border-[#ff6347] hover:shadow-glow-orange-lg',
                    'sm:h-12 sm:w-12',
                    '[&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-[#ffd4b8] sm:[&_svg]:h-6 sm:[&_svg]:w-6'
                  )}
                  style={{ animationDuration: `${orbitDurationSec}s` }}
                >
                  {item.icon}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

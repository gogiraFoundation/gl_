'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  animationType?: 'fade-in' | 'slide-left' | 'slide-right'
  delay?: number
}

export function ScrollAnimation({
  children,
  className = '',
  animationType = 'fade-in',
  delay = 0,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        setIsVisible(true)
        return
      }
    }

    // Check if element is already visible on mount (above the fold)
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

      if (isInViewport) {
        setIsVisible(true)
        return
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.disconnect()
        }
      },
      {
        threshold: 0.01,
        rootMargin: '100px 0px 0px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [delay])

  const animationClass =
    animationType === 'fade-in'
      ? 'fade-in-on-scroll'
      : animationType === 'slide-left'
        ? 'slide-in-left-on-scroll'
        : 'slide-in-right-on-scroll'

  return (
    <div ref={ref} className={`${animationClass} ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

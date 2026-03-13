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
    // Check if element is already visible on mount (above the fold)
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

      if (isInViewport) {
        // Show immediately if already visible
        setIsVisible(true)
        return
      }
    }

    // Use Intersection Observer for elements below the fold
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          // Disconnect after animation to improve performance
          observer.disconnect()
        }
      },
      {
        threshold: 0.01, // Trigger as soon as 1% is visible
        rootMargin: '100px 0px 0px 0px', // Start animation 100px before element enters viewport
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
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

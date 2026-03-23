'use client'

import { Sun, Moon } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const context = useContext(ThemeContext)

  useEffect(() => {
    setMounted(true)
    // Get initial theme from document or context
    if (typeof window !== 'undefined') {
      const currentTheme = document.documentElement.getAttribute('data-theme') as
        | 'dark'
        | 'light'
        | null
      if (currentTheme) {
        setTheme(currentTheme)
      } else if (context?.theme) {
        setTheme(context.theme)
      }
    }
  }, [context])

  const handleToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    if (context?.toggleTheme) {
      context.toggleTheme()
    } else if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem('theme', nextTheme)
    }
  }

  // Sync with context if available
  useEffect(() => {
    if (context?.theme) {
      setTheme(context.theme)
    }
  }, [context?.theme])

  if (!mounted) {
    return (
      <button
        className="relative rounded-lg bg-slate-200 p-2 transition-colors hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Toggle theme"
        disabled
      >
        <div className="relative h-5 w-5">
          <Moon className="absolute inset-0 h-5 w-5 text-indigo-500 dark:text-blue-300" />
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className="relative rounded-lg bg-slate-200 p-2 transition-colors hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 text-yellow-400 transition-all duration-300 ${
            theme === 'dark' ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 text-indigo-500 transition-all duration-300 dark:text-blue-300 ${
            theme === 'light' ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
        />
      </div>
    </button>
  )
}

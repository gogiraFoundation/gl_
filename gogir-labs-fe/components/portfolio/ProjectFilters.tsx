'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ListFilter, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
  id: number
  name: string
  slug: string
}

interface Technology {
  id: number
  name: string
  slug: string
}

interface ProjectFiltersProps {
  categories: Category[]
  technologies: Technology[]
  selectedCategory: number | null
  selectedTechnology: number | null
  searchQuery: string
  onCategoryChange: (categoryId: number | null) => void
  onTechnologyChange: (technologyId: number | null) => void
  onSearchChange: (query: string) => void
}

const optionClass =
  'flex min-h-11 w-full items-center px-3 text-left font-essay-sans text-sm text-essay-ink transition-colors duration-essay-fast ease-essay hover:bg-essay-ink/5 focus-visible:bg-essay-ink/5 focus-visible:outline-none'

export function ProjectFilters({
  categories,
  technologies,
  selectedCategory,
  selectedTechnology,
  searchQuery,
  onCategoryChange,
  onTechnologyChange,
  onSearchChange,
}: ProjectFiltersProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const hasFilters = selectedCategory !== null || selectedTechnology !== null
  const activeCount = (selectedCategory !== null ? 1 : 0) + (selectedTechnology !== null ? 1 : 0)

  const selectedCategoryName =
    selectedCategory === null
      ? 'All'
      : (categories.find((c) => c.id === selectedCategory)?.name ?? 'All')
  const selectedTechnologyName =
    selectedTechnology === null
      ? 'All'
      : (technologies.find((t) => t.id === selectedTechnology)?.name ?? 'All')

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="mb-10 space-y-4">
      <div className="flex items-stretch gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-essay-muted"
            aria-hidden
          />
          <input
            type="search"
            id="project-search"
            name="project-search"
            placeholder="Search projects…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="min-h-12 w-full border border-essay-ink/20 bg-essay-bg py-3 pl-11 pr-4 font-essay-sans text-[15px] text-essay-ink placeholder:text-essay-muted focus-visible:border-essay-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-essay-accent focus-visible:ring-offset-2 focus-visible:ring-offset-essay-bg"
            autoComplete="off"
          />
        </div>

        <div className="relative shrink-0" ref={rootRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={cn(
              'inline-flex min-h-12 min-w-12 items-center justify-center border border-essay-ink/20 bg-essay-bg text-essay-ink transition-colors duration-essay-fast ease-essay hover:border-essay-accent hover:text-essay-accent',
              (open || hasFilters) && 'border-essay-accent text-essay-accent'
            )}
            aria-label={hasFilters ? `Open filters, ${activeCount} active` : 'Open filters'}
            aria-expanded={open}
            aria-controls={panelId}
          >
            <ListFilter className="h-5 w-5" aria-hidden />
            {hasFilters && (
              <span className="sr-only">
                Category {selectedCategoryName}, technology {selectedTechnologyName}
              </span>
            )}
          </button>

          {open && (
            <div
              id={panelId}
              role="dialog"
              aria-label="Project filters"
              className="absolute right-0 z-30 mt-2 w-[min(100vw-3rem,20rem)] border border-essay-ink/20 bg-essay-bg p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-essay-mono text-xs uppercase tracking-wider text-essay-muted">
                  Filters
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center text-essay-muted transition-colors duration-essay-fast ease-essay hover:text-essay-accent"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="space-y-5">
                <fieldset>
                  <legend className="mb-2 text-left font-essay-mono text-xs uppercase tracking-wider text-essay-muted">
                    Categories
                  </legend>
                  <div className="max-h-48 space-y-0.5 overflow-y-auto border border-essay-ink/15">
                    <button
                      type="button"
                      className={cn(
                        optionClass,
                        selectedCategory === null && 'bg-essay-ink/5 text-essay-accent'
                      )}
                      onClick={() => onCategoryChange(null)}
                      aria-pressed={selectedCategory === null}
                    >
                      All
                    </button>
                    {categories.map((category) => {
                      const active = selectedCategory === category.id
                      return (
                        <button
                          key={category.id}
                          type="button"
                          className={cn(optionClass, active && 'bg-essay-ink/5 text-essay-accent')}
                          onClick={() => onCategoryChange(category.id)}
                          aria-pressed={active}
                        >
                          {category.name}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-2 text-left font-essay-mono text-xs uppercase tracking-wider text-essay-muted">
                    Technologies
                  </legend>
                  <div className="max-h-48 space-y-0.5 overflow-y-auto border border-essay-ink/15">
                    <button
                      type="button"
                      className={cn(
                        optionClass,
                        selectedTechnology === null && 'bg-essay-ink/5 text-essay-accent'
                      )}
                      onClick={() => onTechnologyChange(null)}
                      aria-pressed={selectedTechnology === null}
                    >
                      All
                    </button>
                    {technologies.map((tech) => {
                      const active = selectedTechnology === tech.id
                      return (
                        <button
                          key={tech.id}
                          type="button"
                          className={cn(optionClass, active && 'bg-essay-ink/5 text-essay-accent')}
                          onClick={() => onTechnologyChange(tech.id)}
                          aria-pressed={active}
                        >
                          {tech.name}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className="mt-4 inline-flex min-h-11 items-center font-essay-sans text-sm font-medium text-essay-ink underline underline-offset-4 transition-colors duration-essay-fast ease-essay hover:text-essay-accent"
                  onClick={() => {
                    onCategoryChange(null)
                    onTechnologyChange(null)
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {hasFilters && (
        <p className="text-left font-essay-sans text-xs text-essay-muted">
          Showing <span className="font-medium text-essay-ink">{selectedCategoryName}</span>
          {' · '}
          <span className="font-medium text-essay-ink">{selectedTechnologyName}</span>
        </p>
      )}
    </div>
  )
}

'use client'

import { Search, ChevronDown } from 'lucide-react'
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

const TECH_SELECT_THRESHOLD = 16

const chipBase =
  'filter-chip shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500'

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
  const useTechSelect = technologies.length > TECH_SELECT_THRESHOLD
  const hasFilters = selectedCategory !== null || selectedTechnology !== null

  const inputSurface = cn(
    'w-full border shadow-sm backdrop-blur-sm transition-colors duration-200',
    'border-[var(--border-default)] bg-[var(--surface-input)] text-[var(--text-primary)]',
    'placeholder:text-[var(--text-tertiary)]',
    'focus-visible:border-[var(--border-focus)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]'
  )

  return (
    <div className="mb-10 space-y-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-tertiary)]"
          aria-hidden
        />
        <input
          type="search"
          id="project-search"
          name="project-search"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            inputSurface,
            'rounded-2xl py-3 pl-11 pr-4 text-[15px] transition-colors duration-200'
          )}
          autoComplete="off"
        />
      </div>

      <div>
        <p className="mb-2.5 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
          Categories
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            className={cn(
              chipBase,
              selectedCategory === null
                ? 'border-purple-500/50 bg-[var(--surface-chip-active)] text-[var(--text-primary)] shadow-md shadow-purple-900/15 dark:shadow-purple-900/20'
                : 'border-[var(--border-default)] bg-[var(--surface-chip)] text-[var(--text-secondary)] hover:border-[var(--border-focus)] hover:bg-[var(--surface-elevated)]'
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
                className={cn(
                  chipBase,
                  active
                    ? 'border-purple-500/50 bg-[var(--surface-chip-active)] text-[var(--text-primary)] shadow-md shadow-purple-900/15 dark:shadow-purple-900/20'
                    : 'border-[var(--border-default)] bg-[var(--surface-chip)] text-[var(--text-secondary)] hover:border-[var(--border-focus)] hover:bg-[var(--surface-elevated)]'
                )}
                onClick={() => onCategoryChange(category.id)}
                aria-pressed={active}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
          Technologies
        </p>
        {useTechSelect ? (
          <div className="relative max-w-md">
            <select
              id="project-technology"
              name="project-technology"
              value={selectedTechnology || ''}
              onChange={(e) =>
                onTechnologyChange(e.target.value ? Number(e.target.value) : null)
              }
              className={cn(
                inputSurface,
                'min-h-[44px] cursor-pointer appearance-none rounded-2xl py-3 pl-4 pr-11 text-[15px]'
              )}
            >
              <option value="">All technologies</option>
              {technologies.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-tertiary)]"
              aria-hidden
            />
          </div>
        ) : (
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              className={cn(
                chipBase,
                selectedTechnology === null
                  ? 'border-purple-500/50 bg-[var(--surface-chip-active)] text-[var(--text-primary)] shadow-md shadow-purple-900/15 dark:shadow-purple-900/20'
                  : 'border-[var(--border-default)] bg-[var(--surface-chip)] text-[var(--text-secondary)] hover:border-[var(--border-focus)] hover:bg-[var(--surface-elevated)]'
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
                  className={cn(
                    chipBase,
                    active
                      ? 'border-purple-500/50 bg-[var(--surface-chip-active)] text-[var(--text-primary)] shadow-md shadow-purple-900/15 dark:shadow-purple-900/20'
                      : 'border-[var(--border-default)] bg-[var(--surface-chip)] text-[var(--text-secondary)] hover:border-[var(--border-focus)] hover:bg-[var(--surface-elevated)]'
                  )}
                  onClick={() => onTechnologyChange(tech.id)}
                  aria-pressed={active}
                >
                  {tech.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {hasFilters && (
        <div className="flex justify-start pt-1">
          <button
            type="button"
            className="filter-chip rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[var(--accent-primary)] underline-offset-4 transition-colors duration-200 hover:opacity-90 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 dark:text-purple-300/90 dark:hover:text-white"
            onClick={() => {
              onCategoryChange(null)
              onTechnologyChange(null)
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}

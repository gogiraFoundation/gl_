'use client'

import { Search, X } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface BlogFiltersProps {
  categories: Category[]
  tags: Tag[]
  selectedCategory: number | null
  selectedTag: number | null
  searchQuery: string
  onCategoryChange: (categoryId: number | null) => void
  onTagChange: (tagId: number | null) => void
  onSearchChange: (query: string) => void
}

const fieldClass =
  'min-h-12 border border-brutal-ink bg-brutal-bg px-4 py-3 text-brutal-ink transition-[border-color,box-shadow] duration-200 placeholder:text-brutal-muted focus:border-[orangered] focus:outline-none focus:ring-1 focus:ring-[orangered]/40'

export function BlogFilters({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  searchQuery,
  onCategoryChange,
  onTagChange,
  onSearchChange,
}: BlogFiltersProps) {
  return (
    <div className="mb-12 space-y-6">
      <div className="relative w-full max-w-2xl">
        <Search
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brutal-muted"
          aria-hidden
        />
        <input
          type="search"
          id="blog-search"
          name="blog-search"
          placeholder="Search posts…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${fieldClass} w-full rounded-sm py-3.5 pl-12 pr-10`}
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-brutal-muted transition-colors hover:text-brutal-ink"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-start gap-4">
        <select
          id="blog-category"
          name="blog-category"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
          className={`${fieldClass} cursor-pointer rounded-sm`}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          id="blog-tag"
          name="blog-tag"
          value={selectedTag || ''}
          onChange={(e) => onTagChange(e.target.value ? Number(e.target.value) : null)}
          className={`${fieldClass} cursor-pointer rounded-sm`}
          aria-label="Filter by tag"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        {(selectedCategory || selectedTag || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              onCategoryChange(null)
              onTagChange(null)
              onSearchChange('')
            }}
            className={`${fieldClass} rounded-sm font-medium transition-opacity hover:opacity-70`}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}

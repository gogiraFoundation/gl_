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
      {/* Search Bar */}
      <div className="relative mx-auto w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <input
          type="search"
          id="blog-search"
          name="blog-search"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass w-full rounded-sm border border-white/10 py-3.5 pl-12 pr-10 text-white placeholder-gray-400 shadow-[0_8px_18px_rgba(112,128,144,0.35)] transition-[box-shadow,border-color] duration-300 ease-out hover:border-orange-500/45 hover:shadow-[0_10px_26px_rgba(255,69,0,0.32)] focus:border-orange-500/55 focus:outline-none focus:ring-0 focus:shadow-[0_12px_30px_rgba(255,69,0,0.45)] active:shadow-[0_8px_22px_rgba(255,69,0,0.38)]"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <select
          id="blog-category"
          name="blog-category"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
          className="glass cursor-pointer rounded-lg border border-white/15 px-4 py-2 text-white shadow-[0_6px_14px_rgba(112,128,144,0.25)] transition-[box-shadow,border-color] duration-300 ease-out hover:border-orange-500/40 hover:shadow-[0_8px_18px_rgba(255,69,0,0.28)] focus:outline-none focus:ring-0 focus:border-orange-500/50 focus:shadow-[0_10px_22px_rgba(255,69,0,0.38)]"
        >
          <option value="" className="bg-gray-900">
            All Categories
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="bg-gray-900">
              {category.name}
            </option>
          ))}
        </select>
        <select
          id="blog-tag"
          name="blog-tag"
          value={selectedTag || ''}
          onChange={(e) => onTagChange(e.target.value ? Number(e.target.value) : null)}
          className="glass cursor-pointer rounded-lg border border-white/15 px-4 py-2 text-white shadow-[0_6px_14px_rgba(112,128,144,0.25)] transition-[box-shadow,border-color] duration-300 ease-out hover:border-orange-500/40 hover:shadow-[0_8px_18px_rgba(255,69,0,0.28)] focus:outline-none focus:ring-0 focus:border-orange-500/50 focus:shadow-[0_10px_22px_rgba(255,69,0,0.38)]"
        >
          <option value="" className="bg-gray-900">
            All Tags
          </option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id} className="bg-gray-900">
              {tag.name}
            </option>
          ))}
        </select>
        {(selectedCategory || selectedTag || searchQuery) && (
          <button
            onClick={() => {
              onCategoryChange(null)
              onTagChange(null)
              onSearchChange('')
            }}
            className="glass rounded-lg border border-white/15 px-4 py-2 text-white shadow-[0_6px_14px_rgba(112,128,144,0.25)] transition-[box-shadow,border-color] duration-300 ease-out hover:border-orange-500/45 hover:shadow-[0_8px_18px_rgba(255,69,0,0.28)] focus:outline-none focus:ring-0 active:shadow-[0_6px_14px_rgba(255,69,0,0.35)]"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

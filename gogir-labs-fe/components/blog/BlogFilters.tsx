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
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          id="blog-search"
          name="blog-search"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-10 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <select
          id="blog-category"
          name="blog-category"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 glass rounded-lg text-white border border-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="" className="bg-gray-900">All Categories</option>
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
          className="px-4 py-2 glass rounded-lg text-white border border-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="" className="bg-gray-900">All Tags</option>
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
            className="px-4 py-2 glass rounded-lg text-white border border-blue-500/20 hover:border-blue-500 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

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
  return (
    <div className="mb-8 space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedTechnology || ''}
          onChange={(e) => onTechnologyChange(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Technologies</option>
          {technologies.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
        {(selectedCategory || selectedTechnology) && (
          <button
            onClick={() => {
              onCategoryChange(null)
              onTechnologyChange(null)
            }}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}


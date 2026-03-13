'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import Link from 'next/link'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

interface SearchResult {
  query: string
  blog_posts: Array<{
    id: number
    title: string
    slug: string
    excerpt: string
    featured_image: string | null
    category: { id: number; name: string; slug: string } | null
  }>
  projects: Array<{
    id: number
    title: string
    slug: string
    description: string
    featured_image: string | null
    category: { id: number; name: string; slug: string } | null
  }>
  total: number
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const { trackClick } = useAnalyticsEvent()

  const { data: results, isLoading } = useQuery<SearchResult>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return { query: '', blog_posts: [], projects: [], total: 0 }
      }
      const response = await api.get('/search/', {
        params: { q: debouncedQuery },
      })
      return response.data
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleResultClick = (type: string, id: number, title: string) => {
    trackClick('search_result_click', { type, id, title, query: debouncedQuery })
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button/Input */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-300 transition-colors hover:text-white"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
        <span className="hidden md:inline">Search</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 max-w-[90vw] rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
          {/* Search Input */}
          <div className="border-b border-gray-700 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blog posts, projects..."
                className="w-full rounded-lg border border-gray-600 bg-gray-800 py-2 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && <div className="p-4 text-center text-gray-400">Searching...</div>}

            {!isLoading && debouncedQuery && results && (
              <>
                {results.total === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No results found for &quot;{debouncedQuery}&quot;
                  </div>
                ) : (
                  <>
                    {/* Blog Posts */}
                    {results.blog_posts.length > 0 && (
                      <div className="border-b border-gray-700 p-4">
                        <h3 className="mb-2 text-sm font-semibold text-gray-400">Blog Posts</h3>
                        <div className="space-y-2">
                          {results.blog_posts.map((post) => (
                            <Link
                              key={post.id}
                              href={`/blog/${post.slug}`}
                              onClick={() => handleResultClick('blog', post.id, post.title)}
                              className="block rounded p-2 transition-colors hover:bg-gray-800"
                            >
                              <div className="text-sm font-medium text-white">{post.title}</div>
                              {post.category && (
                                <div className="mt-1 text-xs text-purple-400">
                                  {post.category.name}
                                </div>
                              )}
                              <div className="mt-1 line-clamp-1 text-xs text-gray-400">
                                {post.excerpt}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {results.projects.length > 0 && (
                      <div className="p-4">
                        <h3 className="mb-2 text-sm font-semibold text-gray-400">Projects</h3>
                        <div className="space-y-2">
                          {results.projects.map((project) => (
                            <Link
                              key={project.id}
                              href={`/portfolio/${project.slug}`}
                              onClick={() =>
                                handleResultClick('project', project.id, project.title)
                              }
                              className="block rounded p-2 transition-colors hover:bg-gray-800"
                            >
                              <div className="text-sm font-medium text-white">{project.title}</div>
                              {project.category && (
                                <div className="mt-1 text-xs text-purple-400">
                                  {project.category.name}
                                </div>
                              )}
                              <div className="mt-1 line-clamp-1 text-xs text-gray-400">
                                {project.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View All Results */}
                    {results.total > 5 && (
                      <div className="border-t border-gray-700 p-4">
                        <Link
                          href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                          onClick={() => setIsOpen(false)}
                          className="block text-center text-sm font-medium text-purple-400 hover:text-purple-300"
                        >
                          View all {results.total} results →
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {!debouncedQuery && (
              <div className="p-4 text-center text-gray-400">Start typing to search...</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

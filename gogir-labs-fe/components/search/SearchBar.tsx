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
        className="group flex items-center gap-2 rounded-sm bg-brutal-ink/[0.05] px-2.5 py-2 text-brutal-muted shadow-[0_2px_10px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.06)_inset] transition-[transform,box-shadow,color,background-color,opacity] duration-300 hover:-translate-y-0.5 hover:bg-brutal-ink/[0.08] hover:text-[orangered] hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)] motion-reduce:hover:translate-y-0"
        aria-label="Search"
      >
        <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
        <span className="hidden text-xs font-semibold uppercase tracking-wider md:inline">
          Search
        </span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,90vw)] max-w-full animate-fade-in-up rounded-sm border border-brutal-ink/15 bg-brutal-bg shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
          {/* Search Input */}
          <div className="border-b border-brutal-ink/15 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-brutal-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blog posts, projects..."
                className="w-full rounded-sm border border-brutal-ink/20 bg-brutal-bg py-2 pl-10 pr-10 text-brutal-ink transition-[box-shadow,border-color] duration-300 placeholder:text-brutal-muted focus:border-[orangered] focus:outline-none focus:ring-1 focus:ring-[orangered]/40"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-brutal-muted transition-colors hover:text-[orangered]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center font-sans text-brutal-muted">Searching…</div>
            )}

            {!isLoading && debouncedQuery && results && (
              <>
                {results.total === 0 ? (
                  <div className="p-4 text-center font-sans text-brutal-muted">
                    No results found for &quot;{debouncedQuery}&quot;
                  </div>
                ) : (
                  <>
                    {/* Blog Posts */}
                    {results.blog_posts.length > 0 && (
                      <div className="border-b border-brutal-ink/10 p-4">
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-brutal-muted">
                          Blog posts
                        </h3>
                        <div className="space-y-2">
                          {results.blog_posts.map((post) => (
                            <Link
                              key={post.id}
                              href={`/blog/${post.slug}`}
                              onClick={() => handleResultClick('blog', post.id, post.title)}
                              className="block rounded-sm p-2 transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] motion-reduce:hover:translate-y-0"
                            >
                              <div className="text-sm font-medium text-brutal-ink">
                                {post.title}
                              </div>
                              {post.category && (
                                <div className="mt-1 text-xs text-brutal-muted">
                                  {post.category.name}
                                </div>
                              )}
                              <div className="mt-1 line-clamp-1 text-xs text-brutal-muted">
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
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-brutal-muted">
                          Projects
                        </h3>
                        <div className="space-y-2">
                          {results.projects.map((project) => (
                            <Link
                              key={project.id}
                              href={`/portfolio/${project.slug}`}
                              prefetch={false}
                              onClick={() =>
                                handleResultClick('project', project.id, project.title)
                              }
                              className="block rounded-sm p-2 transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] motion-reduce:hover:translate-y-0"
                            >
                              <div className="text-sm font-medium text-brutal-ink">
                                {project.title}
                              </div>
                              {project.category && (
                                <div className="mt-1 text-xs text-brutal-muted">
                                  {project.category.name}
                                </div>
                              )}
                              <div className="mt-1 line-clamp-1 text-xs text-brutal-muted">
                                {project.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View All Results */}
                    {results.total > 5 && (
                      <div className="border-t border-brutal-ink/10 p-4">
                        <Link
                          href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                          onClick={() => setIsOpen(false)}
                          className="block text-center text-sm font-medium text-brutal-ink transition-colors hover:text-[orangered]"
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
              <div className="p-4 text-center font-sans text-brutal-muted">
                Start typing to search…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

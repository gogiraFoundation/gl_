'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostCard } from '@/components/blog/PostCard'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import api from '@/lib/api'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface SearchResult {
  query: string
  blog_posts: Array<{
    id: number
    title: string
    slug: string
    excerpt: string
    featured_image: string | null
    category: { id: number; name: string; slug: string } | null
    tags: Array<{ id: number; name: string; slug: string }>
    author_name: string
    published: boolean
    featured: boolean
    views: number
    created_at: string
    published_at: string | null
  }>
  projects: Array<{
    id: number
    title: string
    slug: string
    description: string
    featured_image: string | null
    github_url: string
    live_url: string
    category: { id: number; name: string; slug: string } | null
    technologies: Array<{ id: number; name: string; slug: string; icon: string }>
    featured: boolean
    created_at: string
  }>
  total: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)

  const { data: results, isLoading } = useQuery<SearchResult>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) {
        return { query: '', blog_posts: [], projects: [], total: 0 }
      }
      const response = await api.get('/search/', {
        params: { q: query },
      })
      return response.data
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (query) {
      document.title = `Search: ${query} | Emmanuel Ugbaije`
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-12">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">Search</h1>
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blog posts, projects..."
                  className="w-full rounded-lg border-2 border-gray-600 bg-gray-900 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-lg bg-gradient-primary px-6 py-2 font-semibold text-white transition-all hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          {isLoading && <div className="py-12 text-center text-gray-400">Searching...</div>}

          {!isLoading && query && results && (
            <>
              {results.total === 0 ? (
                <div className="py-12 text-center">
                  <p className="mb-2 text-xl text-gray-400">
                    No results found for &quot;{query}&quot;
                  </p>
                  <p className="text-gray-500">Try different keywords or check your spelling.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-gray-400">
                    Found {results.total} result{results.total !== 1 ? 's' : ''} for &quot;{query}
                    &quot;
                  </div>

                  {/* Blog Posts */}
                  {results.blog_posts.length > 0 && (
                    <section className="mb-12">
                      <h2 className="mb-6 text-2xl font-bold text-white">
                        Blog Posts ({results.blog_posts.length})
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.blog_posts.map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Projects */}
                  {results.projects.length > 0 && (
                    <section>
                      <h2 className="mb-6 text-2xl font-bold text-white">
                        Projects ({results.projects.length})
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.projects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {!query && (
            <div className="py-12 text-center">
              <p className="mb-4 text-xl text-gray-400">Enter a search query to find content</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="/blog"
                  className="rounded-lg bg-purple-500/20 px-4 py-2 text-purple-300 transition-colors hover:bg-purple-500/30"
                >
                  Browse Blog
                </Link>
                <Link
                  href="/portfolio"
                  className="rounded-lg bg-purple-500/20 px-4 py-2 text-purple-300 transition-colors hover:bg-purple-500/30"
                >
                  Browse Portfolio
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

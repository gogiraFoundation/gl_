'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostCard } from '@/components/blog/PostCard'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import api from '@/lib/api'
import { FetchError, describeQueryError } from '@/components/ui/FetchError'
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
  testimonials: Array<{
    id: number
    client_name: string
    client_role: string
    company: string
    content: string
    rating: number
  }>
  resume: {
    experience: Array<{ id: number; title: string; company: string }>
    skills: Array<{ id: number; name: string; category: string }>
  }
  total: number
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)

  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useQuery<SearchResult>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) {
        return {
          query: '',
          blog_posts: [],
          projects: [],
          testimonials: [],
          resume: { experience: [], skills: [] },
          total: 0,
        }
      }
      const response = await api.get('/search/', {
        params: { q: query },
      })
      return response.data
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  useEffect(() => {
    if (query) {
      document.title = `Search: ${query} | Emmanuel Ugbaje`
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-16 md:py-24 lg:px-8">
        <div className="mx-auto max-w-shell">
          <header className="mb-10 text-left">
            <h1 className="mb-6 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
              Search
            </h1>
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brutal-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts and projects…"
                  className="min-h-12 w-full border border-brutal-ink bg-brutal-bg py-3 pl-12 pr-28 text-brutal-ink placeholder:text-brutal-muted focus:border-[orangered] focus:outline-none focus:ring-1 focus:ring-[orangered]/40"
                  aria-label="Search query"
                />
                <button
                  type="submit"
                  className="btn-brutal btn-brutal-sm absolute right-2 top-1/2 -translate-y-1/2"
                >
                  Search
                </button>
              </div>
            </form>
          </header>

          {isLoading && <p className="py-12 text-left text-brutal-muted">Searching…</p>}

          {!isLoading && error && (
            <FetchError
              title="Search failed"
              message={describeQueryError(error)}
              onRetry={() => {
                void refetch()
              }}
            />
          )}

          {!isLoading && !error && query && results && (
            <>
              {results.total === 0 ? (
                <div className="py-12 text-left">
                  <p className="mb-2 text-xl text-brutal-ink">No results for &quot;{query}&quot;</p>
                  <p className="text-brutal-muted">Try different keywords, or browse instead.</p>
                </div>
              ) : (
                <>
                  <p className="mb-8 text-left text-brutal-muted">
                    {results.total} result{results.total !== 1 ? 's' : ''} for &quot;{query}&quot;
                  </p>

                  {results.blog_posts.length > 0 && (
                    <section className="mb-12" aria-labelledby="search-posts">
                      <h2
                        id="search-posts"
                        className="mb-6 font-serif text-2xl font-semibold text-brutal-ink"
                      >
                        Blog ({results.blog_posts.length})
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.blog_posts.map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                      </div>
                    </section>
                  )}

                  {results.projects.length > 0 && (
                    <section className="mb-12" aria-labelledby="search-projects">
                      <h2
                        id="search-projects"
                        className="mb-6 font-serif text-2xl font-semibold text-brutal-ink"
                      >
                        Portfolio ({results.projects.length})
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.projects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    </section>
                  )}

                  {(results.testimonials?.length || 0) > 0 && (
                    <section className="mb-12" aria-labelledby="search-testimonials">
                      <h2
                        id="search-testimonials"
                        className="mb-6 font-serif text-2xl font-semibold text-brutal-ink"
                      >
                        Testimonials ({results.testimonials.length})
                      </h2>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {results.testimonials.map((item) => (
                          <div
                            key={item.id}
                            className="border border-brutal-ink/15 bg-brutal-bg p-4 text-left text-brutal-ink"
                          >
                            <p className="mb-2 text-sm leading-relaxed text-brutal-muted">
                              &ldquo;{item.content}&rdquo;
                            </p>
                            <p className="text-sm font-semibold">
                              {item.client_name}
                              {item.client_role ? ` · ${item.client_role}` : ''}
                              {item.company ? ` · ${item.company}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {((results.resume?.experience?.length || 0) > 0 ||
                    (results.resume?.skills?.length || 0) > 0) && (
                    <section className="mb-12" aria-labelledby="search-resume">
                      <h2
                        id="search-resume"
                        className="mb-6 font-serif text-2xl font-semibold text-brutal-ink"
                      >
                        Resume
                      </h2>
                      <div className="space-y-4 text-left text-brutal-ink">
                        {results.resume.experience.map((exp) => (
                          <div key={exp.id} className="border border-brutal-ink/15 p-4">
                            <p className="font-semibold">{exp.title}</p>
                            <p className="text-sm text-brutal-muted">{exp.company}</p>
                          </div>
                        ))}
                        {results.resume.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {results.resume.skills.map((skill) => (
                              <span
                                key={skill.id}
                                className="border border-brutal-ink/20 px-3 py-1 text-sm text-brutal-ink"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {!query && (
            <div className="py-12 text-left">
              <p className="mb-4 text-xl text-brutal-muted">
                Enter a query to search posts and projects.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/blog"
                  className="inline-flex min-h-11 items-center border border-brutal-ink px-4 py-2 font-semibold text-brutal-ink transition-opacity hover:opacity-70"
                >
                  Browse blog
                </Link>
                <Link href="/portfolio" className="btn-brutal btn-brutal-sm">
                  Browse portfolio
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
          <Header />
          <main className="flex-grow px-6 py-16 lg:px-8">
            <p className="mx-auto max-w-shell text-left text-brutal-muted">Loading search…</p>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}

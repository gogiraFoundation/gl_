'use client'

import { useQuery } from '@tanstack/react-query'
import { FetchError, describeQueryError } from '@/components/ui/FetchError'
import { useState } from 'react'
import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { ProjectGrid } from '@/components/portfolio/ProjectGrid'
import { ProjectFilters } from '@/components/portfolio/ProjectFilters'
import Link from 'next/link'
import api from '@/lib/api'
import { PORTFOLIO_PUBLIC_HOLD_SLUGS } from '@/lib/essays'

interface Project {
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
}

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

export default function PortfolioClient() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTechnology, setSelectedTechnology] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: projects,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ['projects', selectedCategory, selectedTechnology, searchQuery],
    queryFn: async () => {
      try {
        const params: Record<string, number | string> = {}
        if (selectedCategory) params.category = selectedCategory
        if (selectedTechnology) params.technologies = selectedTechnology
        if (searchQuery) params.search = searchQuery

        const response = await api.get('/portfolio/projects/', { params })

        const projectsData = response.data.results || response.data

        if (!Array.isArray(projectsData)) {
          return []
        }

        return (projectsData as Project[]).filter((p) => !PORTFOLIO_PUBLIC_HOLD_SLUGS.has(p.slug))
      } catch (err) {
        throw err
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
  const typedProjects = (projects ?? []) as Project[]

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/portfolio/categories/')
      return response.data.results || response.data
    },
  })

  const { data: technologies } = useQuery<Technology[]>({
    queryKey: ['technologies'],
    queryFn: async () => {
      const response = await api.get('/portfolio/technologies/')
      return response.data.results || response.data
    },
  })

  return (
    <EssayDesignScope>
      <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-essay-bg focus:px-3 focus:py-2 focus:text-essay-accent"
        >
          Skip to content
        </a>
        <EssayNav active="portfolio" />
        <main id="main-content" className="flex-grow px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-shell">
            <header className="mx-auto max-w-prose text-center">
              <p className="font-essay-mono text-xs text-essay-muted" aria-hidden="true">
                // portfolio
              </p>
              <h1 className="mt-3 font-essay-display text-4xl font-semibold tracking-tight md:text-5xl">
                Portfolio
              </h1>
              <p className="mt-4 text-justify font-essay-sans text-base leading-relaxed text-essay-muted md:text-lg">
                These cards are about problems I had to solve, the decisions I made, and the
                evidence I can show, including what is still unfinished. UrbanSpick, Afri Cleans,
                TraqHq and traq_frontend are not live products. Traq Authenticator was built under a
                security-review constraint; I have not published a passed-review artefact here. The
                write-ups are in the{' '}
                <Link href="/blog" className="text-essay-accent underline underline-offset-4">
                  essays
                </Link>
                .
              </p>
            </header>

            <div className="mx-auto mt-10 max-w-3xl">
              <ProjectFilters
                categories={categories || []}
                technologies={technologies || []}
                selectedCategory={selectedCategory}
                selectedTechnology={selectedTechnology}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onTechnologyChange={setSelectedTechnology}
                onSearchChange={setSearchQuery}
              />
            </div>

            {(isLoading || isFetching) && !typedProjects.length ? (
              <p className="mt-12 text-center font-essay-sans text-essay-muted">
                Loading projects…
              </p>
            ) : error ? (
              <div className="mx-auto mt-10 max-w-prose">
                <FetchError
                  title="Could not load projects"
                  message={describeQueryError(error)}
                  onRetry={() => {
                    void refetch()
                  }}
                />
              </div>
            ) : (
              <ProjectGrid
                projects={typedProjects}
                hasActiveFilters={
                  selectedCategory !== null ||
                  selectedTechnology !== null ||
                  searchQuery.trim().length > 0
                }
                onClearFilters={() => {
                  setSelectedCategory(null)
                  setSelectedTechnology(null)
                  setSearchQuery('')
                }}
              />
            )}

            <div className="mx-auto mt-20 max-w-prose border-t border-essay-ink/10 pt-10 text-center md:mt-24">
              <p className="text-justify font-essay-sans text-base leading-relaxed text-essay-ink">
                Planning a backend, API, or platform build?{' '}
                <Link
                  href="/contact"
                  className="font-medium text-essay-accent underline underline-offset-4 transition-colors duration-essay-fast ease-essay hover:opacity-90"
                >
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </main>
        <EssayFooter />
      </div>
    </EssayDesignScope>
  )
}

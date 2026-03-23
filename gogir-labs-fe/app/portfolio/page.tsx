'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectGrid } from '@/components/portfolio/ProjectGrid'
import { ProjectFilters } from '@/components/portfolio/ProjectFilters'
import Link from 'next/link'
import api from '@/lib/api'

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

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTechnology, setSelectedTechnology] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Update document title and meta description for SEO
  useEffect(() => {
    document.title = 'Portfolio | Emmanuel Ugbaje — Software Engineering & Cloud Projects'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Explore projects by Emmanuel Ugbaje: Python, Django, cloud infrastructure, CI/CD, data platforms, and scalable backends.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = descriptionContent
      document.getElementsByTagName('head')[0].appendChild(meta)
    }
  }, [])

  const {
    data: projects,
    isLoading,
    error,
    isFetching,
  } = useQuery<Project[]>({
    queryKey: ['projects', selectedCategory, selectedTechnology, searchQuery],
    queryFn: async () => {
      try {
        const params: any = {}
        if (selectedCategory) params.category = selectedCategory
        if (selectedTechnology) params.technologies = selectedTechnology
        if (searchQuery) params.search = searchQuery

        const response = await api.get('/portfolio/projects/', { params })

        // Handle paginated response
        const projectsData = response.data.results || response.data

        // Ensure we return an array
        if (!Array.isArray(projectsData)) {
          console.warn('Projects data is not an array:', projectsData)
          return []
        }

        return projectsData
      } catch (err: any) {
        console.error('Error fetching projects:', err)
        console.error('Error response:', err.response?.data)
        throw err
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-20 sm:px-6">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.18),transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-14 animate-fade-in-up text-center md:mb-16">
            <h1 className="mb-5 text-5xl font-bold tracking-tight md:mb-6 md:text-6xl">
              <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-gray-400 md:text-xl">
              Real‑world projects demonstrating expertise in cloud infrastructure, Infrastructure as
              Code (Terraform, Kubernetes), CI/CD automation, and scalable platform design.
            </p>
          </div>

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

          {(isLoading || isFetching) && !typedProjects.length ? (
            <div className="py-12 text-center text-slate-500 dark:text-gray-400">
              Loading projects...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 dark:text-red-400">
              <p className="mb-2">Error loading projects</p>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          ) : (
            <ProjectGrid projects={typedProjects} />
          )}

          {typedProjects.length > 0 && (
            <div className="mt-20 rounded-2xl border border-[var(--cta-border)] bg-[var(--cta-surface)] p-6 text-center shadow-lg shadow-slate-950/5 backdrop-blur-sm md:mt-24 md:p-8 dark:shadow-black/10">
              <p className="text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                Interested in a custom solution or want to discuss a project?{' '}
                <Link
                  href="/contact"
                  className="font-medium text-[var(--accent-primary)] underline decoration-[var(--accent-primary)]/40 underline-offset-4 transition-colors duration-200 hover:opacity-90 dark:text-purple-400 dark:decoration-purple-400/40 dark:hover:text-purple-300"
                >
                  Get in touch
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

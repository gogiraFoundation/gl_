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
      'Real-world projects demonstrating expertise in cloud infrastructure, infrastructure as code, CI/CD automation, and scalable platform design.'
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
          return []
        }

        return projectsData
      } catch (err: any) {
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
    <div className="animate-page-fade flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="relative flex-grow border-b border-brutal-ink/10 py-20">
        <div className="container-content relative z-10">
          <div className="mb-14 text-left md:mb-16">
            <h1 className="mb-5 font-serif text-5xl font-semibold tracking-tight text-brutal-ink md:mb-6 md:text-6xl">
              Portfolio
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-brutal-muted md:text-xl">
              Real-world projects demonstrating expertise in cloud infrastructure, infrastructure as
              code, CI/CD automation, and scalable platform design.
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
            <div className="py-12 text-center font-sans text-brutal-muted">Loading projects…</div>
          ) : error ? (
            <div className="py-12 text-center text-red-700">
              <p className="mb-2 font-medium">Error loading projects</p>
              <p className="text-sm text-brutal-muted">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          ) : (
            <ProjectGrid projects={typedProjects} />
          )}

          <div className="mx-auto mt-20 w-full max-w-3xl bg-brutal-bg p-6 text-center opacity-0 transition-all duration-500 ease-out [animation:fadeIn_0.55s_ease-out_forwards] md:mt-24 md:w-[40%] md:p-8">
            <p className="text-center text-base leading-relaxed text-brutal-ink md:text-lg">
              Interested in a custom solution or planning your next platform build?{' '}
              <Link
                href="/contact"
                className="font-medium text-brutal-ink underline underline-offset-4 transition-all duration-300 ease-out hover:opacity-70"
              >
                Get in touch
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

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
    document.title = 'Portfolio | Emmanuel Ugbaije - Infrastructure & DevOps Projects'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent = 'Explore the portfolio of Infrastructure & DevOps Engineer Emmanuel Ugbaije. See real-world projects using Terraform, Kubernetes, CI/CD, AWS, Azure, and scalable cloud platforms.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = descriptionContent
      document.getElementsByTagName('head')[0].appendChild(meta)
    }
  }, [])

  const { data: projects, isLoading, error, isFetching } = useQuery<Project[]>({
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
    keepPreviousData: true,
  })

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 px-4 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real‑world projects demonstrating expertise in cloud infrastructure, Infrastructure as Code (Terraform, Kubernetes), CI/CD automation, and scalable platform design.
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
          
          {(isLoading || isFetching) && !projects ? (
            <div className="text-center py-12 text-gray-400">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
              <p className="mb-2">Error loading projects</p>
              <p className="text-sm text-gray-400">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          ) : (
            <ProjectGrid projects={projects || []} />
          )}

          {/* Optional CTA */}
          {projects && projects.length > 0 && (
            <div className="mt-16 text-center">
              <p className="text-gray-300">
                Interested in a custom solution or want to discuss a project? <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline">Get in touch</Link>.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
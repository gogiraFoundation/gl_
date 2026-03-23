'use client'

export const runtime = 'edge'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectContent } from '@/components/portfolio/ProjectContent'
import api from '@/lib/api'
import { useEffect } from 'react'

interface Project {
  id: number
  title: string
  slug: string
  description: string
  long_description: string
  featured_image: string | null
  video: string | null
  video_url: string | null
  github_url: string
  live_url: string
  category: { id: number; name: string; slug: string } | null
  technologies: Array<{ id: number; name: string; slug: string; icon: string }>
  images: Array<{ id: number; image: string; caption: string; order: number }>
  featured: boolean
  created_at: string
  updated_at: string
}

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string

  const {
    data: project,
    isLoading,
    error,
  } = useQuery<Project>({
    queryKey: ['project', slug],
    queryFn: async () => {
      try {
        const response = await api.get('/portfolio/projects/by-slug/', {
          params: { slug },
        })
        return response.data
      } catch (err: any) {
        console.error('Error fetching project:', err)
        throw err
      }
    },
    enabled: !!slug,
    retry: 1,
  })

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | Portfolio - Emmanuel Ugbaje`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', project.description)
      }
    }
  }, [project])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">Loading project...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-2xl font-bold">Project not found</h1>
            <p className="text-gray-600 dark:text-gray-400">
              The project you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-12">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <ProjectContent project={project} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

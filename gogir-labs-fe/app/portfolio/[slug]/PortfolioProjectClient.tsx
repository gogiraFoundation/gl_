'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectContent } from '@/components/portfolio/ProjectContent'
import { FetchError, describeQueryError } from '@/components/ui/FetchError'
import api from '@/lib/api'
import axios from 'axios'
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
  role?: string
  year?: number | null
  client?: string
  outcomes?: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export default function PortfolioProjectClient() {
  const params = useParams()
  const slug = params.slug as string

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useQuery<Project>({
    queryKey: ['project', slug],
    queryFn: async () => {
      try {
        const response = await api.get('/portfolio/projects/by-slug/', {
          params: { slug },
        })
        return response.data
      } catch (err: unknown) {
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
      <div className="flex min-h-screen flex-col bg-brutal-bg">
        <Header />
        <main className="flex-grow px-4 py-12">
          <div className="mx-auto max-w-4xl text-left font-sans text-brutal-muted">
            Loading project…
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !project) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined
    const missing = status === 404
    return (
      <div className="flex min-h-screen flex-col bg-brutal-bg">
        <Header />
        <main className="flex-grow px-4 py-12">
          <div className="mx-auto max-w-4xl text-left">
            {missing ? (
              <>
                <h1 className="mb-4 font-serif text-2xl font-semibold text-brutal-ink">
                  Project not found
                </h1>
                <p className="text-brutal-muted">
                  That project doesn&apos;t exist or was removed. Browse the{' '}
                  <Link
                    href="/portfolio"
                    className="font-medium text-brutal-ink underline underline-offset-4 hover:opacity-75"
                  >
                    portfolio
                  </Link>{' '}
                  for other work.
                </p>
              </>
            ) : (
              <FetchError
                title="Couldn't load this project"
                message={describeQueryError(error)}
                onRetry={() => {
                  void refetch()
                }}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="relative flex-grow px-4 py-12">
        <div className="relative z-10 mx-auto max-w-4xl">
          <ProjectContent project={project} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { FetchError, describeQueryError } from '@/components/ui/FetchError'
import Link from 'next/link'
import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { ProjectContent } from '@/components/portfolio/ProjectContent'
import api from '@/lib/api'
import { PORTFOLIO_PUBLIC_HOLD_SLUGS } from '@/lib/essays'

export interface Project {
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

interface PortfolioProjectClientProps {
  slug: string
  initialProject?: Project | null
}

function Shell({ children }: { children: React.ReactNode }) {
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
          {children}
        </main>
        <EssayFooter />
      </div>
    </EssayDesignScope>
  )
}

export default function PortfolioProjectClient({
  slug,
  initialProject,
}: PortfolioProjectClientProps) {
  const onHold = PORTFOLIO_PUBLIC_HOLD_SLUGS.has(slug)

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useQuery<Project>({
    queryKey: ['project', slug],
    initialData: initialProject ?? undefined,
    queryFn: async () => {
      const response = await api.get('/portfolio/projects/by-slug/', {
        params: { slug },
      })
      return response.data
    },
    enabled: !!slug && !onHold,
    retry: 1,
  })

  if (onHold) {
    return (
      <Shell>
        <div className="mx-auto max-w-prose text-left">
          <h1 className="mb-4 font-essay-display text-2xl font-semibold text-essay-ink">
            Project not found
          </h1>
          <p className="font-essay-sans text-essay-muted">
            Browse the{' '}
            <Link
              href="/portfolio"
              className="font-medium text-essay-accent underline underline-offset-4"
            >
              portfolio
            </Link>
            .
          </p>
        </div>
      </Shell>
    )
  }

  if (isLoading) {
    return (
      <Shell>
        <div className="mx-auto max-w-prose text-left font-essay-sans text-essay-muted">
          Loading project…
        </div>
      </Shell>
    )
  }

  if (error && !project) {
    return (
      <Shell>
        <div className="mx-auto max-w-prose">
          <FetchError
            title="Could not load project"
            message={describeQueryError(error)}
            onRetry={() => {
              void refetch()
            }}
          />
        </div>
      </Shell>
    )
  }

  if (!project) {
    return (
      <Shell>
        <div className="mx-auto max-w-prose text-left">
          <h1 className="mb-4 font-essay-display text-2xl font-semibold text-essay-ink">
            Project not found
          </h1>
          <p className="font-essay-sans text-essay-muted">
            That project does not exist or was removed. Browse the{' '}
            <Link
              href="/portfolio"
              className="font-medium text-essay-accent underline underline-offset-4 transition-colors duration-essay-fast ease-essay hover:opacity-90"
            >
              portfolio
            </Link>{' '}
            for other work.
          </p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="mx-auto max-w-prose">
        <ProjectContent project={project} />
      </div>
    </Shell>
  )
}

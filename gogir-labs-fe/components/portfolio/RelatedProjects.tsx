'use client'

import { useQuery } from '@tanstack/react-query'
import { ProjectCard } from './ProjectCard'
import api from '@/lib/api'
import { PORTFOLIO_PUBLIC_HOLD_SLUGS } from '@/lib/essays'

interface RelatedProjectsProps {
  projectId: number
}

export function RelatedProjects({ projectId }: RelatedProjectsProps) {
  const { data: relatedProjects = [], isLoading } = useQuery({
    queryKey: ['related-projects', projectId],
    queryFn: async () => {
      const response = await api.get(`/portfolio/projects/${projectId}/related/`)
      return response.data
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  })

  const visible = Array.isArray(relatedProjects)
    ? relatedProjects.filter(
        (project: { slug?: string }) =>
          project.slug && !PORTFOLIO_PUBLIC_HOLD_SLUGS.has(project.slug)
      )
    : []

  if (isLoading || visible.length === 0) {
    return null
  }

  return (
    <section className="mt-12 border-t border-essay-ink/10 pt-8">
      <h2 className="mb-6 text-center font-essay-display text-2xl font-semibold text-essay-ink">
        Related projects
      </h2>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(
          (project: {
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
          }) => (
            <li key={project.id} className="min-w-0">
              <ProjectCard project={project} />
            </li>
          )
        )}
      </ul>
    </section>
  )
}

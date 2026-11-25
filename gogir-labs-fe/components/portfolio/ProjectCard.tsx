'use client'

import Link from 'next/link'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { PORTFOLIO_ESSAY_BY_PROJECT } from '@/lib/essays'
import { getPortfolioCardCopy } from '@/lib/portfolioCopy'

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
  role?: string
  year?: number | null
  client?: string
  featured: boolean
  created_at: string
}

interface ProjectCardProps {
  project: Project
  linkPrefetch?: boolean
}

function resolveCategoryLine(project: Project): string | undefined {
  if (project.category?.name) {
    return project.category.name
  }
  const editorial = getPortfolioCardCopy(project.slug)
  const label = editorial?.categoryLabel?.trim()
  return label || undefined
}

export function ProjectCard({ project, linkPrefetch = false }: ProjectCardProps) {
  const { trackClick } = useAnalyticsEvent()
  const editorial = getPortfolioCardCopy(project.slug)
  const description = editorial?.description ?? project.description
  const categoryLine = resolveCategoryLine(project)
  const meta = [project.role, project.year, project.client].filter(Boolean).join(' · ')
  const techLine = project.technologies
    .map((t) => t.name)
    .slice(0, 6)
    .join(' · ')
  const essaySlug = PORTFOLIO_ESSAY_BY_PROJECT[project.slug]

  return (
    <article className="flex h-full flex-col border border-essay-accent/35 bg-essay-bg p-5 shadow-[4px_4px_0_0_rgba(13,92,86,0.28)]">
      <Link
        href={`/portfolio/${project.slug}`}
        prefetch={linkPrefetch}
        onClick={() =>
          trackClick('project_view', {
            projectId: project.id,
            projectTitle: project.title,
            category: project.category?.name,
          })
        }
        className="group flex min-h-0 flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-essay-accent"
      >
        {categoryLine ? (
          <p className="text-center font-essay-mono text-xs uppercase tracking-wider text-essay-muted">
            {categoryLine}
          </p>
        ) : null}
        <h3 className="mt-2 text-center font-essay-display text-xl font-semibold text-essay-ink transition-colors duration-essay-fast ease-essay group-hover:text-essay-accent md:text-2xl">
          {project.title}
        </h3>
        {meta ? (
          <p className="mt-2 text-center font-essay-sans text-xs text-essay-muted">{meta}</p>
        ) : null}
        {description ? (
          <p className="mt-3 flex-1 text-justify font-essay-sans text-sm leading-relaxed text-essay-muted">
            {description}
          </p>
        ) : null}
        {techLine ? (
          <p className="mt-4 text-center font-essay-mono text-xs text-essay-muted">{techLine}</p>
        ) : null}
      </Link>
      {essaySlug ? (
        <p className="mt-4 text-center">
          <Link
            href={`/blog/${essaySlug}`}
            className="inline-flex min-h-[44px] items-center font-essay-sans text-sm text-essay-accent underline underline-offset-4 transition-opacity duration-essay-fast ease-essay hover:opacity-90"
          >
            Read the essay
          </Link>
        </p>
      ) : null}
    </article>
  )
}

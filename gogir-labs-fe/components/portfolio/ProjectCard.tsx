'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { cn } from '@/lib/utils'
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
  const animationDelay = `${(project.id % 6) * 70}ms`
  const editorial = getPortfolioCardCopy(project.slug)
  const description = editorial?.description ?? project.description
  const categoryLine = resolveCategoryLine(project)
  const hasImage = Boolean(project.featured_image)

  return (
    <article
      className="project-card-brutal group flex h-full flex-col border border-brutal-ink/10 bg-brutal-bg/55 p-2 opacity-100 transition-transform duration-300 ease-out [animation:fadeIn_0.55s_ease-out_forwards] hover:-translate-y-0.5 hover:border-brutal-ink/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{ animationDelay }}
    >
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
        className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brutal-ink"
      >
        <div className="bg-brutal-ink/05 relative aspect-[16/9] w-full overflow-hidden">
          {hasImage ? (
            <Image
              src={project.featured_image as string}
              alt={`${project.title} preview`}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
              loading="lazy"
            />
          ) : (
            <div
              aria-hidden
              data-testid="project-card-placeholder"
              className="flex h-full w-full items-end bg-brutal-ink/[0.04] px-4 pb-4"
            >
              <span className="line-clamp-3 text-left font-serif text-sm font-medium leading-snug text-brutal-muted/70 md:text-base">
                {project.title}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col pt-4 text-left">
          {categoryLine && (
            <span className="text-meta mb-2 block font-sans text-[10px] font-normal uppercase tracking-[0.1em] text-brutal-muted/80">
              {categoryLine}
            </span>
          )}
          <h3
            className={cn(
              'font-sans text-base font-semibold leading-tight text-brutal-ink transition-[border-color] duration-300 md:text-lg',
              'border-b-2 border-transparent pb-1 group-hover:border-brutal-ink'
            )}
          >
            {project.title}
          </h3>
          {(project.role || project.year || project.client) && (
            <p className="mt-2 font-sans text-xs text-brutal-muted">
              {[project.role, project.year, project.client].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="text-meta mt-2 line-clamp-5 flex-1 font-sans leading-relaxed text-brutal-muted">
            {description}
          </p>
          <span className="mt-4 inline-flex w-full items-center justify-start gap-2 font-sans text-sm font-semibold text-brutal-ink transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0">
            View case study
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  )
}

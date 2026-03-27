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
  featured: boolean
  created_at: string
}

interface ProjectCardProps {
  project: Project
  linkPrefetch?: boolean
}

function projectImageSrc(project: Project): string {
  if (project.featured_image) return project.featured_image
  return `https://picsum.photos/seed/gogir-${project.id}/800/500`
}

export function ProjectCard({ project, linkPrefetch = false }: ProjectCardProps) {
  const { trackClick } = useAnalyticsEvent()
  const src = projectImageSrc(project)
  const animationDelay = `${(project.id % 6) * 70}ms`
  const editorial = getPortfolioCardCopy(project.slug)
  const description = editorial?.description ?? project.description
  const categoryLine = editorial ? `Category: ${editorial.categoryLabel}` : project.category?.name

  return (
    <article
      className="project-card-brutal group flex h-full flex-col border border-brutal-ink/10 bg-brutal-bg/55 p-2 opacity-0 transition-all duration-500 ease-out [animation:fadeIn_0.55s_ease-out_forwards] hover:-translate-y-0.5 hover:border-brutal-ink/20 hover:shadow-[0_8px_18px_rgba(0,0,0,0.06)]"
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
          <Image
            src={src}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col pt-4">
          {categoryLine && (
            <span className="text-meta mb-2 block text-center font-sans text-[10px] font-normal uppercase tracking-[0.1em] text-brutal-muted/80">
              {categoryLine}
            </span>
          )}
          <h3
            className={cn(
              'text-center font-sans text-base font-semibold leading-tight text-brutal-ink transition-[border-color] duration-300 md:text-lg',
              'border-b-2 border-transparent pb-1 group-hover:border-brutal-ink'
            )}
          >
            {project.title}
          </h3>
          <p className="text-meta mx-auto mt-2 line-clamp-5 flex-1 text-center font-sans leading-relaxed text-brutal-muted">
            {description}
          </p>
          <span className="mt-4 inline-flex w-full items-center justify-center gap-2 text-center font-sans text-sm font-semibold text-brutal-ink transition-all duration-500 ease-out group-hover:translate-x-0.5 group-hover:opacity-75">
            View Case Study
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  )
}

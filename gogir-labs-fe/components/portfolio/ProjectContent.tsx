'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ExternalLink, Github, Code, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { RelatedProjects } from './RelatedProjects'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

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

interface ProjectContentProps {
  project: Project
}

const linkBtnClass =
  'inline-flex min-h-[44px] items-center gap-2 border border-essay-ink/25 px-4 font-essay-sans text-sm font-medium text-essay-ink transition-colors duration-essay-fast ease-essay hover:border-essay-accent hover:text-essay-accent'

const primaryBtnClass =
  'essay-btn-primary inline-flex min-h-[44px] items-center gap-2 bg-essay-accent px-4 font-essay-sans text-sm font-medium text-white transition-opacity duration-essay-fast ease-essay hover:opacity-90'

export function ProjectContent({ project }: ProjectContentProps) {
  const { trackClick } = useAnalyticsEvent()

  return (
    <article>
      <Breadcrumbs
        items={[
          { label: 'Portfolio', href: '/portfolio' },
          { label: project.title, href: `/portfolio/${project.slug}` },
        ]}
      />

      <header className="mb-8">
        {project.category && (
          <p className="mb-3 font-essay-mono text-xs uppercase tracking-wider text-essay-muted">
            {project.category.name}
          </p>
        )}
        <h1 className="mb-4 font-essay-display text-4xl font-semibold tracking-tight text-essay-ink md:text-5xl">
          {project.title}
        </h1>
        <p className="mb-6 text-justify font-essay-sans text-lg leading-relaxed text-essay-muted md:text-xl">
          {project.description}
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-4 font-essay-sans text-sm text-essay-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden />
            <span>{project.year ?? formatDate(project.created_at)}</span>
          </div>
          {project.role && <span>{project.role}</span>}
          {project.client && <span>Client: {project.client}</span>}
          {project.technologies.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" aria-hidden />
              <span>
                {project.technologies.length} technolog
                {project.technologies.length !== 1 ? 'ies' : 'y'}
              </span>
            </div>
          )}
        </div>

        {Array.isArray(project.outcomes) && project.outcomes.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-essay-display text-xl font-semibold text-essay-ink">
              Outcomes
            </h2>
            <ul className="list-inside list-disc space-y-2 font-essay-sans text-essay-muted">
              {project.outcomes.map((outcome, index) => (
                <li key={`${project.id}-outcome-${index}`}>{outcome}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackClick('project_github', { projectId: project.id, projectTitle: project.title })
              }
              className={primaryBtnClass}
            >
              <Github className="h-5 w-5" aria-hidden />
              View on GitHub
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackClick('project_live', { projectId: project.id, projectTitle: project.title })
              }
              className={linkBtnClass}
            >
              <ExternalLink className="h-5 w-5" aria-hidden />
              Live demo
            </a>
          )}
        </div>
      </header>

      {project.featured_image && (
        <div className="relative mb-8 h-64 w-full overflow-hidden md:h-96">
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
          />
        </div>
      )}

      {project.video_url && (
        <div className="mb-8">
          <div className="relative aspect-video w-full overflow-hidden bg-essay-ink/10">
            <iframe
              src={project.video_url}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={project.title}
            />
          </div>
        </div>
      )}

      {project.long_description && (
        <section className="mb-8">
          <h2 className="mb-4 font-essay-display text-2xl font-semibold text-essay-ink">
            About this project
          </h2>
          <div
            className="max-w-none text-justify font-essay-sans leading-relaxed text-essay-ink"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {project.long_description}
          </div>
        </section>
      )}

      {project.technologies.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 font-essay-display text-2xl font-semibold text-essay-ink">
            <Code className="h-6 w-6" aria-hidden />
            Technologies used
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech.id}
                className="border border-essay-ink/20 px-3 py-1.5 font-essay-mono text-xs text-essay-ink"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {project.images && project.images.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 font-essay-display text-2xl font-semibold text-essay-ink">
            Project gallery
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {project.images
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div key={image.id} className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={image.image}
                    alt={image.caption || project.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-essay-ink/80 p-2 font-essay-sans text-sm text-essay-bg">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}

      <RelatedProjects projectId={project.id} />

      <div className="mt-12 border-t border-essay-ink/10 pt-8">
        <Link
          href="/portfolio"
          onClick={() => trackClick('portfolio_back', { fromProject: project.title })}
          className="inline-flex min-h-[44px] items-center font-essay-sans text-essay-ink transition-colors duration-essay-fast ease-essay hover:text-essay-accent"
        >
          ← Back to portfolio
        </Link>
      </div>
    </article>
  )
}

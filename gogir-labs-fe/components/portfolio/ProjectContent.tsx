'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ExternalLink, Github, Code, Tag } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
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
  featured: boolean
  created_at: string
  updated_at: string
}

interface ProjectContentProps {
  project: Project
}

export function ProjectContent({ project }: ProjectContentProps) {
  const { trackClick } = useAnalyticsEvent()

  return (
    <article className="py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Portfolio', href: '/portfolio' },
          { label: project.title, href: `/portfolio/${project.slug}` },
        ]}
      />

      {/* Header Section */}
      <div className="mb-8">
        {project.category && (
          <span className="text-meta mb-4 inline-block font-sans font-semibold uppercase tracking-wider">
            {project.category.name}
          </span>
        )}
        <h1 className="mb-4 font-serif text-4xl font-semibold text-brutal-ink md:text-5xl">
          {project.title}
        </h1>
        <p className="mb-6 text-xl leading-relaxed text-brutal-ink">{project.description}</p>

        {/* Meta Information */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-brutal-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.created_at)}</span>
          </div>
          {project.technologies.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>
                {project.technologies.length} Technology
                {project.technologies.length !== 1 ? 'ies' : 'y'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackClick('project_github', { projectId: project.id, projectTitle: project.title })
              }
              className="flex items-center gap-2 border border-brutal-ink bg-transparent px-6 py-3 font-semibold text-brutal-ink transition-opacity hover:opacity-70"
            >
              <Github className="h-5 w-5" />
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
              className="flex items-center gap-2 border border-brutal-ink bg-brutal-ink px-6 py-3 font-semibold text-brutal-bg transition-opacity hover:opacity-90"
            >
              <ExternalLink className="h-5 w-5" />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {project.featured_image && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
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

      {/* Video */}
      {project.video_url && (
        <div className="mb-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
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

      {/* Long Description */}
      {project.long_description && (
        <div className="mb-8">
          <GlowCard className="p-6 md:p-8">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-brutal-ink">About this project</h2>
            <div
              className="project-description max-w-none leading-relaxed text-brutal-ink"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {project.long_description}
            </div>
          </GlowCard>
        </div>
      )}

      {/* Technologies */}
      {project.technologies.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl font-semibold text-brutal-ink">
            <Code className="h-6 w-6 text-brutal-ink" />
            Technologies used
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech.id}
                className="border border-brutal-ink/20 px-4 py-2 font-medium text-brutal-ink"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project Images Gallery */}
      {project.images && project.images.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-brutal-ink">Project gallery</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {project.images
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div key={image.id} className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.image}
                    alt={image.caption || project.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-sm text-white">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Related Projects */}
      <RelatedProjects projectId={project.id} />

      {/* Back to Portfolio */}
      <div className="mt-12 border-t border-brutal-ink/15 pt-8">
        <Link
          href="/portfolio"
          onClick={() => trackClick('portfolio_back', { fromProject: project.title })}
          className="inline-flex items-center gap-2 text-brutal-ink transition-opacity hover:opacity-70"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </article>
  )
}

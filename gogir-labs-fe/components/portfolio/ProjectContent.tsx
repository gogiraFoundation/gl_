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
          <span className="mb-4 inline-block rounded-lg bg-purple-500/20 px-3 py-1 text-sm font-semibold text-purple-400">
            {project.category.name}
          </span>
        )}
        <h1 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">{project.title}</h1>
        <p className="mb-6 text-xl leading-relaxed text-gray-300">{project.description}</p>

        {/* Meta Information */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
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
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-gray-700"
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
              className="flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
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
            <h2 className="mb-4 text-2xl font-bold text-white">About This Project</h2>
            <div
              className="project-description max-w-none leading-relaxed text-gray-300"
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
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
            <Code className="h-6 w-6 text-purple-400" />
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech.id}
                className="rounded-lg border border-purple-500/30 bg-purple-500/20 px-4 py-2 font-medium text-purple-300"
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
          <h2 className="mb-4 text-2xl font-bold text-white">Project Gallery</h2>
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
      <div className="mt-12 border-t border-gray-700 pt-8">
        <Link
          href="/portfolio"
          onClick={() => trackClick('portfolio_back', { fromProject: project.title })}
          className="inline-flex items-center gap-2 text-purple-400 transition-colors hover:text-purple-300"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </article>
  )
}

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
          <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-400 bg-purple-500/20 rounded-lg mb-4">
            {project.category.name}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          {project.title}
        </h1>
        <p className="text-xl text-gray-300 mb-6 leading-relaxed">
          {project.description}
        </p>
        
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(project.created_at)}</span>
          </div>
          {project.technologies.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{project.technologies.length} Technology{project.technologies.length !== 1 ? 'ies' : 'y'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('project_github', { projectId: project.id, projectTitle: project.title })}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('project_live', { projectId: project.id, projectTitle: project.title })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
            >
              <ExternalLink className="w-5 h-5" />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {project.featured_image && (
        <div className="mb-8 relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
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
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
            <iframe
              src={project.video_url}
              className="w-full h-full"
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
            <h2 className="text-2xl font-bold mb-4 text-white">About This Project</h2>
            <div 
              className="project-description max-w-none text-gray-300 leading-relaxed"
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
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-purple-400" />
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech.id}
                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30 font-medium"
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
          <h2 className="text-2xl font-bold mb-4 text-white">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.images
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div key={image.id} className="relative w-full h-64 rounded-lg overflow-hidden">
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
      <div className="mt-12 pt-8 border-t border-gray-700">
        <Link
          href="/portfolio"
          onClick={() => trackClick('portfolio_back', { fromProject: project.title })}
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </article>
  )
}


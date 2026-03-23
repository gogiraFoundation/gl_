'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Code, Globe, Star } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

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
  /** Default false: avoids Next.js RSC prefetch noise (and occasional CDN 404s) on dynamic /portfolio/[slug] */
  linkPrefetch?: boolean
}

export function ProjectCard({ project, linkPrefetch = false }: ProjectCardProps) {
  const { trackClick } = useAnalyticsEvent()

  const Icon = project.category?.name.toLowerCase().includes('web')
    ? Globe
    : project.category?.name.toLowerCase().includes('mobile')
      ? Code
      : Star

  return (
    <GlowCard variant="portfolio" glowColor="purple" className="group flex h-full flex-col">
      {/* Icon and Image Section */}
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg shadow-purple-900/30 md:h-16 md:w-16">
          <Icon className="h-7 w-7 text-white md:h-8 md:w-8" />
        </div>
        {project.featured_image && (
          <div className="relative h-28 flex-1 overflow-hidden rounded-2xl shadow-md ring-1 ring-white/10 md:h-32">
            <Image
              src={project.featured_image}
              alt={`${project.title} - ${project.category?.name || 'Project'} showcase`}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        {project.category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400/95">
            {project.category.name}
          </span>
        )}
        <h3 className="mb-2 mt-2 text-xl font-bold leading-tight tracking-tight text-white md:text-[1.35rem]">
          {project.title}
        </h3>
        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-400 md:text-[0.9375rem]">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech.id}
                className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-200/90 ring-1 ring-white/10 transition-colors duration-200 hover:bg-purple-500/25"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-purple-200/80 ring-1 ring-white/10">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-auto pt-1">
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
          className="group inline-flex w-fit items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-900/25 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-900/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
        >
          <span>Learn more</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
        </Link>
      </div>
    </GlowCard>
  )
}

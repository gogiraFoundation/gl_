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
}

const iconMap: Record<string, any> = {
  star: Star,
  code: Code,
  globe: Globe,
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { trackClick } = useAnalyticsEvent()

  // Select icon based on category or default
  const Icon = project.category?.name.toLowerCase().includes('web')
    ? Globe
    : project.category?.name.toLowerCase().includes('mobile')
      ? Code
      : Star

  return (
    <GlowCard glowColor="purple" className="flex h-full flex-col">
      {/* Icon and Image Section */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary shadow-glow-purple">
          <Icon className="h-8 w-8 text-white" />
        </div>
        {project.featured_image && (
          <div className="relative h-32 flex-1 overflow-hidden rounded-lg">
            <Image
              src={project.featured_image}
              alt={`${project.title} - ${project.category?.name || 'Project'} showcase`}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        {project.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-purple-400">
            {project.category.name}
          </span>
        )}
        <h3 className="mb-3 mt-2 text-xl font-bold text-white">{project.title}</h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-400">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech.id}
                className="rounded border border-purple-500/30 bg-purple-500/20 px-2 py-1 text-xs text-purple-300"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="rounded border border-purple-500/30 bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <Link
          href={`/portfolio/${project.slug}`}
          onClick={() =>
            trackClick('project_view', {
              projectId: project.id,
              projectTitle: project.title,
              category: project.category?.name,
            })
          }
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
        >
          <span>LEARN MORE</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </GlowCard>
  )
}

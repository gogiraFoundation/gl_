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
    <GlowCard glowColor="purple" className="h-full flex flex-col">
      {/* Icon and Image Section */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-purple">
          <Icon className="w-8 h-8 text-white" />
        </div>
        {project.featured_image && (
          <div className="relative flex-1 h-32 rounded-lg overflow-hidden">
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
          <span className="text-xs text-purple-400 font-semibold uppercase tracking-wide">
            {project.category.name}
          </span>
        )}
        <h3 className="text-xl font-bold mt-2 mb-3 text-white">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech.id}
                className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
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
          onClick={() => trackClick('project_view', { projectId: project.id, projectTitle: project.title, category: project.category?.name })}
          className="group flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple"
        >
          <span>LEARN MORE</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </GlowCard>
  )
}


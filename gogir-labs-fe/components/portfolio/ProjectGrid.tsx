'use client'

import { ProjectCard } from './ProjectCard'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

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

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="mb-2">No projects found.</p>
        <p className="text-sm">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {projects.map((project, index) => (
        <ScrollAnimation
          key={project.id}
          animationType="fade-in"
          delay={index * 50}
        >
          <ProjectCard project={project} />
        </ScrollAnimation>
      ))}
    </div>
  )
}


'use client'

import { ProjectCard } from './ProjectCard'

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
      <div className="py-12 text-center font-sans text-brutal-muted">
        <p className="mb-2 text-brutal-ink">No projects found.</p>
        <p className="text-sm">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

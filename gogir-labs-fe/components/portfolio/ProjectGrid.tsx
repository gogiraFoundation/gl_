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
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

export function ProjectGrid({
  projects,
  hasActiveFilters = false,
  onClearFilters,
}: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="mt-12 text-center font-essay-sans text-essay-muted">
        {hasActiveFilters ? (
          <>
            <p className="mb-2 text-essay-ink">Nothing matches these filters.</p>
            {onClearFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex min-h-[44px] items-center justify-center font-essay-sans text-sm font-medium text-essay-accent underline underline-offset-4 transition-opacity duration-essay-fast ease-essay hover:opacity-90"
              >
                Clear filters
              </button>
            ) : (
              <p className="text-sm">Try adjusting your filters or search.</p>
            )}
          </>
        ) : (
          <>
            <p className="mb-2 text-essay-ink">No projects found.</p>
            <p className="text-sm">Check back later.</p>
          </>
        )}
      </div>
    )
  }

  return (
    <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id} className="min-w-0">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}

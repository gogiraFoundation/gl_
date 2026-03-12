'use client'

import { useQuery } from '@tanstack/react-query'
import { ProjectCard } from './ProjectCard'
import api from '@/lib/api'
import { Code } from 'lucide-react'

interface RelatedProjectsProps {
  projectId: number
}

export function RelatedProjects({ projectId }: RelatedProjectsProps) {
  const { data: relatedProjects = [], isLoading } = useQuery({
    queryKey: ['related-projects', projectId],
    queryFn: async () => {
      const response = await api.get(`/portfolio/projects/${projectId}/related/`)
      return response.data
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading || relatedProjects.length === 0) {
    return null
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Code className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Related Projects</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProjects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}


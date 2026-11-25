import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import PortfolioProjectClient, { type Project } from './PortfolioProjectClient'
import { ApiError, fetchApi, fetchPublicJson } from '@/lib/serverApi'
import { PORTFOLIO_PUBLIC_HOLD_SLUGS } from '@/lib/essays'

export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{ slug?: string }>
}

type ProjectMeta = {
  title: string
  slug: string
  description: string
  featured_image: string | null
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Project' }
  if (PORTFOLIO_PUBLIC_HOLD_SLUGS.has(slug)) {
    return { title: 'Project not found' }
  }

  const project = await fetchPublicJson<ProjectMeta>(
    `/portfolio/projects/by-slug/?slug=${encodeURIComponent(slug)}`
  )
  if (!project) {
    return { title: 'Project not found' }
  }

  const title = project.title
  const description = project.description || `Portfolio project: ${project.title}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/portfolio/${project.slug}`,
      ...(project.featured_image ? { images: [{ url: project.featured_image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(project.featured_image ? { images: [project.featured_image] } : {}),
    },
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
  }
}

const getProject = cache(async (slug: string) => {
  return fetchApi<Project>(`/portfolio/projects/by-slug/?slug=${encodeURIComponent(slug)}`)
})

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  if (!slug) notFound()
  if (PORTFOLIO_PUBLIC_HOLD_SLUGS.has(slug)) notFound()

  let initialProject: Project | null = null
  try {
    initialProject = await getProject(slug)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
  }

  return <PortfolioProjectClient slug={slug} initialProject={initialProject} />
}

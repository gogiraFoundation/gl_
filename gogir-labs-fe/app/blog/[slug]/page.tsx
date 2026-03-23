import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{ slug?: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  if (!slug) notFound()

  return <BlogPostClient slug={slug} />
}

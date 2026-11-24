import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import BlogPostClient, { type Post } from './BlogPostClient'
import { ApiError, fetchApi } from '@/lib/serverApi'

export const revalidate = 60

interface BlogPostPageProps {
  params: Promise<{ slug?: string }>
}

const getBlogPost = cache(async (slug: string) => {
  return fetchApi<Post>(`/blog/posts/by-slug/?slug=${encodeURIComponent(slug)}`)
})

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Blog' }
  try {
    const post = await getBlogPost(slug)
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
    }
  } catch {
    return { title: 'Blog' }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  if (!slug) notFound()

  let initialPost: Post | null = null
  try {
    initialPost = await getBlogPost(slug)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
  }

  return <BlogPostClient slug={slug} initialPost={initialPost} />
}

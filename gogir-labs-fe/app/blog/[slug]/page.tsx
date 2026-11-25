import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { fetchPublicJson } from '@/lib/serverApi'

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{ slug?: string }>
}

type PostMeta = {
  title: string
  slug: string
  excerpt?: string
  featured_image: string | null
  meta_title?: string
  meta_description?: string
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Post' }

  const post = await fetchPublicJson<PostMeta>(
    `/blog/posts/by-slug/?slug=${encodeURIComponent(slug)}`
  )
  if (!post) {
    return { title: 'Post not found' }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || `Blog post: ${post.title}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/blog/${post.slug}`,
      ...(post.featured_image ? { images: [{ url: post.featured_image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(post.featured_image ? { images: [post.featured_image] } : {}),
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  if (!slug) notFound()

  return <BlogPostClient slug={slug} />
}

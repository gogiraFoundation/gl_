'use client'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostContent } from '@/components/blog/PostContent'
import api from '@/lib/api'
import { useEffect } from 'react'

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image: string | null
  category: { id: number; name: string; slug: string } | null
  tags: Array<{ id: number; name: string; slug: string }>
  author_name: string
  featured?: boolean
  views: number
  created_at: string
  published_at: string | null
  meta_title: string
  meta_description: string
}

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ['post', slug],
    queryFn: async () => {
      try {
        const response = await api.get(`/blog/posts/by-slug/`, {
          params: { slug },
        })
        const postData = response.data

        if (!postData) {
          throw new Error('Post not found')
        }

        return postData
      } catch (err: unknown) {
        throw err
      }
    },
    enabled: true,
    retry: 1,
  })

  // All hooks must be called before any early returns
  useEffect(() => {
    if (post?.id) {
      // Increment view count
      api.post(`/blog/posts/${post.id}/increment_views/`).catch(console.error)
    }
  }, [post?.id])

  useEffect(() => {
    if (post) {
      // Update meta tags for SEO and social sharing
      document.title = `${post.title} | Blog - Emmanuel Ugbaje`

      const description: string = post.meta_description ?? post.excerpt ?? ''

      // Update description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', description)
      }

      // Open Graph tags
      const ogTitle =
        document.querySelector('meta[property="og:title"]') || document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      ogTitle.setAttribute('content', post.title)
      if (!document.querySelector('meta[property="og:title"]')) {
        document.head.appendChild(ogTitle)
      }

      const ogDescription =
        document.querySelector('meta[property="og:description"]') || document.createElement('meta')
      ogDescription.setAttribute('property', 'og:description')
      ogDescription.setAttribute('content', description)
      if (!document.querySelector('meta[property="og:description"]')) {
        document.head.appendChild(ogDescription)
      }

      const ogImage =
        document.querySelector('meta[property="og:image"]') || document.createElement('meta')
      ogImage.setAttribute('property', 'og:image')
      ogImage.setAttribute(
        'content',
        post.featured_image || `${window.location.origin}/og-image.jpg`
      )
      if (!document.querySelector('meta[property="og:image"]')) {
        document.head.appendChild(ogImage)
      }

      const ogUrl =
        document.querySelector('meta[property="og:url"]') || document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      ogUrl.setAttribute('content', `${window.location.origin}/blog/${post.slug}`)
      if (!document.querySelector('meta[property="og:url"]')) {
        document.head.appendChild(ogUrl)
      }

      const ogType =
        document.querySelector('meta[property="og:type"]') || document.createElement('meta')
      ogType.setAttribute('property', 'og:type')
      ogType.setAttribute('content', 'article')
      if (!document.querySelector('meta[property="og:type"]')) {
        document.head.appendChild(ogType)
      }

      // Twitter Card tags
      const twitterCard =
        document.querySelector('meta[name="twitter:card"]') || document.createElement('meta')
      twitterCard.setAttribute('name', 'twitter:card')
      twitterCard.setAttribute('content', 'summary_large_image')
      if (!document.querySelector('meta[name="twitter:card"]')) {
        document.head.appendChild(twitterCard)
      }
    }
  }, [post])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">Loading post...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-2xl font-bold">Post not found</h1>
            <p className="text-gray-600 dark:text-gray-400">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-12">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 mx-auto max-w-4xl">{post && <PostContent post={post} />}</div>
      </main>
      <Footer />
    </div>
  )
}

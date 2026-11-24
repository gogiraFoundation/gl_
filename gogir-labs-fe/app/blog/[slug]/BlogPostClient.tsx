'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostContent } from '@/components/blog/PostContent'
import { FetchError, describeQueryError } from '@/components/ui/FetchError'
import api from '@/lib/api'
import axios from 'axios'
import { useEffect } from 'react'

export interface Post {
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
  initialPost?: Post | null
}

export default function BlogPostClient({ slug, initialPost = null }: BlogPostClientProps) {
  const {
    data: post,
    isLoading,
    error,
    refetch,
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
    initialData: initialPost ?? undefined,
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
      <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
        <Header />
        <main className="flex-grow px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-content text-left text-brutal-muted">Loading post…</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined
    const missing = status === 404
    return (
      <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
        <Header />
        <main className="flex-grow px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-content text-left">
            {missing ? (
              <>
                <h1 className="mb-4 font-serif text-2xl font-semibold tracking-tight">
                  Post not found
                </h1>
                <p className="text-brutal-muted">
                  That post doesn&apos;t exist or was removed. Browse the{' '}
                  <Link
                    href="/blog"
                    className="font-medium text-brutal-ink underline underline-offset-4 hover:opacity-75"
                  >
                    blog
                  </Link>{' '}
                  for other writing.
                </p>
              </>
            ) : (
              <FetchError
                title="Couldn't load this post"
                message={describeQueryError(error)}
                onRetry={() => {
                  void refetch()
                }}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-12 md:py-16 lg:px-8">
        <div className="mx-auto max-w-content">{post && <PostContent post={post} />}</div>
      </main>
      <Footer />
    </div>
  )
}

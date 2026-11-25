'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostContent } from '@/components/blog/PostContent'
import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { EssayPost } from '@/components/essays/EssayPost'
import api from '@/lib/api'
import { isAllowedEssaySlug } from '@/lib/essays'

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
  word_document?: string | null
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
      const response = await api.get(`/blog/posts/by-slug/`, {
        params: { slug },
      })
      const postData = response.data
      if (!postData) {
        throw new Error('Post not found')
      }
      return postData
    },
    enabled: true,
    retry: 1,
  })

  useEffect(() => {
    if (post?.id) {
      api.post(`/blog/posts/${post.id}/increment_views/`).catch(console.error)
    }
  }, [post?.id])

  // Allow-listed essay slugs use essay chrome; other posts stay brutalist.
  const useEssayLayout = Boolean(post) && isAllowedEssaySlug(post!.slug)

  if (isLoading) {
    if (isAllowedEssaySlug(slug)) {
      return (
        <EssayDesignScope>
          <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
            <EssayNav active="essays" />
            <main className="flex-grow px-6 py-12 lg:px-8">
              <p className="text-essay-muted">Loading essay…</p>
            </main>
            <EssayFooter />
          </div>
        </EssayDesignScope>
      )
    }
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
    const essayChrome = isAllowedEssaySlug(slug)
    if (essayChrome) {
      return (
        <EssayDesignScope>
          <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
            <EssayNav active="essays" />
            <main className="flex-grow px-6 py-12 lg:px-8">
              <h1 className="font-essay-display text-2xl font-semibold">Essay not found</h1>
              <p className="mt-4 text-essay-muted">
                Browse the{' '}
                <Link href="/blog" className="text-essay-accent underline underline-offset-4">
                  essays
                </Link>
                .
              </p>
            </main>
            <EssayFooter />
          </div>
        </EssayDesignScope>
      )
    }
    return (
      <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
        <Header />
        <main className="flex-grow px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-content text-left">
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
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (useEssayLayout) {
    return (
      <EssayDesignScope>
        <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-essay-bg focus:px-3 focus:py-2 focus:text-essay-accent"
          >
            Skip to content
          </a>
          <EssayNav active="essays" />
          <main id="main-content" className="flex-grow">
            <EssayPost post={post} />
          </main>
          <EssayFooter />
        </div>
      </EssayDesignScope>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-12 md:py-16 lg:px-8">
        <div className="mx-auto max-w-content">
          <PostContent post={post} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

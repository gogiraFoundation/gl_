'use client'

import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostList } from '@/components/blog/PostList'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  category: { id: number; name: string; slug: string } | null
  tags: Array<{ id: number; name: string; slug: string }>
  author_name: string
  published: boolean
  featured: boolean
  views: number
  created_at: string
  published_at: string | null
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

export default function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 400)

  // Improved query key structure with object for stable hashing
  const {
    data: posts,
    isLoading,
    isFetching,
    error,
  } = useQuery<Post[]>({
    queryKey: [
      'posts',
      {
        category: selectedCategory ?? null,
        tag: selectedTag ?? null,
        search: debouncedSearch || null,
      },
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (selectedCategory) params.category = selectedCategory
      if (selectedTag) params.tags = selectedTag
      if (debouncedSearch) params.search = debouncedSearch

      try {
        const response = await api.get('/blog/posts/', { params })

        // Handle different response shapes
        const data = response.data

        // Case 1: Django REST Framework pagination { results: [...], count: ... }
        if (data.results && Array.isArray(data.results)) {
          return data.results
        }

        // Case 2: Direct array
        if (Array.isArray(data)) {
          return data
        }

        // Case 3: Wrapped in data property
        if (data.data && Array.isArray(data.data)) {
          return data.data
        }

        // Case 4: Empty or unexpected shape
        return []
      } catch (err: unknown) {
        throw err
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  const typedPosts = (posts ?? []) as Post[]

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await api.get('/blog/categories/')
      return response.data.results || response.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - categories change rarely
    refetchOnWindowFocus: false,
  })

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const response = await api.get('/blog/tags/')
      return response.data.results || response.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - tags change rarely
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="relative flex-grow px-4 py-20">
        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="mb-12 max-w-2xl text-left">
            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-brutal-ink md:text-5xl">
              Blog
            </h1>
            <p className="text-left text-base leading-relaxed text-brutal-muted md:text-lg md:text-justify">
              Notes on infrastructure, DevOps, cloud, and software engineering—Terraform,
              Kubernetes, CI/CD, and architecture that holds up in production.
            </p>
          </header>

          <BlogFilters
            categories={categories || []}
            tags={tags || []}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
            onSearchChange={setSearchQuery}
          />

          {error && (
            <div
              role="alert"
              className="mb-8 border border-brutal-ink bg-brutal-bg p-4 text-left text-brutal-ink"
            >
              <p className="mb-2 font-semibold">Could not load posts</p>
              <p className="text-sm text-brutal-muted">
                {error instanceof Error
                  ? error.message
                  : 'Something went wrong. Refresh the page or try again later.'}
              </p>
            </div>
          )}

          <PostList
            posts={Array.isArray(typedPosts) ? typedPosts : []}
            isLoading={isLoading || (isFetching && !typedPosts.length)}
          />

          <div className="mt-16 max-w-2xl border-t border-brutal-ink/15 pt-10">
            <p className="text-left text-sm leading-relaxed text-brutal-muted md:text-justify">
              Like what you&apos;re reading? Follow on{' '}
              <Link
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                className="font-medium text-brutal-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brutal-ink"
              >
                LinkedIn
              </Link>{' '}
              or{' '}
              <Link
                href="https://medium.com/@aigbemanuel"
                className="font-medium text-brutal-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brutal-ink"
              >
                Medium
              </Link>{' '}
              for more on software engineering, DevOps, and backends.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

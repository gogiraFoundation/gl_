'use client'

import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostList } from '@/components/blog/PostList'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { FetchError, describeQueryError } from '@/components/ui/FetchError'
import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

export interface Post {
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

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

interface BlogClientProps {
  initialPosts?: Post[] | null
  initialCategories?: Category[] | null
  initialTags?: Tag[] | null
}

export default function BlogClient({
  initialPosts = null,
  initialCategories = null,
  initialTags = null,
}: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 400)
  const unfiltered = selectedCategory == null && selectedTag == null && !debouncedSearch

  // Improved query key structure with object for stable hashing
  const {
    data: posts,
    isLoading,
    isFetching,
    error,
    refetch,
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
    initialData: unfiltered && initialPosts ? initialPosts : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const typedPosts = (posts ?? []) as Post[]

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await api.get('/blog/categories/')
      return response.data.results || response.data
    },
    initialData: initialCategories ?? undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes - categories change rarely
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const response = await api.get('/blog/tags/')
      return response.data.results || response.data
    },
    initialData: initialTags ?? undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes - tags change rarely
    refetchOnWindowFocus: false,
    retry: 1,
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
            <p className="text-left text-base leading-relaxed text-brutal-muted md:text-justify md:text-lg">
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

          {error && typedPosts.length === 0 ? (
            <FetchError
              title="Couldn't load posts"
              message={describeQueryError(error)}
              onRetry={() => {
                void refetch()
              }}
            />
          ) : (
            <PostList
              posts={Array.isArray(typedPosts) ? typedPosts : []}
              isLoading={isLoading || (isFetching && !typedPosts.length)}
            />
          )}

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

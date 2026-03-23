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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 animate-fade-in-up text-center">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Insights on infrastructure, DevOps, cloud technologies, and software engineering -
              from Terraform to Kubernetes, CI/CD to scalable architecture.
            </p>
          </div>

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
            <div className="mb-8 rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-red-300">
              <p className="mb-2 font-semibold">Error loading posts</p>
              <p className="text-sm">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
              <p className="mt-2 text-xs opacity-75">Check the browser console for more details.</p>
            </div>
          )}

          <PostList
            posts={Array.isArray(typedPosts) ? typedPosts : []}
            isLoading={isLoading || (isFetching && !typedPosts.length)}
          />

          {/* Optional: Newsletter or Follow CTA */}
          <div className="mt-16 text-center">
            <p className="mb-4 text-gray-300">
              Like what you're reading? Follow me on{' '}
              <Link
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                className="text-purple-400 underline hover:text-purple-300"
              >
                LinkedIn
              </Link>{' '}
              or{' '}
              <Link
                href="https://medium.com/@aigbemanuel"
                className="text-purple-400 underline hover:text-purple-300"
              >
                Medium
              </Link>{' '}
              for more insights.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

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
      const params: any = {}
      if (selectedCategory) params.category = selectedCategory
      if (selectedTag) params.tags = selectedTag
      if (debouncedSearch) params.search = debouncedSearch
      
      console.log('🔍 BlogClient: Fetching posts with params:', params)
      console.log('🔍 BlogClient: API baseURL:', api.defaults.baseURL)
      
      try {
        const response = await api.get('/blog/posts/', { params })
        
        console.log('✅ BlogClient: API Response Status:', response.status)
        console.log('✅ BlogClient: API Response Data:', response.data)
        console.log('✅ BlogClient: Response Data Type:', typeof response.data)
        console.log('✅ BlogClient: Has results?', 'results' in response.data)
        console.log('✅ BlogClient: Is Array?', Array.isArray(response.data))
        
        // Handle different response shapes
        const data = response.data
        
        // Case 1: Django REST Framework pagination { results: [...], count: ... }
        if (data.results && Array.isArray(data.results)) {
          console.log('✅ BlogClient: Using results array, count:', data.results.length)
          return data.results
        }
        
        // Case 2: Direct array
        if (Array.isArray(data)) {
          console.log('✅ BlogClient: Using direct array, count:', data.length)
          return data
        }
        
        // Case 3: Wrapped in data property
        if (data.data && Array.isArray(data.data)) {
          console.log('✅ BlogClient: Using data.data array, count:', data.data.length)
          return data.data
        }
        
        // Case 4: Empty or unexpected shape
        console.warn('⚠️ BlogClient: Unexpected response shape, returning empty array')
        console.warn('⚠️ BlogClient: Response keys:', Object.keys(data))
        return []
      } catch (err: any) {
        console.error('❌ BlogClient: API Error:', err)
        console.error('❌ BlogClient: Error Response:', err.response?.data)
        console.error('❌ BlogClient: Error Status:', err.response?.status)
        throw err
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })
  
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 BlogClient: Posts data:', posts)
    console.log('🔍 BlogClient: Is loading:', isLoading)
    console.log('🔍 BlogClient: Is fetching:', isFetching)
    console.log('🔍 BlogClient: Error:', error)
    console.log('🔍 BlogClient: Posts count:', posts?.length ?? 0)
  }

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 px-4 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Insights on infrastructure, DevOps, cloud technologies, and software engineering - from Terraform to Kubernetes, CI/CD to scalable architecture.
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
            <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
              <p className="font-semibold mb-2">Error loading posts</p>
              <p className="text-sm">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
              <p className="text-xs mt-2 opacity-75">
                Check the browser console for more details.
              </p>
            </div>
          )}
          
          <PostList 
            posts={Array.isArray(posts) ? posts : []} 
            isLoading={isLoading || (isFetching && !posts)}
          />

          {/* Optional: Newsletter or Follow CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-300 mb-4">
              Like what you're reading? Follow me on <Link href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/" className="text-purple-400 hover:text-purple-300 underline">LinkedIn</Link> or <Link href="https://medium.com/@aigbemanuel" className="text-purple-400 hover:text-purple-300 underline">Medium</Link> for more insights.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


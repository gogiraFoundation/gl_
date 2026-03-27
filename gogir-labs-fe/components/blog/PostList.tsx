'use client'

import { PostCard } from './PostCard'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

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

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
}

function PostSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass h-80 animate-pulse rounded-2xl p-6">
          <div className="mb-4 h-48 rounded-lg bg-gray-700"></div>
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div>
          <div className="mb-2 h-4 w-full rounded bg-gray-700"></div>
          <div className="h-4 w-5/6 rounded bg-gray-700"></div>
        </div>
      ))}
    </div>
  )
}

export function PostList({ posts, isLoading }: PostListProps) {
  // Loading state - show skeleton even when keepPreviousData is active
  if (isLoading) {
    return <PostSkeleton />
  }

  // No posts state
  if (!posts || posts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        No posts found. Try adjusting your filters.
      </div>
    )
  }

  // Separate featured vs regular
  const featuredPosts = posts.filter((p) => p.featured)
  const regularPosts = posts.filter((p) => !p.featured)
  const hasFeatured = featuredPosts.length > 0
  const hasRegular = regularPosts.length > 0

  return (
    <div className="space-y-12">
      {/* Featured Posts */}
      {hasFeatured && (
        <section aria-label="Featured Posts" className="space-y-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-400">
              Featured Post{featuredPosts.length > 1 ? 's' : ''}
            </span>
          </div>
          <div
            className={
              hasRegular
                ? 'grid grid-cols-1 gap-6'
                : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
            }
          >
            {featuredPosts.map((post, i) => (
              <ScrollAnimation key={post.id} animationType="fade-in" delay={i * 50}>
                <PostCard post={post} featured={true} />
              </ScrollAnimation>
            ))}
          </div>
        </section>
      )}

      {/* Regular Posts */}
      {hasRegular && (
        <section aria-label="All Posts" className="space-y-6">
          {hasFeatured && (
            <div className="mb-4 text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-purple-400">
                All Posts
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post, i) => (
              <ScrollAnimation
                key={post.id}
                animationType="fade-in"
                delay={(i + featuredPosts.length) * 50}
              >
                <PostCard post={post} featured={false} />
              </ScrollAnimation>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

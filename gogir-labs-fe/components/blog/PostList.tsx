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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl p-6 animate-pulse h-80"
        >
          <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
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
      <div className="text-center py-12 text-gray-400">
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
          <div className="mb-4">
            <span className="text-sm text-blue-400 font-semibold uppercase tracking-wide">
              Featured Post{featuredPosts.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className={hasRegular ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {featuredPosts.map((post, i) => (
              <ScrollAnimation
                key={post.id}
                animationType="fade-in"
                delay={i * 50}
              >
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
            <div className="mb-4">
              <span className="text-sm text-purple-400 font-semibold uppercase tracking-wide">
                All Posts
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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


'use client'

import { useQuery } from '@tanstack/react-query'
import { PostCard } from './PostCard'
import api from '@/lib/api'
import { BookOpen } from 'lucide-react'

interface RelatedPostsProps {
  postId: number
}

export function RelatedPosts({ postId }: RelatedPostsProps) {
  const { data: relatedPosts = [], isLoading } = useQuery({
    queryKey: ['related-posts', postId],
    queryFn: async () => {
      const response = await api.get(`/blog/posts/${postId}/related/`)
      return response.data
    },
    enabled: !!postId,
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading || relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-12 border-t border-brutal-ink/15 pt-8">
      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-brutal-ink" aria-hidden />
        <h2 className="font-serif text-2xl font-semibold text-brutal-ink">Related posts</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

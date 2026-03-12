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
    <section className="mt-12 pt-8 border-t border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">You Might Also Like</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}


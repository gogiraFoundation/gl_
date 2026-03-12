'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { MessageCircle, Send, Loader2 } from 'lucide-react'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  content: z.string().min(10, 'Comment must be at least 10 characters'),
  website: z.string().optional(), // Honeypot
})

type CommentFormData = z.infer<typeof commentSchema>

interface Comment {
  id: number
  name: string
  content: string
  created_at: string
}

interface CommentsProps {
  postId: number
}

export function Comments({ postId }: CommentsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { trackFormSubmit } = useAnalyticsEvent()
  const queryClient = useQueryClient()

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await api.get(`/blog/posts/${postId}/comments/`)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      const response = await api.post(`/blog/posts/${postId}/comments/`, {
        name: data.name,
        email: data.email,
        content: data.content,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      reset()
      trackFormSubmit('blog_comment', { postId })
    },
    onError: (error: any) => {
      console.error('Comment submission error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
    },
  })

  const onSubmit = async (data: CommentFormData) => {
    // Honeypot spam protection
    if (data.website) {
      console.warn('Spam detected: honeypot field filled')
      return
    }

    setIsSubmitting(true)
    mutation.mutate(data, {
      onSuccess: () => {
        setIsSubmitting(false)
      },
      onError: () => {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          {...register('website')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-white mb-2">
              Name *
            </label>
            <input
              type="text"
              id="comment-name"
              {...register('name')}
              className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="comment-email" className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <input
              type="email"
              id="comment-email"
              {...register('email')}
              className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment-content" className="block text-sm font-medium text-white mb-2">
            Comment *
          </label>
          <textarea
            id="comment-content"
            rows={6}
            {...register('content')}
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            placeholder="Share your thoughts..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Post Comment
            </>
          )}
        </button>

        {mutation.isError && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
            <p className="font-semibold mb-1">Failed to submit comment.</p>
            <p className="text-sm">
              {mutation.error && (mutation.error as any).response?.data 
                ? (typeof (mutation.error as any).response.data === 'string'
                    ? (mutation.error as any).response.data
                    : (mutation.error as any).response.data.detail || 
                      (mutation.error as any).response.data.message ||
                      JSON.stringify((mutation.error as any).response.data))
                : (mutation.error as any).message || 'Please try again.'}
            </p>
            <p className="text-xs mt-2 text-red-400">
              If this problem persists, please check your connection or try again later.
            </p>
          </div>
        )}

        {mutation.isSuccess && (
          <div className="p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg">
            <p className="font-semibold mb-1">✓ Comment submitted successfully!</p>
            <p className="text-sm">
              Your comment has been submitted and is awaiting moderation. It will appear here once approved.
            </p>
          </div>
        )}
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-white">{comment.name}</div>
                <div className="text-sm text-gray-400">{formatDate(comment.created_at)}</div>
              </div>
              <div className="text-gray-300 leading-relaxed">{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


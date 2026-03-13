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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
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
    <div className="mt-12 border-t border-gray-700 pt-8">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-purple-400" />
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="comment-name" className="mb-2 block text-sm font-medium text-white">
              Name *
            </label>
            <input
              type="text"
              id="comment-name"
              {...register('name')}
              className="w-full rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="comment-email" className="mb-2 block text-sm font-medium text-white">
              Email *
            </label>
            <input
              type="email"
              id="comment-email"
              {...register('email')}
              className="w-full rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="comment-content" className="mb-2 block text-sm font-medium text-white">
            Comment *
          </label>
          <textarea
            id="comment-content"
            rows={6}
            {...register('content')}
            className="w-full resize-none rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Share your thoughts..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Post Comment
            </>
          )}
        </button>

        {mutation.isError && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-red-300">
            <p className="mb-1 font-semibold">Failed to submit comment.</p>
            <p className="text-sm">
              {mutation.error && (mutation.error as any).response?.data
                ? typeof (mutation.error as any).response.data === 'string'
                  ? (mutation.error as any).response.data
                  : (mutation.error as any).response.data.detail ||
                    (mutation.error as any).response.data.message ||
                    JSON.stringify((mutation.error as any).response.data)
                : (mutation.error as any).message || 'Please try again.'}
            </p>
            <p className="mt-2 text-xs text-red-400">
              If this problem persists, please check your connection or try again later.
            </p>
          </div>
        )}

        {mutation.isSuccess && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/20 p-4 text-green-300">
            <p className="mb-1 font-semibold">✓ Comment submitted successfully!</p>
            <p className="text-sm">
              Your comment has been submitted and is awaiting moderation. It will appear here once
              approved.
            </p>
          </div>
        )}
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="py-8 text-center text-gray-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="font-semibold text-white">{comment.name}</div>
                <div className="text-sm text-gray-400">{formatDate(comment.created_at)}</div>
              </div>
              <div className="leading-relaxed text-gray-300">{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

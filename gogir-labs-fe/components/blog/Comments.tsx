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
  const [showForm, setShowForm] = useState(false)
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
        setShowForm(false)
      },
      onError: () => {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <div className="mt-12 border-t border-brutal-ink/15 pt-8">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-brutal-ink" />
        <h2 className="font-serif text-2xl font-semibold text-brutal-ink">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      <button
        type="button"
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-6 inline-flex items-center gap-2 border border-brutal-ink bg-brutal-ink px-6 py-3 font-semibold text-brutal-bg transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] motion-reduce:hover:translate-y-0"
        aria-expanded={showForm}
        aria-controls="post-comment-form"
      >
        <Send className="h-5 w-5" />
        {showForm ? 'Hide Comment Form' : 'Post Comment'}
      </button>

      {/* Comment Form */}
      {showForm && (
      <form id="post-comment-form" onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4 animate-fade-in-up">
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
            <label htmlFor="comment-name" className="mb-2 block text-sm font-medium text-brutal-ink">
              Name *
            </label>
            <input
              type="text"
              id="comment-name"
              {...register('name')}
              className="w-full rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-3 text-brutal-ink placeholder:text-brutal-muted focus:border-brutal-ink focus:outline-none"
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="comment-email" className="mb-2 block text-sm font-medium text-brutal-ink">
              Email *
            </label>
            <input
              type="email"
              id="comment-email"
              {...register('email')}
              className="w-full rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-3 text-brutal-ink placeholder:text-brutal-muted focus:border-brutal-ink focus:outline-none"
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="comment-content" className="mb-2 block text-sm font-medium text-brutal-ink">
            Comment *
          </label>
          <textarea
            id="comment-content"
            rows={6}
            {...register('content')}
            className="w-full resize-none rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-3 text-brutal-ink placeholder:text-brutal-muted focus:border-brutal-ink focus:outline-none"
            placeholder="Share your thoughts..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-700">{errors.content.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 border border-brutal-ink bg-brutal-ink px-6 py-3 font-semibold text-brutal-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="rounded-sm border border-[orangered]/50 bg-[rgba(255,69,0,0.12)] p-4 text-brutal-ink">
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
            <p className="mt-2 text-xs text-brutal-muted">
              If this problem persists, please check your connection or try again later.
            </p>
          </div>
        )}

        {mutation.isSuccess && (
          <div className="rounded-sm border border-[lightgreen]/60 bg-[rgba(144,238,144,0.15)] p-4 text-brutal-ink">
            <p className="mb-1 font-semibold">✓ Comment submitted successfully!</p>
            <p className="text-sm">
              Your comment has been submitted and is awaiting moderation. It will appear here once
              approved.
            </p>
          </div>
        )}
      </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="py-8 text-center text-brutal-muted">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-brutal-muted">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="animate-fade-in-up rounded-sm border border-brutal-ink/15 bg-brutal-bg p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)] motion-reduce:hover:translate-y-0"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="font-semibold text-brutal-ink">{comment.name}</div>
                <div className="text-sm text-brutal-muted">{formatDate(comment.created_at)}</div>
              </div>
              <div className="leading-relaxed text-brutal-muted">{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

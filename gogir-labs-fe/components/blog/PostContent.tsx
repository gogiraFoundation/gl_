'use client'

import { useEffect, useMemo } from 'react'
import Image from 'next/image'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import { Comments } from './Comments'
import { ShareButtons } from '@/components/sharing/ShareButtons'
import { RelatedPosts } from './RelatedPosts'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Clock, Eye } from 'lucide-react'

// Dynamic import for DOMPurify (Next.js client-side only)
let DOMPurify: any
if (typeof window !== 'undefined') {
  DOMPurify = require('dompurify')
}

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image: string | null
  category: { id: number; name: string; slug: string } | null
  tags: Array<{ id: number; name: string; slug: string }>
  author_name: string
  featured?: boolean
  views: number
  created_at: string
  published_at: string | null
  meta_title: string
  meta_description: string
}

interface PostContentProps {
  post: Post
}

export function PostContent({ post }: PostContentProps) {
  const isFeatured = post.featured ?? false

  useEffect(() => {
    // Keep a minimal effect to recalculate when post changes
  }, [post, isFeatured])

  // Sanitize HTML content
  const sanitizedContent = useMemo(() => {
    const rawContent = post.content

    if (!rawContent?.trim()) {
      return null
    }

    if (typeof window !== 'undefined' && DOMPurify) {
      const sanitized = DOMPurify.sanitize(rawContent, {
        ALLOWED_TAGS: [
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'ul',
          'ol',
          'li',
          'blockquote',
          'pre',
          'code',
          'a',
          'img',
          'table',
          'thead',
          'tbody',
          'tr',
          'th',
          'td',
          'div',
          'span',
          'hr',
          'sub',
          'sup',
          'iframe',
          'video',
        ],
        ALLOWED_ATTR: [
          'href',
          'src',
          'alt',
          'title',
          'class',
          'id',
          'width',
          'height',
          'style',
          'target',
          'rel',
        ],
        ALLOWED_URI_REGEXP:
          /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      })

      if (!sanitized?.trim()) {
        return null
      }

      return sanitized
    }

    return null
  }, [post.content])

  return (
    <article className={`py-8 ${isFeatured ? 'relative' : ''}`}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      {/* Featured Banner */}
      {isFeatured && (
        <ScrollAnimation animationType="fade-in" delay={0}>
          <div className="mb-6 rounded-lg border-l-4 border-purple-500 bg-purple-600/20 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-purple-600 px-3 py-1 text-xs font-bold uppercase text-white">
                Featured Post
              </span>
              <span className="text-sm text-purple-300">This is a featured article</span>
            </div>
          </div>
        </ScrollAnimation>
      )}

      {/* Category */}
      <ScrollAnimation animationType="fade-in" delay={100}>
        {post.category && (
          <span
            className={`mb-2 inline-block text-sm font-semibold uppercase tracking-wide ${
              isFeatured ? 'text-purple-400' : 'text-blue-400'
            }`}
          >
            {post.category.name}
          </span>
        )}
      </ScrollAnimation>

      {/* Title */}
      <ScrollAnimation animationType="fade-in" delay={200}>
        <h1
          className={`mb-6 mt-2 font-bold ${
            isFeatured
              ? 'text-5xl text-purple-300 md:text-6xl'
              : 'text-4xl text-white dark:text-white md:text-5xl'
          }`}
        >
          {post.title}
        </h1>
      </ScrollAnimation>

      {/* Meta */}
      <ScrollAnimation animationType="fade-in" delay={300}>
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-400 dark:text-gray-300">
          <span>By {post.author_name}</span>
          <span>•</span>
          <span>{formatDate(post.published_at || post.created_at)}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views} views</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{calculateReadingTime(post.content)} min read</span>
          </div>
        </div>
      </ScrollAnimation>

      {/* Featured Image */}
      {post.featured_image && (
        <ScrollAnimation animationType="fade-in" delay={400}>
          <div
            className={`relative mb-8 w-full overflow-hidden rounded-lg ${
              isFeatured ? 'h-80 ring-2 ring-purple-500/30 sm:h-[28rem]' : 'h-64 sm:h-96'
            }`}
          >
            <Image
              src={post.featured_image}
              alt={`${post.title} - ${post.category?.name || 'Blog post'} by ${post.author_name}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </ScrollAnimation>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <ScrollAnimation animationType="fade-in" delay={500}>
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.slice(0, 5).map((tag) => (
              <span
                key={tag.id}
                className={`rounded-full border px-3 py-1 text-sm ${
                  isFeatured
                    ? 'border-purple-500/30 bg-purple-500/20 text-purple-300'
                    : 'border-blue-500/30 bg-blue-500/20 text-blue-300'
                }`}
              >
                {tag.name}
              </span>
            ))}
            {post.tags.length > 5 && (
              <span className="px-3 py-1 text-sm text-gray-400 dark:text-gray-300">
                +{post.tags.length - 5} more
              </span>
            )}
          </div>
        </ScrollAnimation>
      )}

      {/* Content */}
      <div className="mt-8">
        {(() => {
          if (sanitizedContent) {
            return (
              <div
                className="blog-content max-w-none rounded-lg border border-gray-700/30 bg-gray-900/50 p-6 shadow-lg dark:border-gray-600/30 dark:bg-gray-800/50 md:p-8"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                style={{
                  minHeight: '200px',
                  color: 'rgb(243, 244, 246)', // Explicit gray-100 color
                }}
                data-testid="blog-content-rendered"
              />
            )
          } else if (post.content) {
            return (
              <div className="blog-content max-w-none rounded-lg border border-yellow-500/30 bg-gray-900/50 p-6 shadow-lg dark:bg-gray-800/50 md:p-8">
                <div className="mb-4 rounded border border-yellow-500/50 bg-yellow-500/20 p-3 text-sm text-yellow-200">
                  Content exists but could not be safely rendered.
                </div>
                <pre
                  className="overflow-x-auto whitespace-pre-wrap break-words text-sm text-gray-300"
                  style={{ color: 'rgb(243, 244, 246)' }}
                >
                  {post.content.substring(0, 500)}
                  {post.content.length > 500 ? '...' : ''}
                </pre>
                <div className="mt-4 rounded border border-blue-500/50 bg-blue-500/20 p-3 text-sm text-blue-200">
                  <strong>Raw HTML:</strong> Content length: {post.content.length} characters
                </div>
              </div>
            )
          } else {
            console.log('❌ Rendering "No content" message')
            return (
              <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-8 italic text-gray-400 dark:bg-gray-700/30 dark:text-gray-300">
                <p className="mb-2">No content available for this post.</p>
                <p className="text-sm">
                  Content field:{' '}
                  {post.content ? `"${post.content.substring(0, 50)}..."` : 'null or empty'}
                </p>
              </div>
            )
          }
        })()}
      </div>

      {/* Share Buttons */}
      <div className="mt-8 border-t border-gray-700 pt-8">
        <ShareButtons
          url={`/blog/${post.slug}`}
          title={post.title}
          description={post.meta_description || post.excerpt}
          type="blog"
        />
      </div>

      {/* Comments */}
      <Comments postId={post.id} />

      {/* Related Posts */}
      <RelatedPosts postId={post.id} />
    </article>
  )
}

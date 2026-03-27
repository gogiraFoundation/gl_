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
          <div className="mb-6 rounded-sm border-l-4 border-[orangered] bg-[rgba(255,69,0,0.12)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-[orangered] px-3 py-1 text-xs font-bold uppercase text-white">
                Featured Post
              </span>
              <span className="text-sm text-brutal-muted">This is a featured article</span>
            </div>
          </div>
        </ScrollAnimation>
      )}

      {/* Category */}
      <ScrollAnimation animationType="fade-in" delay={100}>
        {post.category && (
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-brutal-muted">
            {post.category.name}
          </span>
        )}
      </ScrollAnimation>

      {/* Title */}
      <ScrollAnimation animationType="fade-in" delay={200}>
        <h1
          className={`mb-6 mt-2 font-serif font-semibold text-brutal-ink ${isFeatured ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}
        >
          {post.title}
        </h1>
      </ScrollAnimation>

      {/* Meta */}
      <ScrollAnimation animationType="fade-in" delay={300}>
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-sm border border-brutal-ink/15 bg-brutal-bg px-4 py-3 text-sm text-brutal-muted shadow-[0_3px_12px_rgba(0,0,0,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.09)] motion-reduce:hover:translate-y-0">
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
            className={`group relative mb-8 w-full overflow-hidden rounded-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)] motion-reduce:hover:translate-y-0 ${
              isFeatured ? 'h-80 ring-1 ring-brutal-ink/20 sm:h-[28rem]' : 'h-64 sm:h-96'
            }`}
          >
            <Image
              src={post.featured_image}
              alt={`${post.title} - ${post.category?.name || 'Blog post'} by ${post.author_name}`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
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
            {post.tags.slice(0, 5).map((tag, index) => (
              <span
                key={tag.id}
                className="animate-fade-in-up rounded-sm border border-brutal-ink/20 bg-brutal-bg px-3 py-1 text-sm text-brutal-ink transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_8px_20px_rgba(0,0,0,0.09)] motion-reduce:hover:translate-y-0"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {tag.name}
              </span>
            ))}
            {post.tags.length > 5 && (
              <span className="px-3 py-1 text-sm text-brutal-muted">
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
                className="blog-content max-w-none rounded-sm border border-brutal-ink/15 bg-brutal-bg p-6 shadow-[0_4px_16px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,0.04)_inset] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.11)] motion-reduce:hover:translate-y-0 md:p-8"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                style={{ minHeight: '200px' }}
                data-testid="blog-content-rendered"
              />
            )
          } else if (post.content) {
            return (
              <div className="blog-content max-w-none rounded-sm border border-brutal-ink/20 bg-brutal-bg p-6 shadow-[0_4px_16px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,0.04)_inset] md:p-8">
                <div className="mb-4 rounded-sm border border-[orangered]/60 bg-[rgba(255,69,0,0.12)] p-3 text-sm text-brutal-ink">
                  Content exists but could not be safely rendered.
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm text-brutal-muted">
                  {post.content.substring(0, 500)}
                  {post.content.length > 500 ? '...' : ''}
                </pre>
                <div className="mt-4 rounded-sm border border-brutal-ink/20 bg-brutal-bg p-3 text-sm text-brutal-muted">
                  <strong>Raw HTML:</strong> Content length: {post.content.length} characters
                </div>
              </div>
            )
          } else {
            console.log('❌ Rendering "No content" message')
            return (
              <div className="rounded-sm border border-brutal-ink/20 bg-brutal-bg p-8 italic text-brutal-muted">
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
      <div className="mt-8 border-t border-brutal-ink/15 pt-8">
        <div className="border-brutal-ink/12 animate-fade-in-up rounded-sm border bg-brutal-bg p-4 shadow-[0_3px_12px_rgba(0,0,0,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.09)] motion-reduce:hover:translate-y-0">
          <ShareButtons
            url={`/blog/${post.slug}`}
            title={post.title}
            description={post.meta_description || post.excerpt}
            type="blog"
          />
        </div>
      </div>

      {/* Comments */}
      <Comments postId={post.id} />

      {/* Related Posts */}
      <RelatedPosts postId={post.id} />
    </article>
  )
}

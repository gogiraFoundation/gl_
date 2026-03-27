'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { BookOpen } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { cn } from '@/lib/utils'

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

interface PostCardProps {
  post: Post
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const { trackClick } = useAnalyticsEvent()

  return (
    <Link
      href={`/blog/${post.slug}`}
      onClick={() =>
        trackClick('blog_post_view', {
          postId: post.id,
          postTitle: post.title,
          category: post.category?.name,
          featured,
        })
      }
      className="relative block"
    >
      <GlowCard
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-lg p-6',
          'transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
          !featured && 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.11)]',
          featured &&
            'shadow-[0_8px_28px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)_inset] hover:shadow-[0_14px_40px_rgba(0,0,0,0.14)]'
        )}
      >
        {featured && (
          <span className="absolute right-3 top-3 z-10 bg-brutal-bg px-2 py-1 text-xs font-semibold uppercase text-brutal-ink shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out group-hover:-translate-y-px motion-reduce:group-hover:translate-y-0">
            Featured
          </span>
        )}

        <div className={cn('mb-4 flex items-start justify-start gap-4', featured && 'mb-6')}>
          <div className="flex min-w-0 flex-shrink-0 flex-col items-start gap-1.5 text-left">
            <div
              className={cn(
                'flex items-center justify-center rounded-3xl bg-brutal-ink/[0.07] shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_6px_18px_rgba(0,0,0,0.09)] motion-reduce:group-hover:scale-100',
                featured ? 'h-14 w-14' : 'h-12 w-12'
              )}
            >
              <BookOpen
                className={cn(
                  'text-brutal-ink transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100',
                  featured ? 'h-7 w-7' : 'h-6 w-6'
                )}
              />
            </div>
            {post.category && (
              <span
                className={cn(
                  'text-left text-[10px] font-semibold uppercase leading-tight tracking-wide text-brutal-muted',
                  featured ? 'w-14' : 'w-12'
                )}
              >
                {post.category.name}
              </span>
            )}
          </div>
          {post.featured_image && (
            <div className={cn('relative flex-1 overflow-hidden', featured ? 'h-48 md:h-56' : 'h-32')}>
              <Image
                src={post.featured_image}
                alt={`${post.title} - ${post.category?.name || 'Blog post'} featured image`}
                fill
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        <div className="flex-grow text-center">
          <h3 className="mb-3 mt-2 font-sans text-xl font-semibold text-brutal-ink transition-[transform,opacity] duration-300 ease-out group-hover:-translate-y-px group-hover:opacity-100 md:text-2xl motion-reduce:group-hover:translate-y-0">
            {post.title}
          </h3>
          <p
            className={cn(
              'mb-4 leading-relaxed text-brutal-muted',
              featured ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm'
            )}
          >
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="border border-brutal-ink/15 px-2 py-1 text-xs text-brutal-muted"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto border-t border-brutal-ink/15 pt-4 text-center">
            <p className="text-xs text-brutal-muted">Posted on {formatDate(post.published_at || post.created_at)}</p>
            <span className="mt-3 inline-flex justify-center text-sm font-semibold text-brutal-ink underline underline-offset-4 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-0.5 group-hover:opacity-80 motion-reduce:group-hover:translate-x-0">
              Read Full Post
            </span>
          </div>
        </div>
      </GlowCard>
    </Link>
  )
}

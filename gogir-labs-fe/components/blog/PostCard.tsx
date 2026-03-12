'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { BookOpen, Eye, Clock } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

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
      onClick={() => trackClick('blog_post_view', { 
        postId: post.id, 
        postTitle: post.title, 
        category: post.category?.name,
        featured 
      })}
      className="relative block"
    >
      <GlowCard 
        glowColor={featured ? "purple" : "blue"} 
        className={`h-full flex flex-col group relative ${
          featured 
            ? 'ring-2 ring-purple-500/30 scale-105 md:scale-110 transition-transform duration-300' 
            : ''
        }`}
      >
        {/* Featured Badge - Absolute positioned in top-right */}
        {featured && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold uppercase bg-purple-600 text-white rounded-lg shadow-lg z-10 backdrop-blur-sm">
            Featured
          </span>
        )}

        {/* Icon and Image Section */}
        <div className={`flex items-start gap-4 mb-4 ${featured ? 'mb-6' : ''}`}>
          <div className={`flex-shrink-0 rounded-lg bg-gradient-primary flex items-center justify-center ${
            featured 
              ? 'w-20 h-20 shadow-glow-purple' 
              : 'w-16 h-16 shadow-glow-blue'
          }`}>
            <BookOpen className={`text-white ${featured ? 'w-10 h-10' : 'w-8 h-8'}`} />
          </div>
          {post.featured_image && (
            <div className={`relative flex-1 rounded-lg overflow-hidden ${
              featured ? 'h-48 md:h-56' : 'h-32'
            }`}>
              <Image
                src={post.featured_image}
                alt={`${post.title} - ${post.category?.name || 'Blog post'} featured image`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow">
          {post.category && (
            <span className={`text-xs font-semibold uppercase tracking-wide ${
              featured ? 'text-purple-400' : 'text-blue-400'
            }`}>
              {post.category.name}
            </span>
          )}
          <h3 className={`font-bold mt-2 mb-3 transition-colors ${
            featured 
              ? 'text-2xl text-purple-300 group-hover:text-purple-200' 
              : 'text-xl text-white group-hover:text-blue-400'
          }`}>
            {post.title}
          </h3>
          <p className={`text-gray-400 mb-4 leading-relaxed ${
            featured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
          }`}>
            {post.excerpt}
          </p>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className={`px-2 py-1 text-xs rounded border ${
                    featured
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Meta */}
          <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-purple-500/20">
            <span>{post.author_name}</span>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              <span>{post.views}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  )
}


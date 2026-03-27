'use client'

import { useState } from 'react'
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  type?: 'blog' | 'project'
}

export function ShareButtons({ url, title, description = '', type = 'blog' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { trackClick } = useAnalyticsEvent()

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
  const shareText = description || title

  const handleShare = async (platform: string, shareUrl: string) => {
    trackClick(`share_${platform}`, { type, title, url })

    // Use Web Share API if available (mobile)
    if (navigator.share && platform === 'native') {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: fullUrl,
        })
        return
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
        return
      }
    }

    // Fallback to platform-specific URLs
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      trackClick('share_copy', { type, title })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-brutal-muted">Share:</span>

      {/* Native Share (Mobile) */}
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          onClick={() => handleShare('native', '')}
          className="flex items-center gap-2 rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-2 text-brutal-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)]"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-sm">Share</span>
        </button>
      )}

      {/* Twitter */}
      <button
        onClick={() => handleShare('twitter', shareLinks.twitter)}
        className="flex items-center gap-2 rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-2 text-brutal-ink transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)]"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
        <span className="text-sm">Twitter</span>
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare('linkedin', shareLinks.linkedin)}
        className="flex items-center gap-2 rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-2 text-brutal-ink transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)]"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
        <span className="text-sm">LinkedIn</span>
      </button>

      {/* Facebook */}
      <button
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        className="flex items-center gap-2 rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-2 text-brutal-ink transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)]"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
        <span className="text-sm">Facebook</span>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 rounded-sm border border-brutal-ink/20 bg-brutal-bg px-4 py-2 text-brutal-ink transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)]"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span className="text-sm">Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            <span className="text-sm">Copy Link</span>
          </>
        )}
      </button>
    </div>
  )
}

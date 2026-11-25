import { cn } from '@/lib/utils'
import { evidenceLabel, type EvidenceKind } from '@/lib/essays'

interface EvidenceTagProps {
  kind: EvidenceKind
  className?: string
}

export function EvidenceTag({ kind, className }: EvidenceTagProps) {
  const isLive = kind === 'live'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-essay-mono text-[0.65rem] font-medium uppercase tracking-wider',
        isLive ? 'text-essay-accent' : 'text-essay-muted',
        className
      )}
    >
      {isLive && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-essay-accent motion-safe:animate-pulse"
          aria-hidden
        />
      )}
      <span
        className={cn(
          'rounded-sm border px-1.5 py-0.5',
          isLive ? 'border-essay-accent' : 'border-essay-muted/40'
        )}
      >
        {evidenceLabel(kind)}
      </span>
    </span>
  )
}

const CODE_LINES = [
  'from rest_framework.decorators import api_view',
  'from rest_framework.response import Response',
  '@api_view(["GET"])',
  'def health(request):',
  '    return Response({"ok": True})  # IAM',
]

/**
 * Faux terminal / code snippet — static bordered panel with a stepped caret.
 */
export function HeroGeometric() {
  return (
    <div
      className="relative flex select-none items-center justify-center md:min-h-[320px] md:justify-start lg:ml-5"
      aria-hidden
    >
      <div className="w-full max-w-sm border border-brutal-ink bg-brutal-bg p-4 font-mono text-xs leading-relaxed text-brutal-ink">
        <div className="mb-2 border-b-2 border-[orangered] pb-2 text-brutal-muted">$ _</div>
        {CODE_LINES.map((line, i) => (
          <div
            key={`${i}-${line.slice(0, 24)}`}
            className={i === CODE_LINES.length - 1 ? 'truncate text-brutal-muted' : 'truncate'}
          >
            {line}
            {i === CODE_LINES.length - 1 ? (
              <span className="hero-caret ml-0.5 inline-block h-3 w-2 bg-[orangered] align-middle" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

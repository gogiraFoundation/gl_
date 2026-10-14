# Components

## Client boundary

Add `'use client'` when the file uses state, effects, browser events, React Query, or a context. A pure function in `lib/` stays free of that directive.

Pages that call `useQuery` or `useEffect` are client components. Do not convert one to a server component to avoid the directive if it still needs those hooks.

`app/layout.tsx` stays a server component. Providers live in `app/providers.tsx`.

## What exists

Import shared pieces from their current paths. Do not invent a `components/ui` barrel that re-exports everything.

| Need | Use |
| --- | --- |
| Public nav | `Header` from `@/components/layout/Header` |
| Public footer and newsletter | `Footer` from `@/components/layout/Footer` |
| Class merge | `cn` from `@/lib/utils` |
| Dates | `formatDate` from `@/lib/utils` (`en-GB`) |
| Project and post cards | The card in that domain (`ProjectCard`, `PostCard`) |
| Motion | Existing `framer-motion` usage on the home hero. Do not add motion to admin tables |
| Icons | `lucide-react` |

`Header` owns the nav list: Home, Portfolio, Blog, About, Resume, Contact. Add a destination there only when `product-design` says it is a new top-level place.

## Props

- Extend the native element props when wrapping one.
- Optional `className` is last in `cn(...)` so the caller can adjust spacing.
- Boolean visual props are a union (`variant`, `size`) or the existing flags on that component (`compact` on `NewsletterForm`). Do not add a pile of `isPrimary` flags.

## Class names

Public surfaces:

```tsx
import { cn } from '@/lib/utils'

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border border-brutal-ink bg-brutal-bg p-6 text-brutal-ink', className)}
      {...props}
    />
  )
}
```

Tokens already in Tailwind for this design: `brutal.bg`, `brutal.ink`, `brutal.muted`, `max-w-content` (1200px), `max-w-shell` (1400px), `section` (4rem), `inner` (1.5rem). The accent on contact inputs is `orangered`. Layout distances are in the layout skill.

The root layout sets `data-design="brutalist"` and `data-theme="light"`. New public UI assumes that. Do not add a second theme toggle path.

## Identity for tests

Tests query by role, label, and placeholder. Give a control a visible name. An icon button gets `aria-label`. Add `data-testid` only when role and label cannot tell two nodes apart.

## Lists and keys

Key rows by the stable id or slug from the API, not by the array index. Index keys are only for static skeletons.

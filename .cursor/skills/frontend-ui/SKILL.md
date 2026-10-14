---
name: frontend-ui
description: >-
  Implement gogir-labs React screens with the existing brutalist public UI,
  admin patterns, forms, and English copy. Use when writing or changing
  components, forms, cards, empty states, client components, or user-facing
  strings in gogir-labs-fe.
---

# Frontend UI

Build the screen from the nearest sibling in `gogir-labs-fe/components`. `frontend-architecture` decides the module. `ui-ux-layout` decides the regions. `product-design` decides the job and the words. This skill decides the React implementation.

## Precedence

1. The markup, field class, and feedback pattern already used on the nearest sibling screen
2. This skill
3. The personal `design-systems` skill for generic accessibility rules

Read the matching reference before writing UI code:

| Task | Read |
| --- | --- |
| Client components, class names, icons | [components.md](components.md) |
| Forms, submit states, errors | [forms-and-feedback.md](forms-and-feedback.md) |
| Strings and dates | [copy.md](copy.md) |

## Workflow

1. Find the sibling in the same area and match it. Public pages follow home, portfolio, and contact. Admin pages follow `components/admin/Dashboard.tsx` and the other `app/admin` screens.
2. Add `'use client'` when the file uses state, effects, events, or React Query.
3. Render loading, empty, error, and ready as separate branches. Do not show a ready count of zero while `isLoading` is true.
4. Hand behavior coverage to `frontend-testing`.

## Hard rules

- Public chrome uses `brutal-bg`, `brutal-ink`, `brutal-muted`, `font-serif` for titles, and `border-brutal-ink`. Do not introduce a new palette (`bg-indigo-600`, `text-rose-600`) on a public component.
- Admin screens use the gray dashboard classes already on those pages. Do not restyle an admin tool into the public brutalist page inside an unrelated change.
- Merge incoming `className` with `cn` from `@/lib/utils`.
- Icons come from `lucide-react`. A decorative icon is `aria-hidden`. An icon-only control has an `aria-label`.
- Forms use Zod plus React Hook Form, as `ContactForm` and the admin login do.
- The contact form keeps its honeypot field (`website`). Do not post that field, and do not remove it when editing the form.
- Interactive targets on the public site stay at least 44px tall. Contact inputs use `min-h-[48px]`.
- Do not add a component library. There is no shared `Button`, `DataTable`, or `ConfirmDialog` package. Compose with the classes the sibling already uses.

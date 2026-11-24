---
name: ui-ux-layout
description: >-
  Lay out gogir-labs pages inside the public header and footer, the 12-column
  layout grid, and the admin dashboard shell. Use when building or changing
  screens, lists, detail pages, forms, empty states, responsive layout,
  spacing, alignment, visual hierarchy, or page structure in gogir-labs-fe.
---

# UI/UX Layout

Lay out pages with the shell that already exists. A new public screen is a column between `Header` and `Footer`, not a new frame.

The personal `design-systems` skill still owns semantic HTML, ARIA, and generic component rules. This skill owns spatial structure, hierarchy, density, and the page recipes for this site.

## Precedence

1. `Header`, `Footer`, `layout-grid`, and the classes already used on the nearest sibling page
2. This skill
3. A one-off layout only when no existing region covers the job

Read the matching reference before writing layout code:

| Task | Read |
| --- | --- |
| Shell, scroll, gutters, page stack | [shell-and-regions.md](shell-and-regions.md) |
| Space, type, surface, alignment | [rhythm.md](rhythm.md) |
| Home, list, detail, form, empty, admin | [screen-patterns.md](screen-patterns.md) |
| Review a layout before finishing | [layout-review.md](layout-review.md) |

## Workflow

1. Name the page class: home, list, detail, form, article, or admin.
2. Keep public navigation in `Header`. The page owns the content column only.
3. Open a public page with `Header`, then `<main className="flex-grow">`, then `Footer`.
4. Use `layout-grid` when the page is a 12-column composition. Use `max-w-content` when it is a single reading column.
5. Specify loading, empty, error, and populated layout together.
6. Check the `lg` nav breakpoint and the page's own breakpoint. Run [layout-review.md](layout-review.md) before finishing.

## Page stack

```tsx
<div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
  <Header />
  <main className="flex-grow">
    {/* one h1, then the primary region */}
  </main>
  <Footer />
</div>
```

Admin pages do not use this stack. They use the gray dashboard frame in `components/admin/Dashboard.tsx`.

## Hierarchy

Each page has one job. Order regions by that job:

1. Identity: one `h1` and the one line that says what this page is.
2. Primary action: one control (open the project, read the post, send the message, subscribe). Secondary links stay quieter.
3. Primary region: the work, the writing, or the form.
4. Supporting regions: filters, related posts, metadata. They never outrank the primary region in size or position.

Scan path is top to bottom, then left to right. On a split layout the decision content stays in the wider start column.

## Density

Public pages are editorial. Sections breathe. Admin pages are compact.

- Public sections separate with `py-16`, `md:py-24`, or `space-y-section` (4rem). Do not tighten a marketing section to an operations dashboard.
- Do not wrap every block in a card. A bordered panel is for a distinct object (project, post, form). Prose sits on the canvas.
- One accent. Public pages are ink on white. `orangered` is for contact inputs and the existing glow, not for a second brand color. Status color is for status only.

## Hard rules

- Public content width is `layout-grid` (`max-width: 1400px`) or `max-w-shell` / `max-w-content`. Do not add another max-width wrapper around a page that already uses one of these.
- Page gutters come from `layout-grid` or `px-6 lg:px-8` on the shell. Do not add a second horizontal page padding.
- The document scrolls. Do not put `overflow-auto` on the whole page. Scroll a region only when that region is a long admin table with a bounded height.
- Public headings use `font-serif` and `text-brutal-ink`. Do not invent `text-[Npx]` for chrome when a sibling size already exists. The home hero is the one place a large custom size is allowed; match it, do not add a second hero scale.
- Space comes from the scale in [rhythm.md](rhythm.md). Arbitrary values such as `p-[13px]` or `gap-[18px]` are layout bugs.
- Interactive targets on the public site stay at least 44×44px. The header menu button matches that.
- Admin content uses `max-w-7xl` inside its own shell, matching the dashboard. Do not also mount `Header`.

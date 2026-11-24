# Shell and regions

## Public frame

`Header` and `Footer` are the public frame. Pages compose them. There is no `AppShell`.

```
min-h-screen flex flex-col bg-brutal-bg
├── Header (sticky, z-50, h-16, border-b, max-w-shell, px-6 lg:px-8)
├── main.flex-grow
│     └── page
└── Footer (mt-auto, border-t, bg-brutal-ink, max-w-shell)
```

`Header` shows the wordmark, the nav, search, and social links from `lg` up. Below `lg` the nav is the off-canvas menu. Pages do not render a second nav, a sidebar, or a second footer.

`ScrollProgress` is mounted in `app/providers.tsx`. Do not add another progress bar.

## Admin frame

Admin pages are a separate shell: `min-h-screen bg-gray-50`, a white top bar, and `max-w-7xl` content. They do not render `Header` or `Footer`. A link back to `/admin` is the way between admin tools.

## Scroll

The document scrolls. `main` is `flex-grow`, not a second viewport scroller.

Do not use `h-screen` on a public page. The column is already `min-h-screen`. `h-screen` clips the footer.

A region scroller is allowed only for a long admin table or log with an explicit max height. The page title stays outside that scroller.

## layout-grid

Defined in `app/globals.css`.

| Property | Role |
| --- | --- |
| 12 columns, `minmax(0, 1fr)` | Editorial composition |
| `max-width: 1400px`, centered | Same width as `max-w-shell` |
| padding `min(1.5rem, 6vw)`, `2rem` from `lg` | Page gutter |
| `column-gap: 1.5rem` | Between columns |

Use it for home and other multi-column public pages. A reading page (a post, a project write-up) can use `max-w-content` (`1200px`) inside `main` instead of stretching prose across 1400px.

Do not override the grid max-width for a normal page. Full-bleed is only for a band that is intentionally edge to edge, and the type inside it still aligns to the grid.

## Regions

| Region | Placement | Contains |
| --- | --- | --- |
| Header | First in the page column | Wordmark, nav, search. Not page actions |
| Identity | First block in `main` | One `h1`, one supporting line |
| Toolbar | Directly above a list | Search, category filters, result count |
| Primary | Next, largest block | Grid, article, form |
| Rail | Beside the primary block at `lg`, below it when narrow | Related work, metadata |
| Footer | After `main` | Newsletter, social, short bio |

Filters that change a list sit in the same section as the list. Do not put filters in a rail unless the filter set is a long form.

## Nested routes

Project and post routes stay inside the same header and footer. Back navigation is a link in the content, not a second bar between `Header` and the title.

## Banners

`ConsentBanner` is site-level. Page-level errors sit in the primary region, full content width. Do not float a toast-shaped strip over the grid. This site has no toast provider. Feedback stays in the form or the section.

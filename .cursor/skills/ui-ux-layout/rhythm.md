# Rhythm

Space, type, and surface follow the brutalist public scale. New layout values land in `tailwind.config.ts` or `app/globals.css` before they appear on a page.

## Space

| Token | px | Use |
| --- | --- | --- |
| `2` | 8 | Icon-to-label, tight stacks inside a control |
| `4` | 16 | Default control padding, gap between related lines |
| `6` | 24 | Grid gaps, `inner` padding, `layout-grid` column gap |
| `8` | 32 | Shell horizontal padding from `lg`, gaps between header clusters |
| `12` | 48 | Footer padding, separation inside a long section |
| `16` / `py-16` | 64 | Public section padding. `section` in Tailwind is also 4rem |
| `inner` | 24 | Card and container padding |
| `section` | 64 | Vertical rhythm between major public regions |

`py-16 md:py-24` is the home section inset. Do not also add `pt-8` on the same section.

Pick gap by relationship:

- Same object (label + value): `gap-2` or `space-y-1` / `space-y-2`
- Siblings in one group (cards, fields): `gap-6` or `space-y-5` on forms
- Separate regions: `py-16` or `space-y-section`

A card grid uses the same gap on both axes. Do not pair `gap-x-8` with `gap-y-3` unless the rows are a table.

## Alignment

- Text and controls in a region share one left edge, the grid padding, except the home hero which centers its column on purpose.
- Do not center a long article. Center an empty state inside its region.
- Stretch cards in a row to equal height.
- Numeric admin columns are end-aligned. Labels stay start-aligned.

## Type

Public headings are `font-serif`, `font-semibold`, `tracking-tight`, `text-brutal-ink`. Body is `font-sans` (Inter), `text-brutal-ink` or `text-brutal-muted`.

| Role | Treatment |
| --- | --- |
| Page `h1` | Serif, one per page. Home may use the existing large hero size |
| Section label | Serif, smaller than the `h1` |
| Body | Sans, relaxed leading, `text-brutal-ink` or `text-brutal-muted` |
| Meta | Smaller sans, `text-brutal-muted` |
| Nav | The `brutal-nav-link` class. Uppercase. Do not restyle one item |

One primary size per region. Do not set three heading sizes inside one card.

Line length for a post or about copy stays in `max-w-content` or a prose column, not the full shell.

Admin type stays with the dashboard: gray scale, sans, compact. Do not apply `font-serif` display titles inside admin tables.

## Surface

| Token | Role |
| --- | --- |
| `brutal-bg` `#FFFFFF` | Page background |
| `brutal-ink` `#111111` | Text, rules, footer fill |
| `brutal-muted` `#4A4A4A` | Secondary text |
| `orangered` | Contact field borders and the existing accent. Not a general link color |
| Footer | `bg-brutal-ink text-white` |

Public panel recipe:

```
border border-brutal-ink bg-brutal-bg
```

Rules are 1px ink, not soft gray cards. Radius stays square on public chrome. Do not introduce `rounded-3xl` on the public site.

Admin panels keep `bg-white`, `shadow-sm`, and `dark:` pairs already on those screens.

## Dividers vs space

Prefer a full-bleed `border-b border-brutal-ink` between public bands, as the home sections do. Prefer space inside a band.

- Header: `border-b border-brutal-ink/15`
- Footer: `border-t border-brutal-ink`
- Form fields: error text under the field in a risk color. Do not overlay the next field.

## States that affect layout

| State | Layout |
| --- | --- |
| Loading | Same regions as loaded. No zero counts. |
| Empty | Header and `h1` stay. The primary region is the empty state. |
| Error | The failed region shows the message. Do not leave a half-rendered grid beside a full-page error. |
| Disabled | Keep the control in place. |

Focus must stay visible. Do not remove the outline on inputs without a replacement ring.

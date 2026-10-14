# Layout review

Run this before finishing a page or a layout change. Fix failures in the page. Do not add a one-off override that only masks one breakpoint.

## Structure

- A public page renders `Header` and `Footer`. It does not reimplement the nav.
- An admin page does not render `Header` or `Footer`.
- There is one `h1`.
- One primary action. Other actions are quieter.
- Regions follow identity, then primary, then supporting. On small screens they stack in that order.
- Content width is `layout-grid`, `max-w-shell`, `max-w-content`, or the admin `max-w-7xl`. Gutters are not doubled.

## Rhythm

- Distances are from the scale in [rhythm.md](rhythm.md). No `p-[13px]` or `gap-[18px]`.
- Public bands use the section padding or `border-b border-brutal-ink`.
- Public cards in one grid share border, padding, and type.
- Public titles are serif. Body is sans. Nav stays uppercase.
- `orangered` is the contact accent. It is not a second brand color on cards and links.

## Behavior

- Loading does not show a fake zero.
- Empty and error states keep the page shell.
- A filtered empty state is different copy from a first-use empty state.
- Lists do not force horizontal scroll below `md` unless the remaining columns are still too wide.
- The page is not `h-screen`.
- Icon buttons are at least 44×44. Focus stays visible.
- The mobile menu still traps focus and closes on Escape. Do not break that when editing `Header`.

## Breakpoints to check

| Width | Expect |
| --- | --- |
| 375px | One column. Nav is the menu button. No clipped header actions. Primary action reachable without horizontal scroll. |
| 768px | Two-up card grids where the list uses two columns. No overlap with the menu. |
| 1024px | Desktop nav is visible. Menu button is hidden. Multi-column `layout-grid` spans match the sibling. |
| 1280px and up | Content stays inside 1400px and centered. Rails do not wrap under the primary column. |

## Regression

If the change touches `Header`, `Footer`, `layout-grid`, or `globals.css` brutalist rules, open the home page and one list page and confirm the header, gutter, and scroll did not shift.

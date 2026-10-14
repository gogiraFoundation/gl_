# Screen patterns

Pick one pattern per page. A detail page may contain a list of related items. Do not invent a third geometry.

## Home

A sequence of full-width bands inside `main`. The first band is the hero: `layout-grid`, one `h1`, one paragraph, one primary link. Later bands are expertise, impact, and a closing link. Each band has a `border-b border-brutal-ink` except the last before the footer.

Do not add a metric row, a sidebar, or a card grid to the hero.

## List

Portfolio, blog, and search.

1. `Header`, then an identity block with the collection name.
2. Toolbar: search or filters, then the result count as muted meta.
3. Card grid or post list.
4. Empty state when the filtered set is empty. "No posts yet" is different copy from "Nothing matches these filters".

Card grid: equal tiles, title plus two or three facts. Hide low-priority facts before forcing horizontal scroll. The card links to the detail route. Do not put more than two icon actions on a card.

## Detail

A project or a post.

1. Identity: the record title as `h1`, one status or date line.
2. The work: images, body, links to the live site or repository.
3. Related records after the body, not beside the title on small screens.
4. At `lg`, a rail may hold metadata. It stacks under the body when narrow.

Long prose stays in a content column. A single long URL does not get wrapped into a narrow side column.

## Form

Contact, newsletter, testimonial submit, admin login.

- Label above the control, a small gap, then the field. `space-y-5` between fields.
- Short paired fields may sit in two columns from `sm`. Textareas span the full column.
- Errors sit under the field. The section grows downward.
- Actions are the last row. On narrow screens the primary button is full width.
- Contact inputs keep `min-h-[48px]`, the ink text, and the `orangered` border.

A settings screen in admin is a form, not a public landing page.

## Article

Blog post body uses the existing `PostContent` width. Related posts come after the article. Share controls do not outrank the title.

## Empty and status

Empty states replace the primary region and keep the `h1`.

- One sentence that names what is missing.
- One action when the visitor can fix it (clear filters, go to contact).
- Center inside the region, not on the viewport.

Not-found and verify/unsubscribe results still use `Header` and `Footer` when they are public.

## Admin

Dashboard, analytics, comments, contact inbox, newsletter, notifications, preferences.

- No public header.
- Top bar with the tool name and a way back to `/admin` or logout.
- Content in `max-w-7xl px-4 sm:px-6 lg:px-8`.
- Tables are full width of that column. Sticky headers stay inside the table, not the viewport.
- One primary admin action per screen. Destructive actions are separate and named.

## Overlay

This site has no dialog system. A small confirm stays in the admin page flow. Do not add a modal library for a single confirm. The mobile nav panel in `Header` is the existing overlay; do not build a second one for page content.

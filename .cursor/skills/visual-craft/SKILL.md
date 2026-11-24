---
name: visual-craft
description: >-
  Visual craft for gogir-labs: spacing grid, type measure, contrast,
  control states, motion, and page copy. Use when polishing layout, spacing,
  hierarchy, hover and focus, empty states, or microcopy in gogir-labs-fe.
  Defer to ui-ux-layout and frontend-ui for the shell and the brutalist tokens.
---

# Visual craft

Spacing, type, states, and sentences. This skill does not choose the page frame or the palette.

## Precedence

1. `product-design` for the job and the words that make a claim
2. `ui-ux-layout` for the shell, grid, and brutalist rhythm
3. `frontend-ui` for components, forms, and strings
4. This skill for states, contrast, motion, and measure when those skills are silent

Do not introduce a second palette, a new font, or a marketing layout on an admin screen. Public type stays `font-serif` for headings and Inter for body. Nav stays uppercase. Contact fields stay `orangered`. Admin stays on the gray dashboard classes.

## Spacing

Use the scale already in `ui-ux-layout`: 8, 16, 24, 32, 48, 64. `4px` is only an icon inset or a badge. Values such as `13px`, `17px`, and `p-[13px]` are bugs.

Related items share a group. Unrelated bands sit further apart (`py-16` or `space-y-section`) before you shrink the type.

## Type

- One `h1` per page, serif, as the layout skill says.
- Body copy on a post or about column stays near 45–75 characters. `max-w-content` or a prose column does that. Tables and the header are exempt.
- Do not set body text below 16px on a phone.
- Do not add a new Google font.

## Contrast and status

Body text on `brutal-bg` uses `brutal-ink` or `brutal-muted` and stays at least 4.5:1. Large serif headings can sit at 3:1. An icon that is the only label needs an `aria-label` and a 3:1 control contrast.

Status is icon or text plus colour. A red border alone is not an error. A green dot alone is not success.

## Controls

Every button and link that is not plain text needs a visible default, a hover that does not invent a new colour, and a focus ring. Do not remove `outline` without a replacement. Disabled means the control stays put and does not look clickable. If it is disabled because something failed, the sentence next to it says why.

Primary actions on a phone sit where the thumb reaches them when the sibling page already does that. Do not pin a second sticky bar under the header.

## Motion

Transition specific properties (`opacity`, `transform`, `background-color`). Do not use `transition: all`. Motion explains a state change. Honour `prefers-reduced-motion: reduce` on anything that loops or travels, including marquees already in the theme.

## Copy

Sentence case. The verb is the button. Errors say what failed and the next step, in the form, not as a browser `alert` and not as a raw DRF `detail` string.

A repeated submit that the server treats as already done ("already subscribed") is a calm success or a neutral line, not a new error style.

Marketing lines on the home page name an outcome the portfolio or the post can open. They do not use "seamless", "next-gen", or "AI-powered".

## Check

- [ ] Spacing is on the existing scale
- [ ] One primary action
- [ ] Serif headings, sans body, uppercase nav only
- [ ] Reading width on long copy
- [ ] Focus visible, hover does not invent a colour
- [ ] Status is not colour alone
- [ ] No `transition: all`; reduced motion still readable
- [ ] 375, 768, and 1280 still match `ui-ux-layout`

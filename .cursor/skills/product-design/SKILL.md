---
name: product-design
description: >-
  Decide what a gogir-labs screen is for, who it is for, and what it must
  show before layout or copy. Use when adding or changing a feature, flow,
  page, empty state, admin tool, information architecture, primary action,
  or user-facing wording.
---

# Product design

This site is Emmanuel Ugbaje's public record of work: software, data, and the writing around it. A visitor should be able to see the work, read the writing, and get in touch. The owner should be able to run the site from admin.

Design the decision before the screen. `ui-ux-layout` places regions. `frontend-ui` builds the components. This skill chooses the job, the reader, the proof, and the next action.

## Precedence

1. A destination and a reader that already exist
2. The principles in [principles.md](principles.md)
3. This skill's decision rules
4. A new surface only when no existing page can carry the job

Read the matching reference before specifying the feature:

| Task | Read |
| --- | --- |
| What leads, what is buried, what must be provable | [principles.md](principles.md) |
| Visitor and owner | [actors-and-scope.md](actors-and-scope.md) |
| Information architecture, actions, copy, states | [decisions.md](decisions.md) |
| Check before shipping the interaction | [product-review.md](product-review.md) |

## Workflow

1. Write the job in one sentence the reader would say. If it does not name a project, a post, a message, or an admin task, the job is not ready.
2. Name the reader: public visitor or site owner. Owner-only data on a public page is a product bug.
3. Order the content with the principles: the work first, then the proof, then the person, then the plumbing.
4. Pick one next action. It opens the work, sends a message, or completes an admin task.
5. Specify the states in [decisions.md](decisions.md): first use, filtered empty, failure, success.
6. Write the words in [decisions.md](decisions.md). Then hand the structure to `ui-ux-layout`.

## Job statement

```
[Reader] needs to [decide or complete X] so they can [outcome].
```

Examples that match the site:

- A visitor needs to open a project and see what was built, so they can judge the work.
- A visitor needs to send a message with their name and email, so the owner can reply.
- The owner needs to see which contact messages are unanswered, so they can reply from admin.

Reject jobs that are only "add a widget" unless the widget is the proof (a project card, a post, an analytics count the owner acts on).

## One next action

Each surface has one verb: view the project, read the post, send the message, subscribe, reply. Secondary verbs stay as text links.

Owner-only verbs (publish, reply, export, purge, invite a testimonial) are never the primary action on a public page. They live under `/admin`.

## What not to add

- A new top-level nav item for a job an existing destination already owns. Public destinations are Home, Portfolio, Blog, About, Resume, Contact. Search lives in the header. Newsletter lives in the footer. Testimonials, privacy, and verify links are reached from their flows.
- A public metric that is not backed by a project, a post, or a number already on the page.
- Account signup, billing, comments as a social network, or a second brand. The contact form and the newsletter are the conversion paths.
- Owner tools in the public header.

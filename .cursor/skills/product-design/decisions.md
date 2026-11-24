# Decisions

## Where the job lives

| Job | Surface |
| --- | --- |
| What he builds, in one sitting | `/` |
| The set of projects | `/portfolio` |
| One project | `/portfolio/[slug]` |
| The set of posts | `/blog` |
| One post | `/blog/[slug]` |
| Career narrative | `/about`, `/resume` |
| Reach him | `/contact` |
| Find a page | `/search` in the header |
| Hear about new posts | Footer newsletter, `/newsletter/subscribe` |
| Confirm or leave the list | `/newsletter/verify/[token]`, `/newsletter/unsubscribe` |
| Leave a testimonial | `/testimonials/submit/[token]` |
| Read testimonials | `/testimonials` |
| Run the site | `/admin` and its child routes |

Do not create a parallel "highlights" page. Highlights belong on the home page or on the project.

A project page order stays: name and summary, then the work, then links, then related projects.

## Counts and claims

Every public count is a set the visitor can open, or a figure already tied to a named outcome.

- The label names the set: "Projects", not "Impact index".
- Zero is a valid empty state. Show a sentence, not a fake "0" hero.
- Do not add a percentage unless the denominator is on screen.
- Admin analytics counts are for the owner. They do not get repeated on the home page.
- Time on a post uses `formatDate`. Do not write "just now" without a timestamp.

## Actions

| Kind | Placement | Confirm |
| --- | --- | --- |
| Open a project or post | The card or the title | No |
| Send a message | Contact | No. Show success on the form |
| Subscribe | Footer or subscribe page | No. Say that they must verify if the flow requires it |
| Reply, publish, delete | Admin | Yes when the action removes or sends something the owner cannot undo |
| Log out | Admin bar | No |

Confirmation copy names the object and the consequence. "Delete this comment?" is a decision. "Are you sure?" is not.

After a successful action, the surface shows the new state. A success line on the form is the record. There is no toast system.

## States

| State | Message | Action |
| --- | --- | --- |
| First use | What is missing, in the visitor's terms | The verb for that job, if this reader can do it |
| Filtered empty | "Nothing matches these filters" | Clear filters |
| No admin session | Ask them to sign in | Link to `/admin/login` |
| Submit failure | What failed and what to do | Try again. Keep the fields |
| Submit success | What happens next | None, or a link back to the list |
| Loading | No claim yet | No numbers, including placeholder zeros |
| Verify or unsubscribe | What happened to this address | A link home |

Loading must not flash a zero that then becomes a count.

## Copy

Voice is British English, calm, and specific. The public voice is a personal site, not a SaaS console.

- Sentence case for titles, buttons, and labels. Nav items stay uppercase because the header is set that way.
- Button is the verb: "Send message", "Subscribe", "View project".
- Titles name the object: "Portfolio", "Contact", the post title.
- Errors say what happened and what to do. Do not say "Oops".
- Empty states are one sentence plus one action.
- Do not use "AI", "smart", or "magic" for a filter or a sort. Name the rule.
- Dates use `formatDate` (`en-GB`).

## Forms that collect an address

Say what the address is for, next to the field or in the section: a reply, or the newsletter. The contact honeypot stays invisible. Required fields are marked. Optional name on the compact newsletter stays optional.

## Scope of the product

Do not design public signup, billing, a client portal, or a second blog. Access to admin is the owner's login, not a request-access flow.

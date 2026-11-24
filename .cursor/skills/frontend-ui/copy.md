# Copy

## Which system

Strings are British English in the component. There is no i18n catalogue. Do not add `useTranslation` for one label.

## Voice

Sentence case for titles, buttons, and body. The public nav is the exception: `Header` renders HOME, PORTFOLIO, BLOG, ABOUT, RESUME, CONTACT in capitals. New nav items match that. Body copy does not shout.

Button text is the verb. Errors say what failed and what to do: "Message did not send. Try again." Do not say "Oops" or show a status code as the message.

Dates go through `formatDate` in `lib/utils.ts`, which uses `en-GB`. Do not call `toLocaleDateString()` with no locale.

Reading time uses `calculateReadingTime`. Do not invent a second word-count formula.

## Claims

Product rules for what the site may claim are in the product-design skill. Do not write "live", "trusted by", or a metric the page cannot point at.

## Newsletter and contact

Subscribe, verify, and unsubscribe copy stays specific: what will happen to the address, and what the person can do next. Do not promise a cadence the admin screen does not send.

# Forms and feedback

## Form

Schemas live next to the form component and use Zod. The form uses React Hook Form.

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(featureSchema),
  defaultValues,
})
```

- Every visible control has a `<label htmlFor=...>` whose text matches the field, unless the sibling is intentionally placeholder-led (compact `NewsletterForm`). Tests query with `getByLabelText` or that placeholder.
- Show the field error under the control. Do not toast a list of required-field messages.
- The submit button is `type="submit"` and `disabled` while `isSubmitting`. Keep the label as the verb ("Send message", "Subscribe").
- Contact keeps the hidden honeypot `website`. If it is filled, return without posting.

## Server errors

A failed `api.post` sets the form's error status and a short sentence, as `ContactForm` does. Field errors from the API map onto `setError` when the body names fields. A non-field failure stays on the form.

Do not `console.error` as the only feedback.

## Success

After a successful write, the form shows the new state in the page: a success line, a cleared form, or the updated admin row. Reset the form when the sibling does (`ContactForm` resets on success).

## Loading and empty

- `isLoading`: a skeleton or a quiet waiting state in the shape of the loaded block. No zero counts that will be replaced.
- `isError`: the section that failed shows the error and a way to retry that query. Leave sibling sections that succeeded.
- Empty: one sentence in the primary region. The page header stays.

## Admin confirms

A destructive admin action (delete a comment, purge data) names the object in the confirmation copy. "Are you sure?" is not enough. There is no shared dialog component; follow the confirm pattern on the nearest admin screen, or a short in-page confirm that states the object and the consequence.

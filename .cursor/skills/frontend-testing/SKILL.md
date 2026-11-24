---
name: frontend-testing
description: >-
  Write gogir-labs frontend tests with Jest and Testing Library. Use when
  adding or changing a unit test, component test, form test, or API mock
  in gogir-labs-fe.
---

# Frontend testing

Lock the behavior a change can break. The personal `testing-verification` skill says what is worth testing. This skill says how this repo runs those tests.

## Where it goes

Tests sit in a `__tests__` folder next to the source.

| Change | File |
| --- | --- |
| Pure function in `lib/` | `gogir-labs-fe/lib/__tests__/<name>.test.ts` |
| Component interaction | `gogir-labs-fe/components/<domain>/__tests__/<Name>.test.tsx` |

`jest.config.js` picks up `**/__tests__/**` and `*.test.*` / `*.spec.*`. Do not add a second root such as `src/__tests__`.

## Command

From `gogir-labs-fe`:

```bash
npm test
```

Coverage is `npm run test:coverage`. There is no coverage threshold to lower. Do not weaken an assertion to make a change pass.

## Workflow

1. Write the assertion against the role, label, or placeholder the user would hit.
2. Render with a `QueryClient` whose queries and mutations have `retry: false`.
3. `jest.mock('@/lib/api')` when the tree calls `api`. Return the shape the component reads.
4. Assert the outcome: the text, the disabled control, or the request the mock received. Do not assert a hook's internal variable.

## Render

Match `components/newsletter/__tests__/NewsletterForm.test.tsx`:

```tsx
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <AnalyticsProvider>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </AnalyticsProvider>
  )
}
```

Add `AnalyticsProvider` when the component calls `useAnalyticsEvent`. `jest.setup.js` already mocks `next/navigation`, `IntersectionObserver`, and `matchMedia`. Override a mock inside one test only when that case needs a different route.

## Queries

Prefer `getByRole` and `getByLabelText`. Use `getByPlaceholderText` when the existing field is identified that way, as the compact newsletter input is. Use `userEvent.setup()` for clicks and typing. `findBy*` or `waitFor` when the text arrives after the mocked request.

A loading assertion must run before the wait, or the test will only see the loaded state.

## What to lock

- The happy path the screen claims.
- The validation message when required fields are empty or the email is invalid.
- The success and error status after submit.
- The bug's failure mode, if this change is a fix.

## API mock

```tsx
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}))
```

`jest.clearAllMocks()` in `beforeEach`. Do not read or write the real backend from a test. Do not leave the mock pointing at Axios.

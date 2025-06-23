# hooks

Reusable custom React hooks for business and UI logic.

---

## Examples

### 1. Authentication
- `useAuth.ts` — Manages authentication state (login/logout, user info).
- `useRequireAuth.ts` — Redirects if user not logged in.

### 2. Data
- `useFetch.ts` — Fetch data from APIs with loading/error.
- `usePagination.ts` — Encapsulate pagination logic for tables.

### 3. Forms and UX
- `useFormFields.ts` — Handle input values and validation in forms.
- `useDebounce.ts` — Debounce a fast-changing value (like search input).
- `useCopyToClipboard.ts` — Copy data to clipboard.

---

## How to use

- Import your hook: `import useAuth from '../hooks/useAuth';`
- Compose in any component as needed.

---

## When to create a hook?

- When you need to reuse stateful or effect logic in several components.

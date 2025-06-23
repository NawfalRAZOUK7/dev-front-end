# pages

Top-level application pages (for routing).

---

## Examples

### 1. Auth
- `LoginPage.tsx` — Login form and logic.
- `RegisterPage.tsx` — User registration.

### 2. App Features
- `DashboardPage.tsx` — Main dashboard for authenticated users.
- `ProfilePage.tsx` — User profile (view and edit).
- `SettingsPage.tsx` — App or user settings.

### 3. Misc
- `NotFoundPage.tsx` — 404 error page.
- `LandingPage.tsx` — Public home page for marketing.

---

## How to use

- Map these pages to routes in your routing config (e.g., React Router, Next.js).

---

## Notes

- Each page should compose feature/UI components.
- Keep pages minimal: prefer importing logic from `hooks` and UI from `components`.

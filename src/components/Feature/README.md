# components/Features

Feature-oriented component groups—each subfolder is a **feature**.

---

## Examples

### 1. Auth Feature
- `Auth/`
  - `LoginForm.tsx`
  - `RegisterForm.tsx`
  - `useLogin.ts` (feature-specific hook)

### 2. Dashboard Feature
- `Dashboard/`
  - `StatsWidget.tsx`
  - `RecentActivity.tsx`
  - `DashboardHeader.tsx`

### 3. Table Feature
- `DataTable/`
  - `DataTable.tsx` — Full-featured table.
  - `TableFilters.tsx` — Filter bar for the table.
  - `useTableSort.ts` — Custom sorting hook.

### 4. Profile Feature
- `Profile/`
  - `ProfileCard.tsx`
  - `ProfileEditor.tsx`
  - `AvatarUploader.tsx`

---

## How to use

- Import features into pages as needed:
  ```tsx
  import LoginForm from '../components/Features/Auth/LoginForm';
  import DataTable from '../components/Features/DataTable/DataTable';

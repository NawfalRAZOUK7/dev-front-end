# types

Shared TypeScript types, interfaces, and enums.

---

## Examples

### 1. Domain Models
- `User.ts` — Shape of a user (`id`, `name`, `email`, etc.)
- `Product.ts` — Product data for e-commerce (for shopping cart features).
- `Post.ts` — Blog or forum post (for CMS, discussion board, etc.)

### 2. API and DTOs
- `ApiResponse.ts` — Generic API response wrapper.
- `LoginRequest.ts`, `LoginResponse.ts` — DTOs for authentication APIs.

### 3. Enums and Constants
- `UserRole.ts` — `enum UserRole { ADMIN, USER, GUEST }`
- `Status.ts` — For things like "pending", "approved", etc.

---

## How to use

- Import types from here everywhere:  
  `import { User } from '../types/User';`

---

## Notes

- Never put logic in this folder—**only types and interfaces**.

# Progress

- Admin auth hardcoded fallback removed; only `ADMIN_EMAILS` can authorize admins now.
- Admin login/session flow stays server-side verified through Firebase token checks.
- `app/actions/adminSession.ts` creates the secure admin cookie after verification.
- `middleware.ts` protects admin routes by checking the verified admin session cookie.
- `.env.local` now has the two admin emails in `ADMIN_EMAILS`; passwords are not stored in env and must stay in Firebase Auth.
- Firebase custom claims are skipped for now, as requested.
- If any old hardcoded admin email or stale secret appears later, delete it before pushing.
# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-08
**Branch:** main (all work committed, not pushed)

---

## Commits This Session

```
f896a2a  refactor: collapse signup and login into single magic link auth page
55fa146  fix: hide login heading after magic link sent
d5cbdfb  refactor: switch auth from magic link to email OTP
6768a24  fix: 8-digit OTP support + individual digit input boxes
a5d7d85  feat: individual digit OTP input boxes + copy cleanup
7c4d1c1  fix: OTP input width, always-enabled verify button, error handling
77f83d9  fix: OTP digit box width alignment and typography
044d9b5  fix: auth form max-width 400px with square digit boxes
c3e7e80  fix: larger OTP digit font size
ab5a9d2  fix: React Aria hydration mismatch on login page
7e0df3b  fix: disable API docs button until route exists
```

---

## What We Completed

### Auth consolidation and OTP flow
- Collapsed `/signup` and `/login` into a single page at `/login`
- `/signup` now redirects to `/login`
- All landing page CTAs (nav, hero, closing CTA) updated from `/signup` to `/login`
- Removed "Already have an account?" / "Don't have an account?" cross-links

### Magic link → email OTP
- Replaced magic link flow with 6-digit email OTP verification
- User never leaves `/login` — two-step flow: email input → code input → dashboard redirect
- Deleted `/auth/callback` route (was only used for magic link code exchange)
- Uses `signInWithOtp()` to send code, `verifyOtp({ email, token, type: 'email' })` to verify
- 6 individual digit input boxes in 3-3 layout with dash separator
- Auto-advance on input, backspace navigation, paste support, arrow key navigation
- `autoComplete="one-time-code"` on first box for mobile autofill
- Resend code link with 60-second cooldown
- "Use a different email" resets to email input step
- Unified error message for invalid/expired codes (Supabase may conflate them)
- `console.error` logs full Supabase verifyOtp error for debugging

### UI polish
- Auth form container: `max-w-[400px]`, `px-6`
- Digit boxes: `aspect-square`, `flex-1`, `min-w-0` for square proportions
- Digit typography: `text-2xl`, `font-normal` (400), `color: #374151` (gray-700)
- Fixed React Aria hydration mismatch with client-only mount guard

### Dashboard fix
- Disabled "View API docs" button on "Build manually" card (route doesn't exist yet)
- Changed to "API docs — coming soon" with `isDisabled`

### Decisions recorded
- D-58: Single auth page at /login, no separate signup
- D-59: Auth uses email OTP verification, not magic links

---

## Gotchas for Next Session

1. **Supabase email template must be OTP-configured** — The Supabase dashboard (Authentication > Email Templates) needs to use `{{ .Token }}` in the email template, not `{{ .ConfirmationURL }}`. If it still sends a magic link instead of a 6-digit code, toggle the template.

2. **OTP code length is 6** — `CODE_LENGTH = 6` in `magic-link-form.tsx`. If Supabase sends a different length, update this constant and `GROUP_SIZE` (currently 3 for a 3-3 split).

3. **Supabase may conflate invalid and expired OTP errors** — We use a single error message for both. The `console.error` in `handleVerifyCode` logs `{ message, code, status }` from Supabase to help debug. Check browser console if users report issues.

4. **React Aria hydration fix** — `EmailOtpForm` returns `null` on server render and only mounts client-side. This is intentional to prevent React Aria `useId` mismatches. Don't remove the `mounted` guard.

5. **File is still named `magic-link-form.tsx`** — Component was renamed to `EmailOtpForm` but the file kept the old name. Rename to `email-otp-form.tsx` if desired (would need import updates in `login/page.tsx`).

6. **11 unpushed commits** — All on `main`, not yet pushed to remote.

---

## Uncommitted / Untracked Files

- `SMOKE_TEST_BUGS.md` — smoke test bug list (reference only, predates this session)
- `docs/plans/2026-03-05-landing-page.md` — landing page plan from prior session

---

## Active Build Context

Active PRDs per CLAUDE.md: PRD_06 (dashboard), PRD_01 (intake), PRD_03 (compliance site), PRD_05 (deliverable). Phase 2 PRDs remain out of scope.

DECISIONS.md has 59 decisions loaded (D-58, D-59 added this session).

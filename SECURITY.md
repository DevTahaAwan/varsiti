# Security Deployment Checklist

## Authentication

- Password storage, email verification, password reset tokens, session lifetime, bot protection, and login abuse controls are handled by Clerk for this app.
- In Clerk Dashboard, require verified email addresses before session creation, enable leaked-password protection, set idle session timeout and maximum session lifetime, and keep sign-in/sign-up bot protection enabled.
- Keep `CLERK_SECRET_KEY` and `CLERK_WEBHOOK_SECRET` only in server environment variables. Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` belongs in frontend code.

## Secrets

- Real secrets were found in local `.env.local`. The file is ignored by git, but these values should be rotated because they exist on disk.
- Store production secrets only in the deployment provider environment manager. Do not commit `.env.local`, service-role keys, OpenRouter keys, Clerk secrets, or EmailJS private keys.
- Use `.env.example` for names only.

## Supabase

- Run `supabase/security-hardening.sql` in Supabase before production deploy.
- The app uses the Supabase service-role key only from server-only modules. User-owned tables are always filtered by Clerk `userId`.
- Keep direct table access to `users`, `user_progress`, and `user_ai_usage` revoked from `anon` and `authenticated`; only public course content should be readable with the anon key.
- Restrict database/network access in Supabase project settings where available, and keep the service-role key out of browsers and logs.

## Deployment

- Deploy behind HTTPS only. `next.config.ts` adds HSTS, secure browser headers, and production HTTP to HTTPS redirects.
- Enable provider logs/alerts for 401/403 spikes, 429 spikes, API 5xx spikes, and repeated Clerk webhook verification failures.
- Review CSP reports after deployment before tightening `script-src` further because Clerk and Monaco may require inline scripts/workers.

## Monitoring

- Authentication, API errors, rate-limit events, usage-limit events, webhook failures, and provider failures are logged as structured JSON.
- Forward server logs to the deployment provider or a log drain and alert on unusual traffic patterns.
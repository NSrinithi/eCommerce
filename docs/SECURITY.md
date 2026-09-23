# Security boundaries

This is a reusable starter, not a complete production security review.

## Included

- bcrypt password hashing; minimum 12 characters; no silent bcrypt 72-byte truncation.
- Explicit input types/lengths and allowlisted update fields. Browser input is not trusted.
- No public role selector or client-controlled admin role.
- JWT verification restricted to HS256, expected issuer and audience, expiry, user and session.
- HTTP-only cookie; Secure in production; SameSite=Lax; path=/api.
- MongoDB session revocation on logout and expiry checked on each protected request.
- Auth endpoints rate-limited; all APIs have a basic per-process rate limit.
- Mutation custom header + origin allowlist, restricted CORS and JSON request size.
- Record ownership enforced in backend queries.
- Generic public 500/login errors; no password/token/URI logging.

## Deliberate limits

No password reset, email verification, MFA, OAuth, refresh-token rotation, multi-tenant roles,
audit log, virus scanning, file upload, payment handling or distributed rate-limit store.
JWT is a signed format, not encryption. Cookie JavaScript cannot read it, but injected same-origin JavaScript can still send requests.

## Before publishing

Use HTTPS. Set correct CLIENT_ORIGINS and NODE_ENV=production. Keep secrets in your deployment secret store.
Set TRUST_PROXY only for the actual trusted proxy topology. If serving frontend and API on different sites,
review SameSite/cross-site cookies, CORS and CSRF together; this starter defaults to one site, not every deployment layout.
Use a distributed rate limiter for multiple backend instances. Consider Argon2id for a new production password policy;
bcrypt is retained here to match the training/reference stack.
Lock reviewed dependency versions after installation, run audit/tests, add backups and email/account recovery before real users.

The optional compose database has no credentials and binds localhost only. Do not use it as a public database configuration.

References:
- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie

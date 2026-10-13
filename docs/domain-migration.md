# Public domain migration: wolin.dev → wolin.studio

Prepared from remote main c3a8ab8e48ff867536d623aca65eed8e9fcdc4f6, verified October 13, 2026. Cloud checkout was clean; no AGENTS.md or local skills were found. Branch: migration/wolin-studio-public. Nothing pushed, merged, deployed, or changed in accounts.

## Prepared code

Six commercial routes retain their paths and appearance: /, /offers, /social-media-management, /web-design, /service-areas, /marketing. Canonical links, Open Graph URL, Organization/Service schema IDs and URLs, sitemap locations and robots sitemap discovery now reference https://wolin.studio. The admin brand link points to the new public home. Prerendered demo Open Graph URLs follow the new public origin. Private noindex metadata and headers, route ordering, signing links, email bodies and senders are unchanged. SEO checks assert the new host in schema, canonical, Open Graph and robots.

This branch is preparation only: it changes public canonicals as soon as deployed, so do not publish it before the new domain and redirect plan are ready.

## Dependencies and preserved behavior

- React 19 / Vite 8 / TypeScript 6 static build plus SSR prerendering; Vercel Node APIs and ordered vercel.json routes. npm lockfile retained. No GitHub deployment workflow found in source; last production deployment was manual because the GitHub trigger did not fire. Verify deployment explicitly rather than assuming push publishes.
- Public contact form posts to relative /api/visibility-report. It will use wolin.studio on the new site; no CORS change is required by current code. Handler sends via Resend from reports@wolin.dev to Caleb's existing Gmail and uses the submitted reply address. Existing email text is retained.
- Admin default ADMIN_BASE_URL is https://admin.wolin.dev. Login verification endpoint is /api/admin?action=verify&token=...; callback returns to that base URL. Custom HMAC authentication uses SESSION_SECRET, ADMIN_EMAIL, and a host-only wolin_admin_session cookie: Path=/; HttpOnly; Secure; SameSite=Lax; seven-day expiry. No Domain attribute; cookies cannot migrate to a different domain. No application OAuth or Supabase Auth login flow found. Supabase is server-only using SUPABASE_URL and SUPABASE_SECRET_KEY, with session persistence and URL detection disabled. Local Supabase config is not evidence of production Auth settings.
- Signing URLs in admin emails, completion emails and legacy admin-host signing navigation remain https://wolin.dev/sign/{token}. Relative signing API calls stay same-origin. Existing signed documents, tokens, PDFs, snapshots and payment references remain untouched.
- Stripe payment links use buy.stripe.com. Preserve /api/stripe-webhook on its current host and all Stripe product/link IDs, HMAC references, invoice/subscription configuration. Account worker must inspect webhook endpoints and any payment success/cancel/return URLs; these are not fully represented in source.
- Required production variable names: ADMIN_BASE_URL, ADMIN_EMAIL, SESSION_SECRET, RESEND_API_KEY, SIGNING_FROM_EMAIL, SUPABASE_URL, SUPABASE_SECRET_KEY, STRIPE_RESTRICTED_KEY, STRIPE_WEBHOOK_SECRET. Keep existing values and environment scope. Never copy secrets into reports or frontend variables.
- Keep all wolin.dev email identities and DNS records, including reports@wolin.dev and external Mac mini redrover@wolin.dev. Preserve MX, SPF, DKIM, DMARC, mail routing, Resend settings and Hunter campaign content/settings/links. No Hunter integration or analytics/advertising/captcha scripts were found in application source; account settings remain an external dependency.
- Public/internal navigation is mostly relative. Portfolio /calebwolin and /sample audit display the legacy wolin.dev wordmark; retained to preserve appearance. Package name, Supabase local project name and historical audit documents remain unchanged.

## Proposed redirects and exceptions requiring coordination

Recommended first cutover: keep admin.wolin.dev and signing on wolin.dev. Attach wolin.studio to the same Vercel project so its relative contact API is available. Use host-specific public redirects on wolin.dev, never a whole-domain Cloudflare redirect.

Redirect public GET/HEAD requests to the same path/query on https://wolin.studio, including the previously emailed /sample/UndercoverBedandSpas subtree, assets, /calebwolin, sitemap and public robots discovery. Retain noindex on the entire sample subtree at the destination. Preserve legacy /90-day-hands-free-local-sensation → /offers and /{commercial-route}/index.html → /{commercial-route}; combine with host normalization where practical to avoid chains. Browser fragments should remain intact; test them alongside query strings.

Exceptions: serve all /api and /api/* on old host without redirect (POSTs, Stripe webhooks, login verification, signing APIs and in-flight contact submissions); retain /sign and /sign/*; retain /admin and /admin/*, /admin-preview and its subtree, /private-shell.html and /app-shell.html until their exact use is decided. Keep /sample root audit on old host initially; redirect only the Undercover subtree if private sample scope is unclear. All admin.wolin.dev requests are outside public-host redirect rules, including robots.txt and sample protection. Avoid adding wildcard SPA fallbacks that turn unknown URLs into indexable home pages.

Vercel rules are deliberately unchanged pending approval. Confirm apex wolin.studio as canonical and whether www.wolin.studio and www.wolin.dev should redirect to it. Confirm whether Caleb wants admin/signing retained permanently or moved in a second phase; moving admin requires re-login and corresponding callback/routing/security updates. Broad domain redirects would break webhooks or same-origin protection even if a 308 preserves POST method.

## Account actions and rollout

1. Account worker records current Vercel project/team, production alias/deployment ID, domain mappings, DNS web records, TLS and redirect rules without exposing secrets. Verify Cloudflare ownership of wolin.studio. Record rollback values. Mail DNS is out of scope for mutation.
2. Coordinate admin/signing and www choices. Attach new web domain to existing project, use the exact Vercel-provided DNS target, verify certificates and readiness. Inspect existing Cloudflare rules/workers/WAF and Vercel project environment scopes. No infrastructure change without parent approval.
3. Run checks below and review branch diff. Deploy explicitly using the approved workflow. Verify six new public pages, metadata, robots, sitemap, noindex demos, admin login and signing/payment availability. A live form test sends mail and must be coordinated; local checks do not prove Resend production delivery.
4. Enable approved host/path redirects only after destination works. Test old Hunter destinations and the emailed Undercover URL, path/query/fragment preservation, old API POST accessibility, webhook status and callback behavior. Monitor API failures, TLS and loops.
5. Verify new Search Console domain property; submit new sitemap and coordinate Change of Address eligibility after redirects. Last known status is five indexed routes with service-areas pending; account worker must verify current state. Expect temporary ranking/indexing movement. Google Business Profile is mid-verification per last known October 7 state: inspect and coordinate website update to avoid disrupting verification. Update external directory/social links individually after approval; never rewrite Hunter content.

## Validation and rollback

Validated in the cloud on October 13: npm ci using /tmp/wolin-npm-cache succeeded; npm test passed 24 tests (including five new old/new origin checks); npm run lint and npm run build passed; check-seo passed six public pages; check-undercover passed 24 demo pages; git diff --check passed. No live email, payment or database mutation was performed.

For subsequent changes run npm ci, npm test, npm run lint, npm run build, node scripts/check-seo.mjs and node scripts/check-undercover.mjs. Existing payment/reservation tests mock email, Supabase and Stripe; no real charge or email is required. Add redirect tests once the approved rules exist, covering both hosts, private/API exceptions, Undercover paths and query preservation. Live Vercel/Cloudflare routing and integrations remain account validation requirements.

Rollback: disable only newly added public redirect rules first; restore the recorded prior Vercel production deployment/alias and public canonical code, then restore only changed web DNS if needed. Leave both domains serving valid TLS while caches settle. Never alter mail records, Hunter content, signing storage, tokens, SESSION_SECRET or Stripe IDs. Permanent redirects can cache, so validate temporary redirects or a controlled preview before permanent activation and retain the new host during rollback. No database rollback is needed for this branch.

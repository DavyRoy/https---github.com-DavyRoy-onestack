# Service pages and seamless homepage

Scope: preserve the homepage content and display typography; share its backdrop, remove section borders and use a minimum viewport height without clipping long content. Add visible service heroes, compact section navigation and an inline contact section to `/sites`, `/webapp`, `/mobile` and their English versions.

## Automated checks

- `git diff --check`: passes.
- ESLint on ServiceHero, ServiceContact, SectionLayers, SiteLayers, WebAppLayers and MobileLayers: passes.
- `npm run lint`: fails on pre-existing errors, including useCounter inside a callback in HomeBenefits and undefined components in the medicine demo. No lint rules were disabled.
- `npx tsc --noEmit`: 329 errors. A detached baseline worktree at `084e2e8` returns the same 329 diagnostics; comparing diagnostics without line numbers finds no added errors.
- Local Next dev HTTP checks: `/`, `/sites`, `/webapp`, `/mobile`, `/en/sites`, `/en/webapp`, `/en/mobile` all return 200. Each has one H1 and one `id="contact"`; all six service routes contain the new hero.

## Manual review still required

Browser access to the local server was blocked by this environment (`ERR_BLOCKED_BY_CLIENT`). No screenshots or successful visual/interactive checks are claimed. Keep the PR as a draft until these checks are completed:

1. At `/`, scroll through every section at 1440×900, 1366×768, 768×1024, 390×844 and 320×568. Confirm full-height minimum sections, continuous backgrounds, no horizontal overflow and no clipped text. Check landscape and 200% zoom.
2. On each service route above, confirm the visible hero, readable navigation cards and full-height contact section, including English text wrapping.
3. Use “Discuss your project” to reach contacts, open the calculator from the hero, change its inputs and transfer the estimate to the form. Confirm the modal closes, scroll/focus reaches contacts and the estimate notice is visible. Repeat with the configurator and footer CTA.
4. Confirm Escape closes a detail dialog and its opener regains focus. Repeat with reduced motion enabled and keyboard-only navigation.
5. Test the contact form against a mocked/staging `/api/contact`: invalid email and unchecked consent prevent submission; success resets the form and estimate; server/network errors retain entered data and allow retry; repeated clicks while sending produce only one request. Confirm analytics fire only after success.
6. Verify email, telephone, Telegram and privacy links. Production submissions and actual email/CRM delivery were not tested.

## Integration notes

The short form uses the existing JSON `/api/contact` contract, requires email (as the server does), preserves QuoteProvider estimates, and preserves the website form analytics names and adds corresponding events for web and mobile enquiries. It does not change the backend or deployment configuration. Legacy full brief components remain in the repository for other callers.

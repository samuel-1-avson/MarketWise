# MARKETWISE — deployment readiness

**Date:** 2026-10-30  
**Status:** Not ready to publish. Nothing has been deployed, and this document does not authorize a deployment.

The app builds and runs locally. Publishing still needs an owner decision, a real site address, and another pass over the claims that are marked as general explanation.

## What a host would need

- Node.js 20.9 or newer.
- `npm install`, then `npm run build`, then `npm run start` (or a host that runs that build for you).
- No database, API key, account system, payment provider, or analytics account.
- No `.env` file is in the project. The only public setting is `NEXT_PUBLIC_SITE_URL`.

Set that variable to the public origin you own, as an absolute `http://` or `https://` URL, and rebuild. Any other value is ignored, and canonical links stay on `http://localhost:3000`.

Most pages are static. Each lesson's Open Graph image is generated when it is requested (`/explore/<topic>/opengraph-image`). A host that only uploads static files, and does not run Node, will not serve those five images. The root Open Graph image, sitemap and robots file are static.

## Checks already run on this machine (2026-10-30)

These are the results recorded in `IMPLEMENTATION_PROGRESS.md`. They were not re-run for this document, because this document and the README do not change the application.

| Check                         | Result                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `npm run typecheck`           | Pass                                                                         |
| `npm run lint`                | Pass                                                                         |
| `npm run format:check`        | Pass                                                                         |
| `npm test`                    | Pass — 274 tests                                                             |
| `npm run build`               | Pass — 52 static pages, plus dynamic lesson Open Graph images                |
| `npm run test:e2e`            | Pass — 204 passed, 0 failed, 28 skipped                                      |
| Lighthouse, mobile, home page | Performance 89 then 99. Accessibility, Best Practices and SEO 100 both times |

End-to-end tests use the locally installed Google Chrome. They are not a test of Safari, Firefox, or a physical phone. Axe found no violations on the routes and slides it scanned. That is not a claim that the site conforms to WCAG.

## Safety pass for this handoff (2026-10-30)

The content under `content/` was searched again for trading calls to action, operator names, odds tools, payouts, wallet connection, live prices, and legal claims about Ghana. The existing unit tests already reject those patterns in lessons, labs, quizzes, myths and slides.

No new violation was found. Uses of "guaranteed", "wager" and "stake" are definitions, negations, or descriptions of harm. The sports-betting lesson still says it will not help anyone place a wager. Sample numbers remain labelled illustrative.

This pass did not re-open the eight external source pages. Statements already marked as general explanation in each lesson's review note, and in eleven slide `sourceNote`s, still need a human editor before a public release.

## Do not publish until

1. You decide that the site should be published, and you name the host and the public URL.
2. `NEXT_PUBLIC_SITE_URL` is set to that URL and the site is rebuilt.
3. The general-explanation claims listed in the lesson review notes and slide source notes have been checked, or the pages keep those caveats visible.
4. You accept that there is no Ghana-specific legal source, and that the cited pages are United States, Australian or English.
5. You have looked at the deck on the actual capture screen if it will be streamed. Fullscreen was tested in headless Chrome only.

A QR code, if you want one, should be generated only after that URL exists. This project does not include one.

## What publishing must not add

Trading, brokerage or wallet connections, live prices, accounts, payments, analytics that are not reviewed first, gambling operators, odds, payout tools, or links to betting services.

## If you later approve a deployment

The steps would be: choose a Next.js host, set `NEXT_PUBLIC_SITE_URL`, run the build there, open the home page, one lesson, one lab, `/present` and `/sitemap.xml`, and confirm the canonical URL matches the public origin. Those steps have not been done.

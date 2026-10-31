# MARKETWISE — Implementation progress log

Factual build log. Everything below was inspected or executed in this working directory; nothing is claimed that was not run. Target requirements live in `PRODUCT_AND_BUILD_SPEC.md` and `IMPLEMENTATION_CHECKLIST.md`.

**Last updated:** 2026-10-30
**Current phase:** Milestones 0–5 are complete as a local handoff. Nothing is deployed. Owner decisions (publish, public URL, git, QR code) are listed in `DEPLOYMENT_READINESS.md`.
**Deployed:** No. Nothing has been deployed, published or connected to an external service.

## Environment

| Item            | Value                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| OS / shell      | Windows 11, PowerShell + Git Bash                                                        |
| Node / npm      | v24.20.0 / 11.19.0                                                                       |
| Package manager | npm (lockfile: `package-lock.json`)                                                      |
| Browser for E2E | Locally installed Google Chrome via Playwright `channel: "chrome"` (no browser download) |
| Git repository  | No (`git init` not run; ask before initialising)                                         |

## Dependency decisions (versions as installed from the npm registry)

| Package                                      | Version                        | Why                                                                                                                                                                                                                          |
| -------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| next / react / react-dom                     | 16.4.3 / 19.3.1 / 19.3.1       | App Router, static prerendering                                                                                                                                                                                              |
| typescript                                   | ~6.0.3                         | **Pinned below 6.1**: `typescript-eslint` (used by `eslint-config-next`) declares peer `typescript <6.1.0`; npm's latest is 7.0.2, which that toolchain does not support                                                     |
| eslint                                       | ^9.39.5                        | `eslint-plugin-react`, `-jsx-a11y`, `-import` (bundled by `eslint-config-next`) do not list ESLint 10 in their peer ranges. npm prints a "no longer supported" deprecation for 9.x; revisit when those plugins add ESLint 10 |
| tailwindcss + @tailwindcss/postcss           | 4.3.3                          | CSS-first `@theme` tokens                                                                                                                                                                                                    |
| motion                                       | 14.9.0                         | `MotionConfig` / `motion/react` export confirmed present                                                                                                                                                                     |
| zod                                          | 4.6.7                          | Content schemas                                                                                                                                                                                                              |
| vitest / @vitejs/plugin-react / vite / jsdom | 5.0.5 / 6.1.2 / 8.3.5 / 30.1.3 | plugin-react 6 requires vite 8                                                                                                                                                                                               |
| @testing-library/react, jest-dom, user-event | 16.3.3 / 7.0.1 / 14.6.8        | Component tests                                                                                                                                                                                                              |
| @playwright/test, @axe-core/playwright       | 1.64.1 / 4.14.0                | E2E and accessibility scans                                                                                                                                                                                                  |
| @fontsource-variable/inter, /space-grotesk   | 5.3.0                          | Fonts served locally (OFL-1.1); avoids any build-time request to Google Fonts                                                                                                                                                |

## Milestone 0 — foundation (complete)

- Next.js App Router project scaffolded by hand (requirement documents and `.claude/` untouched); strict TypeScript (`strict`, `noUncheckedIndexedAccess`), ESLint flat config (`no-explicit-any: error`), Prettier config, Tailwind v4.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `test:e2e`, `format`, `format:check`.
- Design tokens (`app/globals.css` `@theme` + `lib/tokens.ts`); a test keeps them in sync and audits WCAG contrast, including a separate `edge` token for control borders (≥ 3:1).
- Accessible shell: skip link, sticky header with a no-JS-capable mobile menu, footer disclaimer, one focus ring, `prefers-reduced-motion` honoured by CSS and `MotionConfig`, a visible "Reduce motion" toggle, local-only preferences with a "Clear saved preferences" control on `/about`.
- Content schemas and cross-reference validator (`lib/schemas.ts`, `lib/content-validation.ts`).

## Milestone 1 — curriculum and structure (complete)

**Content (`content/`)**

- `sources.ts` — 8 sources, all `verified` on 2026-10-30 (see "Source verification").
- `topics/*.ts` — five lessons (forex, stocks, commodities, crypto, sports betting), each with the 11 required sections, actors, 4–5 misconceptions, glossary terms, a labelled illustrative-number section where fictional figures appear, a `reviewNote` stating which claims are sourced and which are general explanation, and a `labId` (the labs themselves are Milestone 2).
- `glossary.ts` (58 terms), `quizzes.ts` (25 topic questions, 5 per topic, plus 6 cross-system; every answer carries an explanation), `myths.ts` (13), `comparison.ts` (8 questions × 5 systems), `labs.ts` (metadata for the 6 labs), `diagrams.ts` (one mechanism flow per topic).
- Fictional numbers use an obviously round invented rate (USD/GHS 10.00) and invented stories; every section that quotes them shows "Illustrative only — not live data".

**Routes (all prerendered static)** — `/`, `/explore`, `/explore/forex|stocks|commodities|crypto|sports-betting`, `/compare`, `/myths`, `/quiz`, `/glossary`, `/resources`, `/about`, plus the 404 page. Navigation and footer link only to these. **Not built yet:** `/labs`, `/present`, `/present/[slug]` (Milestones 2 and 3).

**Features**

- Lessons: on-page contents list, 11 numbered sections, mechanism diagram as accessible SVG with a text version, misconception cards, a five-question check with feedback on every answer, linked glossary terms, per-section source links, review-status box.
- Compare: table on wide screens, accordion on narrow ones (same text), question chips, selection mirrored in the URL (`?dims=`) and restored on load.
- Myths: tap-to-reveal `<details>`, topic filter, reveal-all. Quiz: topic filter, retry, reset, optional opt-in local progress saving (off by default; removed by "Clear saved preferences"). Glossary: search, topic filter, A–Z jump links, deep-linkable terms; a "See also" link clears a filter that hides its target.
- Resources: every source with status, date on the page, what it supports, jurisdiction caveat and a safe external link; methodology and limits.

## Milestone 2 — interactive teaching labs (complete)

**Structure.** Each lab is a pure, deterministic model in `lib/labs/` (no React, fully unit-tested), an interactive component in `components/labs/`, and a metadata entry in `content/labs.ts`. All share `LabShell`: the "Illustrative only — not live data" label, controls, a picture, an "In plain words" live text equivalent (`role="status"`), and a "What this lab does not do" box. Inputs pass through `clampInt`, so bad values (NaN, Infinity, blank, out of range, wrong type) never reach the screen.

**Routes (static):** `/labs` (index of six cards) and `/labs/fx-quote`, `/labs/leverage-sensitivity`, `/labs/ownership-lens`, `/labs/supply-shock`, `/labs/ledger-journey`, `/labs/uncertainty-tiles`. "Labs" added to the header and footer; each lesson now has a "Try it yourself" block linking the labs for its topic; each lab page links back to its lesson(s) and shows its sources and status.

| Lab                        | Controls                                                                  | What it shows                                                                                                                         | Deliberately absent                                                        |
| -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| FX Quote Explainer         | pair direction, quote list slider + previous/next, reset                  | base/quote reading, bid/ask/spread, movement vs the last quote viewed, a fixed fictional invoice                                      | any amount or rate input, so it cannot be a converter                      |
| Leverage Sensitivity Bands | None / Some / More                                                        | a table (with bars) of fixed 0.5–5% moves against and for the person's own money at 1×/5×/20× invented sensitivity                    | position size, money, price inputs; no level is called safe or recommended |
| Equity Ownership Lens      | slider, number box (clamped 0–1,000), quick picks, dividend choice, reset | 1,000-cell mosaic, ownership %, a fictional dividend that is the company's choice                                                     | prices, orders, any purchase flow                                          |
| Commodity Supply Story     | four fictional scenarios, reset                                           | stylised supply/demand chart; supply line moves left, meeting point moves to "upward price pressure in this model" and lower quantity | numbers on the axes, any forecast                                          |
| Ledger Journey             | valid / rule-breaking request, back / next / replay, reset                | request → broadcast → validation → ledger update, accepted or rejected; ledger entries; a real-world caution per step                 | wallets, keys, addresses, signing, amounts                                 |
| Uncertainty Tiles          | even/uneven mix, five fixed sets, reveal next / 10 / all, reset           | circles and squares from fixed pseudo-random sets, counts, longest streak, blocks of ten, sequence as text                            | any sport, stake, payout, odds or prediction                               |

**Accessibility and motion.** Choice controls are native radio inputs styled as pills (✓ marks the choice); sliders carry `aria-valuetext`; every picture has an `aria-label` that states the current state plus a table or text alternative; the supply chart's movement uses CSS transitions that the reduced-motion toggle and the OS setting reduce to nothing (an E2E test checks this).

**Safety checks that run as tests.** Component tests render every lab and assert: no trading/ordering/wallet/promotional vocabulary; "odds", "payout", "wager", "stake" appear only in sentences that exclude them; the only number input anywhere is the share count; no free-text inputs; no NaN/undefined in any initial state. An E2E test records network requests while using the labs and asserts there are none to other origins; another uses a lab with the network switched off.

**Lab review (editorial-reviewer agent, read-only).** It found no calculator or wagering-aid risk and confirmed the FX bid/ask and supply algebra. It raised the points below, all **resolved**:

- leverage level names "Low/High" implied an acceptable level → renamed "Some/More"; "✓ In your favour" removed; a plain definition of leverage, a statement that no one can forecast a move, and omitted costs added; gains no longer capped at the deposit in the model;
- the tiles lab said knowing the bag "changes how likely each shape is" (inaccurate) → rewritten (the mix describes long-run frequency, not the next tile; tiles go back in the bag; streaks do not make the other shape "due"); the five sets are now disclosed as chosen because each contains a streak, and the draws as a fixed pseudo-random sequence; "run" renamed "set"/"streak"; the mix description says it is not a prediction or odds;
- the tiles lab was styled and iconed as sports betting → neutral accent and glyph (`accent: "neutral"`), limits reworded to say no sport, stake, payout, odds or wager is modelled or implied;
- ledger irreversibility overstated → hedged ("on many public blockchains… other designs differ"; "at the protocol level"), plus a note that blocks and consensus are skipped and that a token here is just a labelled item;
- FX "earlier/later quote" implied a depreciation trend → "previous/next quote" in an "invented list, not a timeline"; bid/ask defined on screen; settlement noted as a separate step; "invented" printed next to the rate;
- supply: the chart is stated to stand for the price where buyers meet the reduced supply (origin prices can differ); direction text now reads "…pressure in this model";
- ownership: "about" dropped from an exact figure; added that a share's price can fall and dividends can be changed or skipped;
- labs had no sources → `sourceIds` added to the schema and shown on each lab page, and the page states that the mechanics are general explanation needing editorial verification.

**Defects found by testing along the way:** the FX quote text compared to the previous _list position_, so stepping backward still read as "weakened" — it now compares with the quote last viewed; leverage bars rendered at 100 px inside a wider SVG (fixed with `preserveAspectRatio="none"`); the FX plate text clipped at the edge; the ledger node labels ran together; an `h3` before any `h2` on the ledger lab (axe best-practice); Playwright could not `.check()` the visually hidden radios, so E2E now clicks the label as a visitor does.

## Milestone 3 — 24-slide presenter mode (complete)

**Content.** `content/slides.ts` holds exactly 24 slides following the storyboard in `PRODUCT_AND_BUILD_SPEC.md` §8, in seven chapters with the suggested pacing from the stream guide (5–8, 7–10, 4–6, 5–8, 4–7, 5–8, 9–13 minutes). Each slide has one on-slide message (≤ 28 words), a speaker cue, an interactive cue, and structured notes — teaching point, 2–3 explanation steps, a beginner analogy, a misconception, a transition and (mostly) an audience question — each 110–260 words (enforced by tests). Eleven slides also carry a `sourceNote` stating which claims the cited sources support and which are general explanation needing editorial verification; it is shown in the notes panel and the handout, never on the slide. Slides with a lab or related page link to it (all six labs are reachable).

**Scenes.** 24 individually composed SVG scenes (`components/presenter/scenes/`), built from a small kit (plates, arrows, chips, topic glyphs) and reusing the lab models so numbers agree with the labs (the tile field, leverage bars, ownership mosaic, supply chart). Every scene has an `aria-label` describing it; any scene that shows invented numbers carries "Illustrative only — not live data" (a test renders all 24 and enforces it). A staggered entrance plays once per slide and then everything is still (an E2E test asserts no running animations after 2.5 s); the global reduced-motion rules remove the entrance entirely.

**Routes (static).** `/present` (slide 1), `/present/<slide-id>` for each of the 24, and `/present/handout`. The site header and footer are hidden on the live deck only (`SiteChrome`); the handout keeps them.

**Stage.** Slides are authored at 1920×1080 and scaled to fit with 16:9 preserved, with 96 px side margins for stream overlays. Measured in a real browser: at 1280×720 with the control bars the stage is 1042×586 (scale 0.54: title ≈ 43 px, message ≈ 23 px effective); at 1920×1080 the message is ≈ 37 px. In fullscreen the bars float over the slide so it can use the whole screen, and fade after 3 s idle.

**Controls.** ← → Space PageUp/PageDown, Home, End, F fullscreen, N notes, T timer, C chapters, ? help, Esc — all ignored while typing, using a slider/radio group, with a modifier key held, or while a dialog is open; Space activates a focused button instead of advancing; held keys repeat only for the arrows and paging keys; inside the scrollable notes the paging keys scroll. Single-letter shortcuts can be switched off (WCAG 2.1.4) from the help dialog, which also holds the reduced-motion switch and notes that Esc may leave fullscreen. Progress bar by chapter, previous/next buttons (`aria-disabled`, so focus is not lost at the ends), chapter dialog (native `<dialog>`), tab title and a polite announcement follow the slide, the browser Back button steps between slides.

**Speaker notes.** Hidden by default; a persistent status says "Notes hidden" or "● Notes visible on this screen" (text and tint, not colour alone). Their visibility lives **in memory only** — not in sessionStorage — so a reload, duplicated tab or restored session always starts hidden, while a client-side lab detour keeps the choice. The notes are not in the server-rendered HTML.

**Timer.** Wall-clock based (start/pause/reset) so it keeps counting during a lab detour; stored in sessionStorage for this tab only.

**Lab round trip.** The bottom bar offers the slide's lab or related page with `?returnTo=/present/<slide-id>`; the destination shows a banner "← Back to slide N: title" (the return value is validated against the real slide list; external, malformed or unknown values are ignored). Returning restores the exact slide, notes state and running timer. The deck's Handout button carries a return path too.

**Handout.** `/present/handout` lists every slide with sources; **audience-safe by default** — speaker notes, presenter cues and source status appear only when "Include speaker notes" is ticked, with a clear warning when they are. A print stylesheet makes the page black on white and hides site chrome and controls.

**Defects found by looking.** A browser sweep that compared every SVG text box with its card found overflows on slides 1, 2, 8, 11, 16, 17, 18, 20 and 21 (fixed by shortening copy, wrapping and re-sizing); screenshots of eight rendered slides at 1920×1080 were inspected. A phantom focus problem: the notes button pointed `aria-controls` at an element that did not exist while notes were hidden (axe `aria-valid-attr-value`, critical) — fixed. In production the tab title was overwritten after a history push — now re-applied when the pathname settles. A state-updater that called `history.pushState` (impure under Strict Mode) was replaced by an ordinary function. The stage was hidden when it could not be measured (jsdom) — now falls back to design size.

**Editorial review (read-only agent) — resolved.** Slide 18's visual made the spectrum look like data and put forex and crypto next to wagering with no on-slide framing → now labelled "Our own simplified framing — not a source finding; bar positions are illustrative", axis reworded to purpose-driven vs speculative, and "needed ≠ risk-free" stated. A transition called wagering "not financial at all" (contradicting the harm slides) and an analogy used a gambling image ("a bet on a race") → reworded. Unnamed "the regulator" now names ASIC or the SEC; an unsourced superlative ("the one regulators warn about most") removed; "no pattern to exploit" (readable as a market claim) reworded; sports-betting notes gain a line pointing worried viewers to someone they trust or a qualified local support service (no services named); softened "Reaches families" to "Can reach families" and "stake" wording; hard-coded slide numbers, counts and quiz references removed from notes and scenes; spot now "now or very soon"; the futures analogy no longer describes a forward contract; Spread ignored for simplicity noted on slide 6; Moneysmart's registry `supports` text now includes the frequent-trading line that was actually read.

**Accessibility review (read-only agent) — resolved.** Printed handout would have been near-white text on white; "audience-safe" handout still showed presenter cues and defaulted to notes on; faded bars in fullscreen stayed focusable but invisible; single-letter shortcuts had no off switch; notes could reappear after a reload; held keys flickered panels; focus was lost when panels closed and when the end buttons were `disabled`; page title never changed; the notes aside was not keyboard-scrollable and its landmarks were noisy; button names included key letters; the handout button had no way back; no reduced-motion control inside the deck. All addressed as described above.

## Milestone 4 — visual and experience polish (complete)

**Home.** The text-only hero is now a market constellation: five topic links on an ellipse around a question mark, the same arrangement as slide 1. The entrance is one fade, then still. Reduced motion shortens it to nothing, and a hidden tab pauses it.

**Topic pictures.** Each lesson uses a bespoke SVG instead of the shared vertical flow: USD/GHS plates, a share grid that stands for 1,000 shares (the squares are not a count), a farm–processor–factory chain with a separate futures contract, a ledger where each computer keeps its own copy, and an event with an agreement made before it. Each picture has a visible summary, a text-version disclosure, and the illustrative badge when it shows invented numbers.

**Deck.** Scene captions are at least 28 design units. The notes column is 22rem wide on large screens. Each scene's description lives in `content/sceneText.ts` and is the picture's accessible name, a "Text version" panel, and a block in the handout. Touch swipe moves between slides. Escape closes the text version when the timer and notes are already shut. In fullscreen the text panel sits above the control bar, and the first touch while the bars are hidden only brings the bars back. Slide-to-slide URL changes do not remount the deck or move focus; entering or leaving the deck still moves focus to the main landmark.

**Motion and metadata.** Page content crossfades in 220–320ms and the transition overlay does not take pointer events. `sitemap.xml`, `robots.txt`, a root Open Graph image, canonical URLs and per-page Open Graph fields use `NEXT_PUBLIC_SITE_URL` when it is an absolute http(s) URL, otherwise `http://localhost:3000`. No production host was invented. Topic Open Graph images are generated on demand (`ƒ` in the build), not prerendered. The favicon was already present.

**Reviews.** The editorial review of the new pictures and captions, and the accessibility review of the new interface, were both run read-only. Their must-fix findings were applied: quote convention, share-grid count, futures wording, bids versus asks, forex title and summary, focus during slide changes, fullscreen text panel, keyboard scrolling of the text version, and the phone banner copy.

## Source verification (2026-10-30)

All eight pages were actually read. Method: the two CFTC pages loaded through an automated fetch (read by the fetch agent, not first-hand); five Investor.gov/Moneysmart pages returned HTTP 403 to that fetcher and were read in the built-in browser; the GOV.UK evidence review was read in the built-in browser. Findings that shape the content:

- Every source is **United States, Australian or English**; each carries a `caveat` so none is read as Ghanaian law.
- The CFTC forex advisory is undated and its statistics are from 2021–2022 — not quoted as current. Its description of futures and of forex risks is as relayed by the fetch agent.
- The Investor.gov commodities page is about **futures**, not physical goods; physical-commodity statements are general explanation and flagged as such.
- The crypto securities alert is dated 23 March 2023 and concerns crypto asset _securities_; platform cautions are scoped that way.
- The SEC stocks page contains a statistic about large-company stocks losing money in roughly one year in three; it was deliberately not used.
- A **WHO gambling fact sheet** was found by search but its page body would not render in the review browser, so it is **not cited**. Search-result summaries were not used as sources.
- After the editorial review (below), each source's `supports` text was extended to everything actually read on the page, so what lessons attribute to a source can be audited against it.

## Review passes

Both project review agents were run once on Milestone 1 (read-only, from code; they ran no browser).

- **Editorial review** — no operator names, odds/payout content, sample wagers, links, calls to action, guarantee language, Ghana legal claims or live prices found. It flagged claims attributed to sources beyond the registry's `supports` text, universal "losses can exceed the deposit" statements (only the CFTC page supports it), a registration claim, citation mismatches, and wording that could read as endorsing participation. **Resolved:** `supports` extended to what the pages actually say; "losses can exceed the deposit" made conditional ("with some products"); the registration claim removed; unsupported citations dropped from the glossary, a misconception and a myth; `reviewNote`s now list unsourced general statements; the fictional rate changed to 10.00; wager wording changed to "no ownership stake in any company, currency or commodity"; the "reasons to take part" sentence rewritten; coin/streak statements scoped to independent chance events; a quiz distractor that modelled testing a betting system replaced.
- **Accessibility review** — **Resolved:** smooth scrolling now disabled by the reduced-motion setting and the site toggle; `scroll-padding-top` for the sticky header; control borders raised to ≥ 3:1 (`--color-edge`) and link underlines made visible; compare table moved to the `lg` breakpoint so it never needs horizontal scrolling; quiz focus management on check/retry and live-region noise reduced; the motion toggle now has a fixed accessible name with `aria-pressed`; filter pills carry a ✓ as well as a tint; myth claims are headings; lesson/glossary sections no longer create dozens of landmarks; diagram text enlarged and the text-version disclosure given a visible marker; `:target` outline for deep links; badge and footer text enlarged; resources links read as "Open this source page". **One suggestion was reverted:** giving the whole-card links on `/explore` an `aria-labelledby` made their accessible name shorter than their visible text and axe flagged it (WCAG 2.5.3); the cards keep their full-text names.

## Commands actually executed (2026-10-30) and results — end of Milestone 4

An earlier full E2E run in this session (before the final fixes) reported **188 passed, 1 failed, 21 skipped**. The failure was a 30-second timeout inside an axe scan of changed lab states, not a reported violation. A later run with the machine overloaded produced many 30-second timeouts and then stopped printing output; that run was abandoned. Playwright's timeout is now 90 seconds and local runs use 3 workers.

| Command                                      | Result                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                          | Pass (after the final navigation fix; Next's production build also typechecked)                                                                                                                                                                                                                                             |
| `npm run lint`                               | Pass, no warnings                                                                                                                                                                                                                                                                                                           |
| `npm run format:check`                       | Pass, after `npm run format` across the project                                                                                                                                                                                                                                                                             |
| `npm test`                                   | Pass — 14 files, **274 tests**                                                                                                                                                                                                                                                                                              |
| `npm run build`                              | Pass — **52 static pages**, plus a dynamic `/explore/[topic]/opengraph-image`. New static routes include `/sitemap.xml`, `/robots.txt` and `/opengraph-image`                                                                                                                                                               |
| `npm run test:e2e`                           | Pass — **204 passed, 0 failed, 28 skipped** (2.7 minutes) on desktop Chrome and a Pixel 7 profile. Skips are conditional: keyboard presenting on the phone profile, the phone-only note and the touch-swipe test on desktop, and the explicit width sweep on the phone profile                                              |
| Lighthouse, mobile, `http://127.0.0.1:3200/` | Two runs of the same production home page. Run 1: Performance **89**, Accessibility **100**, Best Practices **100**, SEO **100**, LCP 3.3 s. Run 2: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**, LCP 0.9 s. Simulated mobile throttling moved the performance score across the 90 target |

Manual checks: the home constellation at 1280 and 360, the five topic pictures, slide 1 with the text version open, and the presenter controls in the built-in browser. A measurement pass at 360, 768, 1280 and 1920 found no horizontal overflow on `/`, a lesson, compare, a lab and `/present`. Scene text that `getBBox` reported outside the viewBox on slide 13 is the rotated axis label; the rendered slide was inspected and the label sits on the axis.

**Not run:** a screen-reader pass, and testing on a real phone or capture monitor. The axe scan is not a conformance claim.

## Known gaps and honest caveats

- **Deck limits.** Not rehearsed on a real capture setup. Fullscreen was tested in headless Chrome. Scene captions are at least 28 design units, and the notes column is narrower, but the stage still scales to the window, so browser zoom cannot enlarge slide text. The handout is the reflowable alternative. The skip link in the deck still targets a `<main>` that wraps the deck. Tested in Chrome only.
- **Lighthouse.** Mobile performance on the home page was 89 on one run and 99 on the next. Accessibility, Best Practices and SEO were 100 both times. The lower run's LCP was 3.3 s under simulated throttling.
- **Open Graph.** The root image is static. Each lesson's image is generated when requested, so a purely static host would not serve those five images without a Node server.
- **Canonical origin.** Until `NEXT_PUBLIC_SITE_URL` is set to the real site, canonical links, the sitemap and robots.txt use `http://localhost:3000`.
- **Slide sources.** Eleven slides carry a `sourceNote` listing general explanation that still needs editorial verification before any public release. The sports-betting slides contain no odds, wager examples, operators or tips.
- **Labs are conceptual toy models.** The FX list of invented quotes (9–11 cedis per dollar) is labelled invented, but it sits in a range that could resemble a real rate. The leverage multipliers (1×/5×/20×) are teaching values, not real product settings.
- **Not yet tested with a screen reader** or on a real touch device. Sliders and radios are native controls. Swipe was tested with a synthetic touch pointer in the Pixel 7 profile.
- **Sources:** the CFTC pages were read by the fetch agent rather than first-hand; no Ghana-specific source and only one gambling-harm source (England). Claims remain cited per section, not per bullet. Statements marked as general explanation need sourcing before any public release.
- Whole-card links on `/` and `/explore` have long accessible names (kept for WCAG 2.5.3).
- Not a git repository; no commits made. Nothing is deployed.

## Milestone 5 — verify and finish (local handoff complete)

No application code changed in this phase. The gates listed above were not re-run; they are the Milestone 4 results from the same day.

- `README.md` now explains install, run, test, build, routes, source maintenance and `NEXT_PUBLIC_SITE_URL`. The original pack instructions moved to `docs/STARTING_PACK.md`.
- A safety search of `content/` found no new trading calls to action, operator names, odds tools, wallet flows, live prices, or Ghana legal claims. Existing unit tests still enforce those boundaries. Claims already marked as general explanation were not re-verified against the live source pages.
- `DEPLOYMENT_READINESS.md` records what a host would need and what must be decided first. Nothing was deployed.

**Still needs the owner:** whether to publish, the public URL, whether to initialise git, and any QR code after that URL exists.

**Continuation instruction:** "Read `IMPLEMENTATION_PROGRESS.md` and `DEPLOYMENT_READINESS.md`. Do not deploy unless I explicitly approve a host and a public URL."

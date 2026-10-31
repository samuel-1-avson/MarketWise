# MARKETWISE

Interactive Market Literacy Studio. A local educational site that explains forex, stocks, commodities, crypto and sports betting as different mechanisms, with six concept labs and a 24-slide presenter deck.

It does not trade, connect a wallet or brokerage, give financial advice, show live prices, or help anyone place a wager. Sports betting is discussed only to tell it apart from those markets and to name the harm gambling can cause. Sample numbers are fictional. Charts that use them say **Illustrative only — not live data**.

The original design-pack instructions are in `docs/STARTING_PACK.md`. What has actually been built and tested is in `IMPLEMENTATION_PROGRESS.md`.

## Requirements

- Node.js 20.9 or newer (developed on Node 24.20 / npm 11.19)
- npm
- Google Chrome, installed locally, for the end-to-end tests (Playwright uses the `chrome` channel and does not download a browser)

## Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

On Windows PowerShell, `npm` can fail with "running scripts is disabled" because PowerShell tries to run `npm.ps1`. Use the `npm.cmd` program instead:

```powershell
npm.cmd install
npm.cmd run dev
```

That does not change the execution policy. If you want the plain `npm` command to work in PowerShell, you can allow local scripts for your user only: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. That is a security setting on your account, so run it only if you want that change.

| Script                 | What it does                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`          | Development server                                                                 |
| `npm run build`        | Production build                                                                   |
| `npm run start`        | Serve the production build                                                         |
| `npm run lint`         | ESLint                                                                             |
| `npm run typecheck`    | `tsc --noEmit`                                                                     |
| `npm test`             | Vitest unit and component tests                                                    |
| `npm run test:e2e`     | Playwright against a production build on port 3100. Builds first. About 3 minutes. |
| `npm run format`       | Prettier write                                                                     |
| `npm run format:check` | Prettier check                                                                     |

There is no `.env` file. The app does not call a paid API, a database, or an analytics service.

## Where things are

| Path                                                                                                                               | What it is                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `/`                                                                                                                                | Home, with the five-system constellation                                    |
| `/explore` and `/explore/forex`, `/stocks`, `/commodities`, `/crypto`, `/sports-betting`                                           | Lessons                                                                     |
| `/compare`                                                                                                                         | The same questions across all five systems                                  |
| `/labs` and `/labs/fx-quote`, `/leverage-sensitivity`, `/ownership-lens`, `/supply-shock`, `/ledger-journey`, `/uncertainty-tiles` | Concept labs. Fixed toy values only.                                        |
| `/myths`, `/quiz`, `/glossary`, `/resources`, `/about`                                                                             | Myths, quiz, glossary, sources, safety framing                              |
| `/present`                                                                                                                         | Slide 1 of the deck                                                         |
| `/present/<slide-id>`                                                                                                              | One of the 24 slides                                                        |
| `/present/handout`                                                                                                                 | Printable handout. Speaker notes are off until the presenter ticks the box. |

Presenter keys, on a large screen: arrow keys and Space move slides, Home and End jump, F fullscreen, N notes, T timer, C chapters, ? shortcuts. Notes stay hidden until opened, and that choice is kept in memory only, so a reload starts hidden. The timer for the current tab is in `sessionStorage`. Quiz progress is saved only if the learner opts in, and **Clear saved preferences** on `/about` removes it.

## Content and sources

Lessons, glossary, myths, quiz, comparison, labs metadata, slides and the source registry live in `content/`. Pictures and labs read that data; they do not invent their own claims.

A source in `content/sources.ts` is `verified` only after its page was opened and read. `reviewedOn` is that date. `supports` is what the page was actually found to say. `caveat` records the jurisdiction. The current sources are United States, Australian or English pages. None of them is Ghanaian law.

To update a source:

1. Open the page and read it. Do not add a source from a search snippet.
2. Update `supports`, `pageDate`, `reviewedOn`, `status` and `caveat` in `content/sources.ts`.
3. If a lesson, myth, quiz item or slide cites it, check that the citation still matches `supports`.
4. Run `npm test`. The source and content tests reject unverified citations and a set of gambling and trading phrases.

The WHO gambling fact sheet was not added: its page body did not render when it was reviewed on 2026-10-30.

## Before any public site

Set `NEXT_PUBLIC_SITE_URL` to an absolute `http://` or `https://` URL and rebuild. Until then, canonical links, `sitemap.xml` and `robots.txt` use `http://localhost:3000`. A value that is not an absolute URL is ignored.

Publishing is not set up, and it is not authorized. Read `DEPLOYMENT_READINESS.md` and ask before deploying.

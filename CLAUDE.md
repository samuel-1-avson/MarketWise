# MARKETWISE project instructions for Claude Code

## Product and required reading

- Project: **MARKETWISE — Interactive Market Literacy Studio**.
- Authoritative requirements: `PRODUCT_AND_BUILD_SPEC.md` (read it completely before implementing).
- Main build assignment: `CLAUDE_CODE_MASTER_PROMPT.md`.
- Engineering checklist: `IMPLEMENTATION_CHECKLIST.md`.
- Keep a factual build log in `IMPLEMENTATION_PROGRESS.md` after each coherent phase.
- This repository initially contains **only design/build instructions**, not a completed app. Create the working implementation here rather than inventing completion status.

## Core product

- Next.js App Router + React + strict TypeScript + Tailwind CSS; choose compatible, maintained packages after inspecting environment.
- One responsive site with Explore Mode (five substantive learning tracks, glossary, myths, comparison, labs, quiz, resources) and Presenter Mode (24 richly composed, individually authored slides, meaningful speaker notes, timer, keyboard controls, lab jump/return).
- Functional, text-accessible SVG-based illustrations; performance-minded animations and responsive presentation layouts.
- Content, source metadata, slide definitions, quizzes and toy datasets stay separate from visual components.
- Ghana-relevant examples (GHS, cocoa, gold, importers) may be used without asserting current prices, regulatory permissions or legal conclusions.

## Unbreakable boundaries

- **Education only.** No trading execution, live trading or brokerage APIs, financial signals, advice, real wallets, token signing, financial account connections, payments or deposits.
- No gambling products, operator referrals, odds/payout/bet calculators, tips, wager construction, betting simulation, promotional links or how-to-bet material. Sports betting is **conceptual, neutral, and risk-aware only**.
- All examples and sample numbers are fictional; every synthetic numeric visualization visibly reads `Illustrative only — not live data`.
- No guaranteed outcome claims, gambling glamorization, dark patterns, fake testimonials, FOMO, or fabricated sources.
- No user accounts, analytics, paid APIs or private data collection for MVP.
- No changes outside this working directory, no deployment, purchases, secrets configuration, external service connections, or destructive commands without explicit user consent.

## Engineering and review

- Prefer transparent, small composable components; no fake controls, dummy routes, placeholder sections or dead links presented as working.
- Use semantic HTML, keyboard and touch interactions, visible focus, screen-reader descriptions for charts, equivalent text tables, good contrast, and `prefers-reduced-motion` support.
- Interactive labs must teach concepts via fixed/seeded toy values; never offer real financial or gambling functionality.
- Use verified sources for factual claims; date and link source metadata; mark uncertainties. Separate illustrative examples from factual statements.
- Test functionality; lint, typecheck, unit/component tests, E2E smoke tests, accessibility checks and production build before claiming success.
- Do not invent test results, claim a live deployment, or mark incomplete milestones complete.
- If context/time is constrained, stop at a stable tested milestone, update progress with remaining work, then provide the exact continuation instruction.

## Phase ordering

0. Inspect existing files, plan and establish measurable checklist.
1. Bootstrap app, content models and design system.
2. Produce five complete, referenced educational modules and comparative content.
3. Build and validate safe interactive labs, myths, glossary and quiz.
4. Deliver all 24 presenter scenes, full notes and lab bridging.
5. Polish interaction design, motion, responsive views and accessibility.
6. Run quality gates and prepare a deployment readiness report (do not deploy).

## CLI and commands

- Once package scripts exist, use `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build` (adapt accurately to real `package.json` scripts).
- Do not run missing scripts and report them as passing. Record commands and failures in `IMPLEMENTATION_PROGRESS.md`.
- Respect requested permissions. Never use a permission-bypass flag simply to run faster.

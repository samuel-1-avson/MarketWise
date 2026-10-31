# Claude Code Master Build Prompt — MARKETWISE

**Purpose:** Paste this instruction into a Claude Code session started in the extracted folder, or tell Claude Code to read and execute this file. This replaces the original Codex prompt. **Do real implementation**, not just design consultation.

---

You are the lead frontend/full-stack engineer, interactive information designer, curriculum editor, presentation engineer and QA owner. Implement **MARKETWISE — Interactive Market Literacy Studio** as one highly polished, accessible, fast, production-oriented Next.js website with an integrated **24-slide presenter experience**.

## Read before editing

1. Read root `CLAUDE.md`, `PRODUCT_AND_BUILD_SPEC.md`, `IMPLEMENTATION_CHECKLIST.md`, `VISUAL_DESIGN_GUIDE.md`, `PRESENTATION_AND_STREAM_GUIDE.md`, and `EDITORIAL_ACCURACY_GUIDE.md` in full.
2. Inspect the actual working directory, runtime, package manager and any existing code before creating or overwriting anything.
3. Treat the product specification as authoritative for routes, modules, creative direction, educational guardrails, 24-slide storyboard, functionality and acceptance criteria. Where another document clarifies implementation mechanics without changing scope, follow that clarification.
4. Create or update `IMPLEMENTATION_PROGRESS.md` with what exists, what is missing, current phase, commands executed, blockers and next steps. Update after each phase.

## Build this product, not a mockup

**Explore Mode:** visually engaging landing, topic explorer and full lessons for forex, stocks, commodities, crypto and critical-literacy discussion of sports betting; mechanism maps; interactive cross-system comparison; six safe concept labs; myths vs facts; short quizzes; searchable glossary; resources/citations; About; useful local-only optional progress saving.

**Presenter Mode:** 24 distinct, authored, high-quality 16:9 slide scenes, substantial presenter notes for every slide, high-contrast diagrams, accessible animations, keyboard navigation, slide/chapter jump, a timer, fullscreen, shortcut help, and reliable lab deep-link/return that preserves exact deck state. Include an accessible printable/handout view rather than depending on a proprietary slide-service API.

**Design:** premium 'Market Observatory' editorial visuals; midnight/teal/azure/amber/violet/rose palette from spec; rich but restrained Motion/React, CSS and SVG diagrams; appealing hero and meaningful microinteractions; readable for viewers watching a stream at 720p/1080p and on mobile. Provide text alternatives, readable focus, reduced-motion behavior and no distracting effects.

**Engineering:** Next.js App Router + strict TypeScript + Tailwind, accessible primitives, structured content files, deterministic fiction-only demo datasets, stable routes/deep links and comprehensive local test commands. No API key, backend, database, auth, live feed or paid external service is necessary for MVP.

## Critical constraints (must hold in every file)

- **Education only**: no live execution of trades, order forms, signals, copy-trading, custody/wallet connections, transfer mechanisms, personalized financial recommendations, real-time prices or paid flows.
- Sports betting may be described **only** to distinguish systems and discuss uncertainty, risks and harm. Do not create gambling product discovery, links to betting services, betting strategy, sample wagering scenarios, odds calculators, bet selectors, payout tables or playable betting simulation.
- Example numbers and charts must be demonstrably synthetic and visibly marked **'Illustrative only — not live data.'**
- Financial outcomes are uncertain; explain limitations and potential loss plainly. Do not imply skill guarantees returns or that forex, commodities, stocks or crypto are risk-free.
- Do not invent fact citations, pretend source links were checked, or make unsourced regulatory claims (especially Ghana-specific law).
- No secret access, destructive commands, installation of unrelated apps, cloud deployment, account connections, domain purchases or publication without explicit user authorization.

## Operating style for Claude Code

- **Take ownership** of ordinary design, tech and implementation decisions; do not interrupt with avoidable questions. Ask before irreversible/external operations or genuine material ambiguities.
- Develop in visible, coherent phases; maintain a short actionable plan and track completed and incomplete milestones on disk. If tools offer task tracking, use them without requiring a specific Claude Code version or capability.
- You may use available project subagents such as `editorial-reviewer` and `accessibility-reviewer` for narrowly scoped review, **if supported by your session**; use main context review if not.
- The repository has optional project skills `/build-marketwise`, `/presenter-review`, `/ship-check`; use them when useful, but do not depend on availability for the core build.
- Prefer readable maintainable code over a large bundle of decorative dependencies. Install only required maintained libraries with user-visible permission where appropriate; never silently install services.
- Make original illustrations in accessible SVG/CSS; favor clear labels and narrative animation over stock footage or gambling aesthetics.
- Keep project instruction files unless intentionally updating them. Where this pack's `README.md` needs major changes as the app matures, preserve initial setup guidance in a distinct `docs/` note or adapt carefully.

## Execution milestones — implement one by one

### Milestone 0 — inspect and initialize

Read docs; create realistic `IMPLEMENTATION_PROGRESS.md`; verify Node/npm tools; choose compatible dependencies; scaffold a working Next.js App Router project **in this existing folder** without overwriting requirements documents or `.claude/`. Establish scripts for dev, lint, typecheck, tests, E2E, build. Add visual tokens, a11y shell, semantic header/footer and responsive navigation.

### Milestone 1 — curriculum and structure

Build all routes in the specification. Implement five evidence-aware, fully written lessons with all 11 requested sections; clear mechanisms; proper actor/instrument/price distinctions; factual/source metadata; glossary terms; myths; comparison table with mobile fallback. Real educational content, no lorem ipsum, repeated filler or placeholder cards.

### Milestone 2 — interactive teaching labs

Implement deterministic conceptual diagrams: FX quote conventions, abstract leverage/loss sensitivity, fractional company ownership, qualitative commodity supply shift, toy distributed ledger journey, non-wagering uncertainty/probability. Each should have functional controls, explanatory captions, text equivalents, reset or replay when appropriate, good mobile ergonomics, and explicit limits/fiction labels. Avoid actionable trade or gambling mechanics.

### Milestone 3 — 24-slide presentation

Implement _all 24 scenes_ specified in the 24-slide storyboard. Each slide needs intentional visual hierarchy and substantive presenter notes, ~80–130 words as a baseline where suitable, transitions, talking points and audience-engagement cues. Set type sizes appropriate for screen capture. Build keyboard and click controls, progress, chapter nav, timer, fullscreen, notes drawer, shortcut overlay, printable handout, deep links and lab round-trip state restoration.

### Milestone 4 — visual and experience polish

Create rich opening hero, animated market constellation and topic identities; coherent motion states; branded vector diagrams; smooth but nonblocking page transitions; responsive storytelling sections; reduced-motion toggle; color/contrast checks; avoid unnecessary heavy 3D and inaccessible animations. Validate appearance at 360px mobile, tablet and 1920px capture sizes.

### Milestone 5 — verify and finish

Run _actual_ install, lint, typecheck, test suite, E2E smoke tests (at least major routes, slide controls, lab states and return navigation), accessibility checks and optimized build. Fix failures. Check all slides and routes exist. Inspect synthetic-data labels and risky financial/gambling content. Record tests **actually executed**, not aspirations. Document setup, local run, assets and source maintenance, deployment readiness, limitations and future roadmap. Do **not** deploy without consent.

## Non-negotiable acceptance

- All listed routes load with useful, complete content and working navigation.
- Five different systems are explained at an age-appropriate non-promotional level, comparing mechanisms fairly without treating 'trading' as inherently safe.
- Six meaningful, safe labs with controls, explanations and no real transactions/wagers.
- **Exactly 24** substantive, distinct slide scenes, meaningful speaker notes and complete presenter UX.
- UI is visually professional, modern, animated purposefully and accessible without motion.
- Every quiz gives factual correction; all important claims cite legitimate verifiable sources.
- `npm` scripts and production build work, with test results honestly recorded.
- `IMPLEMENTATION_PROGRESS.md` lists completed work, unresolved items and follow-up tasks.

## Final response format after implementation

Summarize: (1) what was actually built, (2) files/routes created, (3) how to run locally, (4) check results with exact commands, (5) what remains, (6) deployment readiness and steps requiring my approval. Do not report a launched/public site unless you actually deployed it with authorization.

**Now begin Milestone 0 and progress into implementation. Do not stop after explaining a plan.**

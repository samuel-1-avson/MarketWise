# MARKETWISE — Implementation checklist and acceptance tracker

> This is the **target checklist**, not a report of completed work. Claude Code must maintain `IMPLEMENTATION_PROGRESS.md` separately with test evidence and dates. Never check boxes without inspecting real working code.

## Phase 0 · Foundation

- [ ] Read specification, Claude Code rules and referenced guides.
- [ ] Inspect directory and runtime; avoid overwriting existing files.
- [ ] Scaffold Next.js App Router + TS + Tailwind; TypeScript strict mode enabled.
- [ ] Add working package scripts for dev, lint, typecheck, test, test:e2e and build.
- [ ] Global color and spacing tokens, responsive header/footer, navigation and typography.
- [ ] Accessible skip-link, focus styles, reduced motion, semantic headings, labels.
- [ ] Define lesson, source, slide, quiz and lab schemas; validate representative data.

## Phase 1 · Curriculum and pages

- [ ] Landing, Explore index, five lesson routes, Compare, Labs, Myths, Quiz, Glossary, Resources, About, Present.
- [ ] Complete forex curriculum, including physical exchange versus retail derivatives.
- [ ] Complete stocks curriculum, including ownership versus guaranteed profit.
- [ ] Complete commodities curriculum, including spot versus futures and physical uses.
- [ ] Complete crypto curriculum, including networks, custody concepts and risk.
- [ ] Complete sports betting critical-literacy lesson with **no** gambling instructions or services.
- [ ] Five subjects have clear object/actor/mechanism/risk distinctions.
- [ ] Each lesson has 11 curriculum sections, lesson-specific graphics, misconceptions and source metadata.
- [ ] Responsive comparison with text table/accordion alternative, clickable dimensions and clear labels.
- [ ] Searchable glossary and myths/fact citations; no dead route or lorem ipsum.

## Phase 2 · Safe simulations and learning UX

- [ ] Fictional FX quotation / two-currency explanatory arrows (not an execution tool).
- [ ] Abstract leverage sensitivity (no position size or trading guidance).
- [ ] Fictional fractional equity ownership model.
- [ ] Qualitative cocoa/gold/commodity supply-shock graphic.
- [ ] Conceptual crypto validation and ledger story without live transactions.
- [ ] Non-wagering uncertainty/probability tiles, not tied to any sports outcome.
- [ ] Working keyboard/touch controls and plain-language textual alternative in each lab.
- [ ] Reset states, deterministic samples, error handling, unit tests and synthetic-data labels.
- [ ] Concepts quiz gives explanatory feedback, accessible focus and retry behavior.

## Phase 3 · Livestream presentation

- [ ] Slides 01–06 implemented and speaker notes written.
- [ ] Slides 07–12 implemented and speaker notes written.
- [ ] Slides 13–18 implemented and speaker notes written.
- [ ] Slides 19–24 implemented and speaker notes written.
- [ ] Validate **exactly 24** unique slides and slide-specific visuals.
- [ ] Notes useful for ~40–60-minute presentation with lab breaks.
- [ ] Next/previous/Home/End, fullscreen F, notes N, timer T and help ?.
- [ ] Presenter responsive at 1920×1080 and 1280×720 capture and smaller devices.
- [ ] Slide deep links, chapter navigator, progress and lab return restore exact slide.
- [ ] Printable/exportable HTML handout with accessible summaries and sources.
- [ ] All keyboard commands ignore typing in inputs and work with focus rules.

## Phase 4 · Visual quality and inclusion

- [ ] Market Observatory design tokens faithfully reflected.
- [ ] Original illustrative SVG assets for each system and comparison.
- [ ] Purposeful motions and data storytelling; reduced-motion mode truly removes them.
- [ ] Good contrast, readable type, focus indicators, accessible links, no color-only signals.
- [ ] No overflows/hidden labels at 360px, 768px, 1280px and 1920px.
- [ ] Fast page transitions; no external video, stock watermarks or heavy idle animation.
- [ ] SEO, metadata, sitemap, shareable lesson routes and favicon/brand identity.

## Phase 5 · Final verification and handoff

- [ ] Verify sources and displayed claims; date review; note jurisdiction caveats.
- [ ] Ensure no investments promises, services, real-time data, wagering tools or recruitment.
- [ ] Run and record `lint`, `typecheck`, unit, E2E, accessibility and `build`.
- [ ] Manually exercise the slide deck, 6 labs and navigation in a real browser when available.
- [ ] Update app README and `IMPLEMENTATION_PROGRESS.md` with exact local steps/results.
- [ ] Confirm no credentials/secrets in source, no external requests without necessity.
- [ ] Provide deployment readiness assessment; ask before actually deploying.

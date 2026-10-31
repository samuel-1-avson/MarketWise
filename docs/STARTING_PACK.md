# MARKETWISE — original implementation pack

This note preserves the instructions that shipped with the design pack, before the working app replaced the root `README.md`.

**Interactive Market Literacy Studio** | Claude Code edition | 2026-10-30

The pack contained the product specification and build instructions for an educational website and an integrated **24-scene livestream presentation**. It was a blueprint, not a finished site. The application now lives in this folder. How to run it is in the root `README.md`. What was actually built and tested is in `IMPLEMENTATION_PROGRESS.md`.

The site compares five systems: **forex, stocks, commodities, cryptocurrency and sports betting** (sports betting is handled only as high-level risk and critical-literacy content). It uses fictional datasets, interactive explainers, diagrams, quizzes, source-backed lessons and presenter controls. It contains **no real-money trading, wallet, brokerage or gambling functionality**.

## How the pack was meant to be started

1. Extract the ZIP into a working folder and keep the hidden `.claude` folder intact.
2. Open that folder in a terminal. Node.js 20.9 or newer is required.
3. Read `CLAUDE.md`, `CLAUDE_CODE_MASTER_PROMPT.md` and `PRODUCT_AND_BUILD_SPEC.md`, then implement in phases and update `IMPLEMENTATION_PROGRESS.md` after each phase.
4. Do not deploy without explicit approval.

**Optional helpers:** `.claude/skills/` (`build-marketwise`, `presenter-review`, `ship-check`) and `.claude/agents/` (editorial and accessibility review). They are workflow notes, not required plugins.

## Files that are still the specification

| File                               | Why it exists                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| `PRODUCT_AND_BUILD_SPEC.md`        | Product, education, design, routes, labs, storyboard and safety requirements. |
| `CLAUDE_CODE_MASTER_PROMPT.md`     | Phased build assignment.                                                      |
| `CLAUDE.md`                        | Project rules.                                                                |
| `IMPLEMENTATION_CHECKLIST.md`      | Target checklist. It is not a record of completed work.                       |
| `IMPLEMENTATION_PROGRESS.md`       | Factual build log.                                                            |
| `PRESENTATION_AND_STREAM_GUIDE.md` | How to run the 24-scene talk.                                                 |
| `VISUAL_DESIGN_GUIDE.md`           | Colour, type and motion.                                                      |
| `EDITORIAL_ACCURACY_GUIDE.md`      | Citations, fictional data and safety.                                         |
| `DEPLOYMENT_READINESS.md`          | What would have to be true before publishing. Nothing has been deployed.      |

## Scope and release safety

This is educational content for a general audience, including young learners. It must never solicit deposits or encourage real-money speculation or gambling. Diagrams that use sample numbers say **Illustrative only — not live data**. The site is not personal financial advice. External sources are starting points. Verify them before any launch.

**No deployment is authorized by this pack.** Ask for explicit approval before publishing or connecting a hosting account.

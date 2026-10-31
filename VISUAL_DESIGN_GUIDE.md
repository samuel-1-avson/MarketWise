# MARKETWISE — Interactive visual and motion system

## Visual intent

A premium, animated **Market Observatory**: educational science-museum storytelling with sophisticated editorial data graphics. Contrast busy financial-desk or casino aesthetics by providing clarity, hierarchy and a calm investigative tone.

## Brand and palette

| Role                     | Color     | Intended use                         |
| ------------------------ | --------- | ------------------------------------ |
| Base midnight            | `#091225` | Backgrounds                          |
| Raised surface           | `#111E35` | Sections/cards                       |
| Main text                | `#F4F7FC` | Body and headings                    |
| Secondary text           | `#AFC0D2` | Supporting copy                      |
| Forex teal               | `#3EE0CB` | Currency topic identity              |
| Stocks azure             | `#77B6FF` | Equity topic identity                |
| Commodities amber        | `#F1BC60` | Physical-goods identity              |
| Crypto violet            | `#B99BFF` | Ledger/network identity              |
| Wagering comparison rose | `#E99BA5` | Neutral risk-literacy topic identity |

Check text contrast programmatically; topic colors are **not** arbitrary profit/loss indicators and must not be the sole meaning channel.

## Composition and typography

- Readable fonts: Space Grotesk for concise display text and Inter (or strong system fallback) for paragraphs. Load locally/efficiently if practical; avoid render-blocking font dependence.
- Hero should explain the learning premise, with five distinct illustrative orbital concepts, gentle depth movement and clear 'Explore' and 'Presentation' entry points.
- Topic pages use hero explainer → mechanism diagram → actors → fictional narrative → risk panel → lab → myth correction → quiz → sources.
- Presenter typography should be significantly larger than typical desktop article fonts; center the teaching visual, not miniature tables.
- At narrow widths, collapse visual matrices into accessible comparison cards/accordions without losing facts.

## Six core visual experiments

| Concept          | Suggested visualization                           | Interaction                                           | Interpretation shown                                                |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| FX quote         | two currency plates + direction arrows            | switch base/quote, step through invented quote values | a quote describes relative exchange value                           |
| Risk sensitivity | expanding sensitivity bands                       | None / Low / High concept tabs                        | leverage amplifies potential loss; not guidance for position choice |
| Stock ownership  | 1,000-cell company mosaic                         | adjust number of hypothetical shares                  | ownership fraction is not a guaranteed payout                       |
| Supply shock     | stylized supply/demand chart + cocoa supply chain | hypothetical weather/logistics toggle                 | supply changes may shift price incentives, not a forecast           |
| Ledger           | transaction record → validation → append sequence | next/previous steps                                   | validation and record-keeping concepts; no wallet or transfers      |
| Uncertainty      | abstract colored tiles and outcomes               | step/replay/reset non-wagering probabilities          | uncertainty remains even with information                           |

Use original SVG and text or accessible tables. Keep illustrative charts clearly fictional, with a text-based description of what changed in response to input.

## Motion tokens and interactions

- Hover/focus transitions: 180–250 ms; panel transitions ~300–450 ms; major presentational entrances ~750–1100 ms where justified.
- Prefer CSS or Motion for React, not animation for animation's sake.
- All reveals should be interruptible and content accessible at any animation stage.
- Honor `prefers-reduced-motion` globally; add local toggle if desired.
- Avoid autoplay audio, dense parallax, flashing, celebratory gain animations and large GPU-heavy scenes.
- Create stable idle states for a livestream capture so charts do not keep moving while presenter speaks.

## Component contract

- Every control has real behavior, pointer+keyboard semantics, focus and hover state.
- Every diagram includes a short summary and alt/text-equivalent panel with current state.
- Distinguish fictional examples visually and textually, not with color alone.
- Components should be composable, responsive, testable and named for their educational intention.
- Provide offline-friendly deterministic defaults so the presenter never waits for an external market feed.

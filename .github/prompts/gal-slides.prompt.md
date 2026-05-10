---
description: "Generate a Golden Age Learning Slide Deck presentation from Markdown content"
---

# GAL Slides — Slide Deck

Follow all shared rules in [copilot-instructions.md](../copilot-instructions.md). This prompt produces a **Slide Deck** presentation component.

These presentations are shown on projectors in classrooms to an audience aged 55+. Text must be readable from the back of a room, slides must feel full and balanced, and the visual language must be consistent from first slide to last.

---

## Brand Colors

| Name | Hex | Used For |
|---|---|---|
| Background | `#252D32` | Every slide background |
| Cream | `#FAF5C9` | Titles, primary text |
| Orange | `#EC8B24` | Accents, top bar, icon circles, card borders, step circles |
| White | `#FFFFFF` | Body text, icons that need contrast inside orange frames |
| Muted Cream | `#C8C199` | Secondary labels (class number, location text) |
| Card Background | `#1E272C` | Interior fill of content cards and boxes |

## Typography — Base Sizes

All sizes are `vw`-based. Reference viewport is 1280px wide.

| Element | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Content slide h2 | `3.5vw` | Bold (Garamond) | `#FAF5C9` | Centered, lower-positioned |
| Title slide main title | `3.5vw` | Bold (Garamond) | `#FAF5C9` | Centered |
| Title slide subtitle | `1.9vw` | Regular (Lato) | `#EC8B24` | Centered |
| Class label | `1.4vw` | Regular (Lato) | `#C8C199` | Centered |
| Overview agenda items | `1.8vw` | Regular (Lato) | `#FFFFFF` | Two-column list |
| Checklist / summary items | `2vw` | Regular (Lato) | `#FFFFFF` | Two-column when 4+ items |
| Step text | `1.8vw` | Regular (Lato) | `#FFFFFF` | Two-column when 4 steps |
| Card label / section label | `1.6vw` | Bold (Lato) | `#EC8B24` | — |
| Body / description text | `1.5vw` | Regular (Lato) | `#FFFFFF` | Scale up for single-paragraph slides |
| Tip box label | `1.4vw` | Bold (Lato) | `#EC8B24` | — |
| Tip box body | `1.3vw` | Regular (Lato) | `#FFFFFF` | — |
| Numbered circle text | `1.75vw` | Bold (Lato) | `#FFFFFF` | — |
| Closing "Thank You!" | `3.5vw` | Bold (Garamond) | `#FAF5C9` | Centered |
| Closing next-class line | `1.9vw` | Regular (Lato) | `#EC8B24` | Centered |
| Closing location line | `1.4vw` | Regular (Lato) | `#C8C199` | Centered |

## Content Slide h2 Standard

Applies to every content slide (all layouts except Title and Closing):
- **Font:** Garamond Bold, `3.5vw`
- **Color:** `#FAF5C9`
- **Alignment:** Horizontally centered — never left-aligned
- **Vertical position:** Upper-middle area, `4–6%` of slide height below the top bar

## Persistent Elements

**Small circular logo** — bottom-right corner of every slide, `~4vw` wide.

**Orange top accent bar** — all content slides only (not title or closing). Full-width, `~1.2vh` tall, solid `#EC8B24`, flush to top edge.

## Slide Structure

Target **12–13 slides**. Do not pad with invented material; do not compress concepts that deserve their own slide.

| Position | Role |
|---|---|
| Slide 1 | Title slide |
| Slide 2 | Overview — agenda |
| Slides 3–10 | Core content — one concept per slide |
| Slide 11 | Summary / "You've Mastered It!" |
| Slide 12 | Game Time / Activity |
| Slide 13 | Closing — "Thank You!" |

---

## HANDLING PHOTOS, ANIMATIONS, AND DIAGRAMS

### Core Principle: Extract Intent, Don't Chase the Description

Every image description has a **teaching intent**. Identify that intent and serve it using brand colors, typography, emoji, CSS shapes, and the defined layouts.

| Description type | Teaching intent | What to build |
|---|---|---|
| Photo of smiling senior | Warmth, approachability | Large emoji + warm layout |
| Emoji collage (15–20) | Visual abundance, fun | Grid of large emojis |
| Game show graphic | Energy, fun, transition | Large game emoji, Layout 9 |
| Gold medal with icon | Achievement, celebration | Large emoji combo, Layout 8 |
| Microphone icon | The concept IS the icon | Large centered emoji in icon circle, Layout 5 |

### Slides with Too Many Items
When 5+ short items won't fit a layout comfortably, use **Layout 2 — Overview/Agenda** with a two-column list. A cramped slide is a brand failure.

### Multi-Panel Diagram Descriptions
- Before/after or two-state → **Layout 7 — Two-Column Content Cards**
- Step-by-step (3–4 steps) → **Layout 6 — Two-Column Steps**
- Single concept in context → **Layout 5 — Icon + Tip**

Never improvise a custom panel layout. Always map to an existing layout type.

### Full-Slide Diagram Descriptions
Extract labeled elements, treat as a list. Use **Layout 4** or **Layout 8**. For keyboard part labels, render styled HTML key-cap elements.

### Animations
**Do not implement:** sliding panels, appearing elements, letters one at a time, decorative motion.
**Only implement if motion teaches the concept:** blinking cursor (`@keyframes blink`, `1s step-end infinite`), pulsing icon for that specific interaction.

### Keyboard Diagrams
Key cap: `border: 1px solid #EC8B24`, `borderRadius: 4px`, `padding: 4px 8px`, `backgroundColor: #1E272C`, `color: #FFFFFF`, `fontFamily: Lato`. Label in `#EC8B24`.

---

## SLIDE LAYOUT TYPES

### LAYOUT 1 — Title Slide
No orange top bar. Centered vertical composition.
- **Large focal logo** — centered, upper portion, `18vw × 18vw`, `borderRadius: 50%`, `objectFit: cover`
- Main title — Garamond Bold `3.5vw`, `#FAF5C9`
- Subtitle — Lato `1.9vw`, `#EC8B24`
- Class label — Lato `1.4vw`, `#C8C199`
- Small logo — bottom-right
- Both logos required on title slide

### LAYOUT 2 — Overview / Agenda
For "What We'll Learn Today" or 5–8 agenda items.
- Orange top bar
- h2 centered, standard treatment
- Two-column list: Lato `1.8vw`, `#FFFFFF`, small `#EC8B24` bullet/dash
- Columns center-aligned as a block; items left-align within each column
- Text scales to fill — no empty lower half

### LAYOUT 3 — Three-Column Cards
Exactly 3 parallel topics, each needing icon + label + description.
- Orange top bar, h2 centered
- Three equal-width cards: `#1E272C` bg, `#EC8B24` border
- Icon/emoji, card title (Lato Bold `1.6vw`, `#EC8B24`), description (Lato `1.35vw`, `#FFFFFF`)

### LAYOUT 4 — Diagram + Row List
Visual left, labeled items right.
- Orange top bar, h2 centered
- Left ~35%: image, styled diagram, or emoji placeholder
- Right: up to 3 rows with orange accent bar, icon, title (Lato Bold `1.6vw`, `#EC8B24`), description (Lato `1.5vw`, `#FFFFFF`)

### LAYOUT 5 — Icon + Tip
Single-concept slides with one key visual.
- Orange top bar, h2 centered
- **Left — icon circle:** Orange-bordered circle (`#EC8B24`, 2–3px), `#252D32` fill. Icon/emoji centered inside, white (`#FFFFFF`) when needed for contrast. Start ~`22vw` diameter; use same size across all icon slides.
- **Right:** Body text Lato `1.5vw` (scale to `1.7vw` for single paragraph). Tip box if present: `#1E272C` bg, `#EC8B24` border, "💡 Tip" label (Lato Bold `1.4vw`, `#EC8B24`), body (Lato `1.3vw`, `#FFFFFF`). Size tip box to content — don't stretch for short tips.

### LAYOUT 6 — Two-Column Steps
3–4 short steps.
- Orange top bar, h2 centered
- Steps split two columns: filled orange circle with white number (Lato Bold `1.75vw`), step text (Lato `1.8vw`, `#FFFFFF`)
- Column block centered; steps aligned at shared left edge
- Optional callout box: `#1E272C` bg, `#EC8B24` border

### LAYOUT 7 — Two-Column Content Cards
Contrasting two states, options, or before/after.
- Orange top bar, h2 centered
- Two equal cards: `#1E272C` bg, `#EC8B24` 1px border
- Heading: Lato Bold `1.6vw`, `#EC8B24`. Body: Lato `1.5vw`, `#FFFFFF`
- Generous padding

### LAYOUT 8 — Checklist / Summary
Recap and "You've mastered it" slides.
- Orange top bar, h2 centered
- **4+ items:** Two-column checklist. Orange circle + white ✓, text Lato `2vw`, `#FFFFFF`
- **3 or fewer:** Single centered column
- Text is large — this is a celebration slide

### LAYOUT 9 — Simple Focus / Activity
"Game Time", "Time to Practice", minimal transition.
- Orange top bar, h2 centered
- Subtitle: Lato `1.9vw`, `#EC8B24`, centered
- Optional large emoji `8–10vw`
- Keep simple and uncluttered

### LAYOUT 10 — Closing Slide
Last slide. No orange top bar. Mirrors title slide.
- Large focal logo centered, `18vw × 18vw`
- "Thank You!" — Garamond Bold `3.5vw`, `#FAF5C9`
- Thin orange rule below title, ~`40%` width
- Next class: Lato `1.9vw`, `#EC8B24`
- Location: "Golden Age Learning  •  Manatee & Sarasota Counties, Florida" — Lato `1.4vw`, `#C8C199`

### Layout Selection Guide

| Content signal | Use layout |
|---|---|
| Opening slide | Layout 1 |
| Agenda list 5–8 items | Layout 2 |
| 3 topics each with icon + card | Layout 3 |
| Visual left, labeled items right | Layout 4 |
| Single concept + icon + optional tip | Layout 5 |
| 3–4 numbered steps | Layout 6 |
| Two contrasting states/options | Layout 7 |
| Recap / "What you've learned" | Layout 8 |
| Game time, practice, transition | Layout 9 |
| Closing / Thank You | Layout 10 |

Default when unclear: **Layout 5 (Icon + Tip)**.

---

## DECK-WIDE CONSISTENCY RULES

1. **Icon circle size** — establish once, use the same size on every icon slide
2. **h2 treatment** — every content slide uses the same centered, lower-positioned h2
3. **Column layouts** — once established, apply consistently to all similar slides
4. **Empty space** — no slide should have a visually empty lower half
5. **Balance** — every slide must feel visually balanced

## NAVIGATION

- Arrow keys (left/right) to move between slides
- On-screen Previous / Next buttons
- Slide counter in `#C8C199`

## RESPONSIVE SIZING

- 16:9 aspect ratio at all viewport sizes via `aspect-ratio: 16/9`
- All fonts use `vw` units — never fixed `pt` or `px`
- All spacing uses proportional units (`%` or `vw`)
- Test mentally at 1024px, 1280px, and 1920px

---

## CHECKLIST

### Every Slide — Universal

- [ ] Background is `#252D32`
- [ ] Small circular logo bottom-right, ~`4vw`
- [ ] No text overflows
- [ ] Lower half is not visually empty
- [ ] Slide feels balanced
- [ ] No invented content

### Title Slide (Slide 1)

- [ ] No orange top bar
- [ ] Large focal logo centered, `18vw × 18vw`, `borderRadius: 50%`
- [ ] Main title: Garamond Bold `3.5vw`, `#FAF5C9`
- [ ] Subtitle: Lato `1.9vw`, `#EC8B24`
- [ ] Class label: Lato `1.4vw`, `#C8C199`
- [ ] Both logos present (large + small)

### Content Slides (2 through second-to-last)

- [ ] Orange top bar: full width, `~1.2vh`, `#EC8B24`, flush top
- [ ] h2: Garamond Bold `3.5vw`, `#FAF5C9`, centered, upper-middle zone
- [ ] Body text uses Lato with `vw` sizing
- [ ] Orange accents use exactly `#EC8B24`
- [ ] Cards/boxes use `#1E272C` fill
- [ ] Layout-specific rules met (see layout descriptions above)

### Closing Slide (Last)

- [ ] No orange top bar
- [ ] Large focal logo centered, `18vw × 18vw`
- [ ] "Thank You!" Garamond Bold `3.5vw`, `#FAF5C9`
- [ ] Thin orange rule below title
- [ ] Next class line: Lato `1.9vw`, `#EC8B24`
- [ ] Location line: Lato `1.4vw`, `#C8C199`

### Final Deck Check

**Assets**
- [ ] Logo embedded as inline base64
- [ ] Garamond loaded from local path via `@font-face`
- [ ] Lato loaded from local path via `@font-face`
- [ ] Font names registered via `@theme {}` or inline style props
- [ ] No Tailwind default font classes on branded elements

**Structure**
- [ ] 12–13 slides total
- [ ] Slide 1 is Title — no top bar, large logo
- [ ] All content slides have orange top bar
- [ ] Last slide is Closing — no top bar, large logo
- [ ] Small logo on every single slide

**Consistency**
- [ ] Icon circle size identical across all icon slides
- [ ] Two-column layout used consistently for 4+ item lists
- [ ] No visually empty lower halves
- [ ] Every slide balanced

**Navigation**
- [ ] Arrow keys work
- [ ] On-screen buttons work
- [ ] Slide counter in `#C8C199`

- [ ] Component file at correct `(admin)` route group path
- [ ] Entry added to `CLASSES` manifest

✅ **Deck complete**

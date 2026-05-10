---
description: "Generate a Golden Age Learning Worksheet print page from Markdown content"
---

# GAL Worksheet — Print Page

Follow all shared rules in [copilot-instructions.md](../copilot-instructions.md). This prompt produces a **Worksheet** print page.

Open and study the visual reference before writing any code:
`/Volumes/Work/Face2Face/Golden Age Learning/Classes/1 Smartphone Basics/Class 1_ Worksheet Meet Your Smartphone.pdf`

---

## Brand Colors

| Name | Hex | Used For |
|---|---|---|
| Gold | `#EC8B24` | Bullets, borders, table borders, document type word in title |
| Gold Light | `#FAF5C9` | Left side of gradient rules only |
| Black | `#000000` | All body text, section headers, subject words in title |
| White | `#FFFFFF` | Page background — always pure white |

## Typography

All text uses **Arial**. No other font. No Garamond, no Lato, no Tailwind font defaults.

| Element | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Page header | 14pt | Regular | Black | Centered. Always reads: "Golden Age Learning: Workshop Course Materials" |
| Title — subject words | 26pt | Bold | Black | Same line as document type word |
| Title — document type word | 26pt | Bold | `#EC8B24` | **Always gold. No exceptions.** |
| Section header | 20pt | Bold | Black | Format: "Part N: Title" |
| Instruction text | 12pt | Regular | Black | In parentheses, below section header |
| Bullet text | 12pt | Regular | Black | **Always underlined** |
| Table header cell | 14pt | Bold | Black | Centered in cell |
| Table data cell | 14pt | Italic | Black | **Always italic** |
| Student Name label | 12pt | Regular | Black | Inside gold-bordered box |
| Answer line label | 12pt | Bold | Black | Bold label + underline to right margin |
| Footer copyright | 11pt | Regular | Black | Right-aligned |

## Gradient Rule

Full-width horizontal bar, 4pt tall, `linear-gradient(to right, #FAF5C9, #EC8B24)`.

Three locations: below header (every page), below title (Page 1 only), above footer (every page). Page 1 always has two gradient rules.

> ⚠️ Add `-webkit-print-color-adjust: exact; print-color-adjust: exact;` to every gradient rule element.

## Page 1 Layout — Top to Bottom

1. **Page header** — "Golden Age Learning: Workshop Course Materials" — centered, Arial Regular 14pt
2. **No logo** — Worksheets have no logo in the header (text-only header)
3. **Gradient Rule #1**
4. **Document title** — Subject words in black + "Worksheet" in gold `#EC8B24` — same line, Arial Bold 26pt
5. **Gradient Rule #2**
6. **Breathing space**
7. **Student Name field** — full-width, `#EC8B24` 1pt border, white interior, "Student Name:" left-aligned
8. **Body content**
9. **Footer**

## Continuation Pages (Page 2+)

- Page header (identical to Page 1)
- Gradient rule below header
- Continuing body content
- Footer (identical to Page 1)

**Do not** repeat the title, second gradient rule, or Student Name field.

## Body Content — Worksheet-Specific

### Bullet Lists
- Bullet circle: `●`, color `#EC8B24` — never black
- Text: Arial Regular 12pt, black, **always underlined**

### Tables (Matching Exercises)
- All borders: `#EC8B24`, 1pt — never black or gray
- Background: white — no fill
- Header row: Arial Bold 14pt, centered
- Data cells: Arial Italic 14pt — **always italic**
- Middle column intentionally blank

### Answer Lines (Write-In)
- Bold label followed by an underline extending to the right margin
- Example: `1. Phone App: _______________`
- Generous line spacing for handwriting room

### Practice Boxes
- Bordered rectangle: `#EC8B24` 1pt border, white background
- Full content width
- Tall enough for handwriting

## Footer

Present on **every page — no exceptions**.

| Element | Detail |
|---|---|
| Gradient rule | Full width, `#FAF5C9` → `#EC8B24`, directly above footer content |
| Logo | Circular logo, small, bottom-left |
| Copyright | `© 2024-2026 Golden Age Learning` — Arial Regular 11pt, right-aligned |

---

## PAGE LAYOUT BUDGET

> ⚠️ **Hard limits.** Every worksheet page must be planned against this budget before any code is written.

### Global Constants

| Value | Amount |
|---|---|
| Total page height | 11.00 in |
| Top padding | − 0.75 in |
| Bottom clearance (footer reserve) | − 1.20 in |
| **Usable vertical flow area** | **9.05 in = 868.8 px** |

### Component Height Constants

| Component | Height |
|---|---|
| Page header line block | 29 px |
| Gradient rule | 5 px |
| Title block (Page 1) | 55.2 px |
| Student Name block (Page 1) | 76 px |
| Section header block | 34 px |
| Activity heading block | 24 px |
| One bullet row (single line) | 26.4 px |
| Practice box total footprint | box height + 26 px |
| Emoji row block | 50 px |

### Page 1 Budget

| Stack item | Height |
|---|---|
| Header | 29 px |
| Gradient Rule #1 | 5 px |
| Title block | 55.2 px |
| Gradient Rule #2 | 5 px |
| Student Name block | 76 px |
| **Fixed top subtotal** | **170.2 px** |
| **Remaining for body** | **698.6 px** |

Recommended caps: Part 1 → 240 px, Part 2 → 430 px, safety buffer → 28.6 px.

### Page 2 Budget

| Stack item | Height |
|---|---|
| Header | 29 px |
| Gradient rule | 5 px |
| Top spacer | 20 px |
| **Fixed top subtotal** | **54 px** |
| **Remaining for body** | **814.8 px** |

Recommended caps: Part 2 Continued → 230 px, Part 3 heading band → 48 px, Activity D → 160 px, Activity E → 160 px, Activity F → 216 px.

### Maximum Practice Box Heights

| Box | Max height |
|---|---|
| Activity C | 60 px |
| Activity D | 56 px |
| Activity E | 56 px |
| Activity F | 62 px |

> If a new activity type doesn't appear above, calculate its space from the remaining page budget.

---

## CHECKLIST

### Page 1

**Assets**
- [ ] Visual reference PDF opened and studied
- [ ] Logo file found and embedded as inline base64
- [ ] Arial applied via inline `style` prop — no `@font-face`
- [ ] No Tailwind font classes used

**Header**
- [ ] Header reads exactly: "Golden Age Learning: Workshop Course Materials"
- [ ] **No logo in header** — Worksheets are text-only header

**Gradient Rules**
- [ ] Rule #1 below header, Rule #2 below title
- [ ] Both go left `#FAF5C9` → right `#EC8B24`
- [ ] Page 1 has exactly two gradient rules
- [ ] Every rule has `print-color-adjust: exact`

**Title**
- [ ] Subject words: Arial Bold 26pt, black
- [ ] "Worksheet": Arial Bold 26pt, gold `#EC8B24`
- [ ] Both on the same line

**Student Name Field**
- [ ] Full content width, `#EC8B24` 1pt border, white interior
- [ ] "Student Name:" left-aligned inside

**Body Content**
- [ ] All fonts are Arial
- [ ] Background is pure white `#FFFFFF`
- [ ] Bullet circles are gold `#EC8B24`
- [ ] Bullet text is underlined
- [ ] Table borders are `#EC8B24`
- [ ] Table data cells are italic
- [ ] Practice boxes have `#EC8B24` border and white interior
- [ ] No invented content

**Page 1 Layout Budget**
- [ ] Fixed top stack = **170.2 px**
- [ ] Remaining body = **698.6 px**
- [ ] Part 1 ≤ 240 px
- [ ] Part 2 ≤ 430 px
- [ ] Practice box heights match maximums

**Footer**
- [ ] Gradient rule above footer
- [ ] Logo bottom-left, copyright bottom-right
- [ ] Copyright reads exactly: `© 2024-2026 Golden Age Learning`
- [ ] Bottom padding is `1.2in`
- [ ] `__LOGO_BASE64__` placeholder replaced

### Continuation Pages

- [ ] Header identical to Page 1 (no logo)
- [ ] One gradient rule below header
- [ ] No title, no second gradient rule, no Student Name field
- [ ] Fixed top stack = **54 px**, remaining = **814.8 px**
- [ ] Section allocations within caps
- [ ] Practice box heights match maximums
- [ ] Body content rules all pass
- [ ] Footer identical to Page 1
- [ ] Component file at correct `(admin)` route group path
- [ ] Entry added to `CLASSES` manifest

✅ **Worksheet complete**

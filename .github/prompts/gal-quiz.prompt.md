---
description: "Generate a Golden Age Learning Quiz print page from Markdown content"
---

# GAL Quiz — Print Page

Follow all shared rules in [copilot-instructions.md](../copilot-instructions.md). This prompt produces a **Quiz** print page.

Open and study the visual reference before writing any code:
`/Volumes/Work/Face2Face/Golden Age Learning/Classes/1 Smartphone Basics/Class 1_ Quiz Meet Your Smartphone.pdf`

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
| Multiple choice question | 12pt | Bold | Black | Number + full question in bold |
| Multiple choice options | 12pt | Regular | Black | Indented, lettered a) b) c) |
| Bullet text | 12pt | Regular | Black | **Always underlined** |
| Table header cell | 14pt | Bold | Black | Centered in cell |
| Table data cell | 14pt | Italic | Black | **Always italic** |
| Student Name label | 12pt | Regular | Black | Inside gold-bordered box |
| Footer copyright | 11pt | Regular | Black | Right-aligned |

## Gradient Rule

Full-width horizontal bar, 4pt tall, `linear-gradient(to right, #FAF5C9, #EC8B24)`.

Gradient rules appear in exactly **three locations**:
1. Below the page header — on every page
2. Below the document title — on Page 1 only
3. Above the footer — on every page

Page 1 always has two gradient rules. This is correct and intentional.

> ⚠️ Add `-webkit-print-color-adjust: exact; print-color-adjust: exact;` to every gradient rule element.

## Page 1 Layout — Top to Bottom

1. **Page header** — "Golden Age Learning: Workshop Course Materials" — centered, Arial Regular 14pt
2. **Logo** — Circular logo, top-right, vertically aligned with header text. Use these exact inline styles:
   ```
   position: "absolute", right: 0, top: "50%",
   transform: "translateY(calc(-50% - 10px))",
   width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover"
   ```
   The header container must have `position: "relative"`.
3. **Gradient Rule #1**
4. **Document title** — Subject words in black + "Quiz" in gold `#EC8B24` — same line, Arial Bold 26pt
5. **Gradient Rule #2**
6. **Breathing space**
7. **Student Name field** — full-width, `#EC8B24` 1pt border, white interior, "Student Name:" left-aligned inside
8. **Body content**
9. **Footer**

## Continuation Pages (Page 2+)

- Page header (identical to Page 1)
- Gradient rule below header
- Continuing body content
- Footer (identical to Page 1)

**Do not** repeat the title, second gradient rule, or Student Name field.

## Body Content — Quiz-Specific

### Multiple Choice
- State "Circle the best answer for each question" once at the top of the quiz body
- Question: Arial Bold 12pt — number + full question text
- Options: Arial Regular 12pt, indented, lettered a) b) c)

### Bullet Lists
- Bullet circle: `●`, color `#EC8B24` — never black
- Text: Arial Regular 12pt, black, **always underlined**

### Tables (Matching Exercises)
- All borders: `#EC8B24`, 1pt — never black or gray
- Background: white — no fill
- Header row: Arial Bold 14pt, centered
- Data cells: Arial Italic 14pt — **always italic**
- Middle column intentionally blank

## Footer

Present on **every page — no exceptions**.

| Element | Detail |
|---|---|
| Gradient rule | Full width, `#FAF5C9` → `#EC8B24`, directly above footer content |
| Logo | Circular logo, small, bottom-left |
| Copyright | `© 2024-2026 Golden Age Learning` — Arial Regular 11pt, right-aligned |

## Quiz vs Worksheet Reminder

Quizzes have: logo in header, multiple choice questions, "Quiz" as the gold title word. Quizzes do NOT have: practice boxes, answer write-in lines.

---

## CHECKLIST

### Page 1

**Assets**
- [ ] Visual reference PDF opened and studied
- [ ] Logo file found and embedded as inline base64
- [ ] Arial applied via inline `style` prop — no `@font-face` needed
- [ ] No Tailwind font classes used

**Header**
- [ ] Header reads exactly: "Golden Age Learning: Workshop Course Materials"
- [ ] Circular logo positioned top-right with exact inline styles
- [ ] Header container has `position: relative`

**Gradient Rules**
- [ ] Rule #1 below header, Rule #2 below title
- [ ] Both go left `#FAF5C9` → right `#EC8B24`
- [ ] Page 1 has exactly two gradient rules
- [ ] Every rule has `print-color-adjust: exact`

**Title**
- [ ] Subject words: Arial Bold 26pt, black
- [ ] "Quiz": Arial Bold 26pt, gold `#EC8B24`
- [ ] Both on the same line

**Student Name Field**
- [ ] Full content width, `#EC8B24` 1pt border, white interior
- [ ] "Student Name:" left-aligned inside
- [ ] Breathing space above it

**Body Content**
- [ ] All fonts are Arial
- [ ] Background is pure white `#FFFFFF`
- [ ] Bullet circles are gold `#EC8B24`
- [ ] Bullet text is underlined
- [ ] Table borders are `#EC8B24`
- [ ] Table data cells are italic
- [ ] No invented content

**Footer**
- [ ] Gradient rule above footer
- [ ] Logo bottom-left, copyright bottom-right
- [ ] Copyright reads exactly: `© 2024-2026 Golden Age Learning`
- [ ] Bottom padding is `1.2in`
- [ ] `__LOGO_BASE64__` placeholder replaced

### Continuation Pages

- [ ] Header identical to Page 1
- [ ] One gradient rule below header
- [ ] No title, no second gradient rule, no Student Name field
- [ ] Body content rules all pass
- [ ] Footer identical to Page 1
- [ ] Component file at correct `(admin)` route group path
- [ ] Entry added to `CLASSES` manifest

✅ **Quiz complete**

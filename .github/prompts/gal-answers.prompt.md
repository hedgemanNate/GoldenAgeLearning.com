---
description: "Generate a Golden Age Learning Quiz Answer Key simple page from Markdown content"
---

# GAL Answers — Quiz Answer Key

Follow all shared rules in [copilot-instructions.md](../copilot-instructions.md). This prompt produces a **Quiz Answer Key** simple page.

Simple pages contain **no Golden Age Learning branding**. No logo, no gradient rules, no gold colors, no Arial font requirement. The only design goal is **clarity and readability on a mobile phone screen**.

The instructor reads this on their phone while checking quiz answers. Fast scanning is the priority.

---

## Design Rules

| Property | Value |
|---|---|
| Background | White `#FFFFFF` |
| Max content width | `680px`, centered |
| Font family | System sans-serif — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| Base font size | `17px` |
| Line height | `1.7` |
| Padding | `20px` on all sides |
| Color scheme | Black text on white — green on correct answers only |

The page must be fully responsive. No horizontal scrolling. No tiny text.

---

## Structure & Styling

### Page Title
- "Class [N] Quiz: Answer Key" as `<h1>` — `24px`, bold, black
- Thin `1px` gray (`#DDDDDD`) rule below title

### Each Question Block
- Question number and text as bold label — `17px`, black
- Correct answer on next line, indented — `17px`, bold, green (`#2E7D32`)
- Wrong answer options (if present in Markdown) — `17px`, gray (`#999999`), regular weight
- `20px` space between question blocks

### No Decorative Elements
- No borders, no background fills, no icons, no color accents other than green
- The green on the correct answer is the **only** color on the page — it must be immediately obvious at a glance

---

## Output Path

`app/(admin)/teaching/class-[n]-[slug]/answers/page.tsx`

Add an entry to the `CLASSES` manifest in `app/(admin)/teaching/page.tsx`.

---

## CHECKLIST

- [ ] Background is pure white `#FFFFFF`
- [ ] Max content width is `680px`, centered
- [ ] Font is system sans-serif — no custom fonts, no `@font-face`
- [ ] Base font size is `17px` — nothing smaller than `13px` anywhere
- [ ] Line height is `1.7`
- [ ] `20px` padding on all sides
- [ ] No horizontal scrolling at `375px` viewport width
- [ ] No Golden Age Learning logo, gradient rules, or gold colors anywhere
- [ ] No content invented — everything from Markdown
- [ ] Title reads "Class [N] Quiz: Answer Key" as `<h1>`
- [ ] Correct answer is bold and green (`#2E7D32`) — immediately obvious
- [ ] Wrong answers (if shown) are gray `#999999`, regular weight
- [ ] `20px` spacing between question blocks
- [ ] No decorative colors other than green on correct answers
- [ ] Component file at correct `(admin)` route group path
- [ ] Entry added to `CLASSES` manifest

✅ **Answer Key complete**

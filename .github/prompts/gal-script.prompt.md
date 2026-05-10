---
description: "Generate a Golden Age Learning Teacher's Script simple page from Markdown content"
---

# GAL Script — Teacher's Script

Follow all shared rules in [copilot-instructions.md](../copilot-instructions.md). This prompt produces a **Teacher's Script** simple page.

Simple pages contain **no Golden Age Learning branding**. No logo, no gradient rules, no gold colors, no Arial font requirement. The only design goal is **clarity and readability on a mobile phone screen**.

The instructor reads this on their phone while teaching. They need to glance at it quickly between sentences.

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
| Color scheme | Black text on white — no decorative colors |

The page must be fully responsive. No horizontal scrolling. No tiny text.

---

## Structure & Styling

### Page Title
- Class name as `<h1>` — `24px`, bold, black
- "Teacher's Script" as subtitle — `16px`, regular weight, gray (`#666666`)
- Thin `1px` gray (`#DDDDDD`) rule below subtitle

### Class Goals Block
- "Class Goals:" as bold label — `17px`
- Goals as bullet list — `17px`, `line-height: 1.7`
- Teacher's Note (if present): background `#F5F5F5`, `12px` padding, `border-left: 3px solid #CCCCCC`, italic text

### Timing + Slide Label (each section header)
- Timing on its own line — `13px`, gray (`#888888`), not bold
- Slide label (e.g. `[SLIDE 1: TITLE SLIDE]`) as `<h2>` — `19px`, bold, black
- Thin `1px` `#EEEEEE` rule below each slide label

### Script Body Text
- Each paragraph at `17px`, `line-height: 1.7`
- `**bold**` in Markdown → `<strong>` — key terms the teacher should emphasize
- `(parentheses)` → gray (`#888888`) italic — stage directions, not spoken words
- Blank lines between paragraphs preserved

### Spacing Between Sections
- `32px` top margin before each new slide section

---

## Output Path

`app/(admin)/teaching/class-[n]-[slug]/script/page.tsx`

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
- [ ] Class name is `<h1>`, "Teacher's Script" subtitle below it
- [ ] Class Goals block present with bullet list
- [ ] Teacher's Note (if present) in shaded left-bordered box, italic
- [ ] Each section has timing line (gray, small) + slide label `<h2>` + divider rule
- [ ] Bold Markdown rendered as `<strong>`
- [ ] Parenthetical stage directions in gray italic
- [ ] `32px` top margin before each new slide section
- [ ] Component file at correct `(admin)` route group path
- [ ] Entry added to `CLASSES` manifest

✅ **Teacher's Script complete**

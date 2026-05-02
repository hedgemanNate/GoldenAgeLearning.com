# Master the Keyboard Slide Redesign Tracker

Purpose: This file is the handoff record for updating the GAL DOC instructions after the slide redesign is complete.

How to use this file:
- Keep one section per slide.
- Preserve the original baseline under `Started As`.
- Append concrete decisions under `Adjustments Made` as each slide changes.
- Record the instruction-level takeaway under `GAL DOC Correction Needed` so another AI can update the slide-generation instructions accurately.
- Mark a slide `Completed` only when its visual design and its instruction notes are both final.

## Global Notes

Current deck source: `masterTheKeyboardSlides` in `_slides/content.ts`.

- Standardized the remaining content-slide h2 treatment around the Slide 2/3 pattern: larger, centered, and lowered into the upper-middle area instead of using the smaller left-aligned default title.
- Standardized default checklist/list-item styling for the remaining list-based slides so bullets read larger and centered rather than left-stacked and visually narrow.

Review status:

| Slide | Status | Started As Captured | Adjustments Logged | GAL DOC Notes Logged |
| --- | --- | --- | --- | --- |
| 1 | Completed | Yes | Yes | Yes |
| 2 | Completed | Yes | Yes | Yes |
| 3 | Completed | Yes | Yes | Yes |
| 4 | In progress | Yes | No | No |
| 5 | Not started | Yes | No | No |
| 6 | Not started | Yes | No | No |
| 7 | Not started | Yes | No | No |
| 8 | Not started | Yes | No | No |
| 9 | Not started | Yes | No | No |
| 10 | Not started | Yes | No | No |
| 11 | Not started | Yes | No | No |
| 12 | Not started | Yes | No | No |
| 13 | Not started | Yes | No | No |

## Slide 1

Status: Completed

Started As:
- Layout: `title`
- Title: `Master the Keyboard`
- Subtitle: `Typing with Confidence and Fun!`
- Class label: `Smartphone Basics · Class 2`
- Intended role: opening title slide

Adjustments Made:
- Added a large centered circular logo above the h1 title on the title slide.
- Implemented using the existing embedded logo asset, positioned in the main title stack rather than only relying on the small persistent bottom-right logo.
- Current size set to `18vw` by `18vw` with `borderRadius: 50%` and `objectFit: cover`.

GAL DOC Correction Needed:
- The title slide instructions need to explicitly require a large centered logo above the main h1 title in the primary content stack.
- The existing small bottom-right persistent logo is not sufficient for the opening slide; the title slide needs both the branded focal logo above the heading and the persistent small logo if that element remains part of the shared slide shell.
- The title-slide layout guidance should specify approximate size and placement for that focal logo, not just mention a centered composition in general terms.

## Slide 2

Status: Completed

Started As:
- Layout: `checklist`
- Title: `What We'll Learn Today`
- Bullets:
  - `How to find and open the keyboard`
  - `How to type letters, words, and spaces`
  - `How to fix mistakes with the backspace key`
  - `How to type capital letters`
  - `How to find numbers and symbols`
  - `How to add fun with Emojis`
  - `How to "talk-to-type" with Voice Dictation`
- Intended role: lesson overview slide

Adjustments Made:
- Increased the Slide 2 h2 size so the heading reads larger and more prominently than the default checklist title treatment.
- Lowered the Slide 2 h2 on the slide by adding more top spacing before the heading.
- Increased the Slide 2 h2 again and centered it horizontally on the slide instead of leaving it left-aligned.
- Lowered the Slide 2 h2 further so it sits more comfortably in the upper-middle area of the slide while still keeping clear breathing room above the line items.
- Reworked the seven overview items into a two-column layout so they occupy the open space instead of sitting in a single narrow vertical stack.
- Increased the line-item text size for Slide 2 so the overview content reads larger on screen.

GAL DOC Correction Needed:
- The lesson overview slide should not rely on the default single-column checklist layout when there are many short bullets.
- The instructions need an explicit overview-slide variant that supports two columns for dense agenda content.
- The instructions should distinguish overview slide title spacing and sizing from the default content-slide h2 so the heading can sit lower and feel more intentional.
- The overview-slide title guidance should specify centered heading alignment rather than assuming the same left-aligned heading used by standard content slides.
- The overview-slide title guidance should also describe vertical placement: the heading should sit lower than the default top-aligned content title, but still leave comfortable separation before the agenda columns begin.
- The instructions should tell the generator to scale bullet text up to fill available space when the slide contains a short agenda list spread across two columns.

## Slide 3

Status: Completed

Started As:
- Layout: `icon-tip`
- Title: `It Pops Up When You Need It!`
- Emoji: `⌨️`
- Body: `The keyboard appears automatically anytime you tap on a place where you can type.`
- Tip: `Tap any search bar or text area and watch it appear from the bottom of the screen.`
- Intended role: explain how the keyboard appears

Adjustments Made:
- Increased the Slide 3 h2 to match the stronger Slide 2 title treatment instead of using the default smaller left-aligned `icon-tip` heading.
- Centered the Slide 3 h2 and lowered it on the slide so it sits in the same more intentional upper-middle zone established for Slide 2.
- Increased the keyboard visual size inside the orange circle so the keyboard graphic reads much larger at presentation scale.
- Reduced the orange circle size around the keyboard visual so the frame fits the keyboard more tightly instead of dominating the left side of the slide.
- Reduced the Slide 3 orange circle by about 20% from the prior revision to better match the keyboard image scale.

GAL DOC Correction Needed:
- The `icon-tip` slide instructions need an alternate title treatment for slides that should feel like featured concept slides rather than standard left-aligned content slides.
- That alternate treatment should allow a larger, centered, lower-positioned h2 consistent with the revised Slide 2 heading style.
- The icon-circle guidance should explicitly allow scaling the inner icon substantially larger when the symbol has a lot of built-in whitespace, so the visual does not read undersized inside the frame.
- The same guidance should also allow reducing the icon-circle container on a per-slide basis when the default frame feels oversized relative to the symbol and surrounding content.
- The instructions should allow iterative proportion tuning between icon size and circle size, because the right frame can be materially smaller than a standard large-icon container on slides like this.

## Slide 4

Status: In progress

Started As:
- Layout: `checklist`
- Title: `A Quick Tour`
- Bullets:
  - `The Letter Keys — the main QWERTY area`
  - `The Space Bar — makes spaces between words`
  - `The Backspace / Delete Key — erases mistakes`
  - `The Shift Key — for capital letters`
- Intended role: keyboard parts overview

Adjustments Made:
- Promoted the remaining shared content-slide h2 treatment to match the Slide 2 and Slide 3 heading style, so unrevised content slides now use a larger centered title positioned lower on the slide.
- Increased the default checklist line-item size for Slide 4-style list slides so the content fills the slide more confidently.
- Centered the default checklist line items so list-based slides no longer read as a narrow left-biased stack.
- Kept the checklist group centered overall but aligned each line item to a shared left start so the bullets read as a clean vertical list instead of drifting row by row.
- Reworked Slide 4's four checklist points into two columns so the quick-tour items use the slide width more efficiently.

GAL DOC Correction Needed:
- The default content-slide heading guidance should match the stronger Slide 2/3 treatment instead of assuming smaller left-aligned h2 titles for most interior slides.
- The checklist/list-slide instructions should default to larger centered line items when the slide contains a short set of teaching points.
- That checklist guidance should distinguish between centering the whole list block and centering each row: the block can be centered on the slide, but the item starts should line up on a common left edge.
- The checklist instructions should include a two-column variant for short four-item tour slides, rather than assuming all checklist content belongs in one centered column.

## Slide 5

Status: Not started

Started As:
- Layout: `icon-tip`
- Title: `The Blinking Cursor`
- Emoji: `▎`
- Body: `This blinking line is called the cursor. It shows you exactly where the next letter you type will appear.`
- Tip: `Think of it as your "You are here" map for typing.`
- Intended role: explain cursor behavior

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 6

Status: Not started

Started As:
- Layout: `steps`
- Title: `It's Easy to Fix Mistakes!`
- Steps:
  - `Type "hellp" — notice the typo`
  - `Find the Backspace key (the arrow pointing left)`
  - `Tap Backspace once — the 'p' disappears`
  - `Type 'o' — the word now correctly reads "hello"`
- Intended role: step-by-step correction demo

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 7

Status: Not started

Started As:
- Layout: `icon-content`
- Title: `Capital Letters (The Shift Key)`
- Emoji: `⇧`
- Columns:
  - Left: `For one capital letter:\nTap the Shift key once.`
  - Right: `For ALL CAPS:\nTap the Shift key twice, quickly!`
- Intended role: explain single caps versus caps lock

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 8

Status: Not started

Started As:
- Layout: `icon-tip`
- Title: `What About Numbers?`
- Emoji: `123`
- Body: `To type numbers or symbols (like ? or !), just tap the "123" key. Tap the "ABC" key to return to letters.`
- Intended role: numbers and symbols slide

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 9

Status: Not started

Started As:
- Layout: `icon-tip`
- Title: `Express Yourself with Emojis!`
- Emoji: `😊`
- Body: `Emojis are small pictures you can use to show feelings. Tap the smiley face key to find them!`
- Tip: `Try: 👍 ❤️ 😂 🎂 😉`
- Intended role: emoji introduction slide

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 10

Status: Not started

Started As:
- Layout: `icon-tip`
- Title: `Talk-to-Type (Voice Dictation)`
- Emoji: `🎤`
- Body: `Don't feel like typing? Tap the microphone icon and just say what you want to write!`
- Tip: `It's like magic!`
- Intended role: voice dictation slide

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 11

Status: Not started

Started As:
- Layout: `checklist`
- Title: `You've Mastered the Keyboard!`
- Bullets:
  - `You can type words and sentences.`
  - `You know how to fix mistakes and capitalize letters.`
  - `You can find numbers, symbols, and fun emojis.`
  - `You know how to use your voice to type.`
- Intended role: lesson recap slide

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 12

Status: Not started

Started As:
- Layout: `focus`
- Title: `Game Time!`
- Subtitle: `Let's review what we've learned.`
- Emoji: `🎮`
- Intended role: transition into game/review activity

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.

## Slide 13

Status: Not started

Started As:
- Layout: `closing`
- Title: `Thank You!`
- Intended role: closing slide

Adjustments Made:
- None yet.

GAL DOC Correction Needed:
- None yet.
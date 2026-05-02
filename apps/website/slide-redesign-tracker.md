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
| 4 | Completed | Yes | Yes | Yes |
| 5 | In progress | Yes | No | No |
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

Status: Completed

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

Status: Completed

Started As:
- Layout: `icon-tip`
- Title: `The Blinking Cursor`
- Emoji: `▎`
- Body: `This blinking line is called the cursor. It shows you exactly where the next letter you type will appear.`
- Tip: `Think of it as your "You are here" map for typing.`
- Intended role: explain cursor behavior

Adjustments Made:
- Replaced the Slide 5 cursor glyph with a drawn vertical bar centered inside the orange circle so the cursor reads visually centered instead of leaning to one side.
- Changed the Slide 5 cursor bar to white so it reads like a live text cursor instead of blending with the orange frame.
- Added a blink animation to the Slide 5 cursor bar so it behaves like a real typing cursor.
- Matched the Slide 5 circle size to the smaller Slide 3 circle treatment rather than leaving it at the larger default icon-circle size.

GAL DOC Correction Needed:
- The icon-tip instructions should allow replacing text glyphs with simple drawn shapes when a character is technically centered but still looks optically off-center at presentation scale.
- The same instructions should allow cursor-style visuals to use a white blinking bar rather than inheriting the accent color used by the surrounding icon frame.
- The icon-circle guidance should note that icon-tip slides can share a smaller custom circle size across multiple slides when a tighter frame is part of the emerging deck style.

## Slide 6

Status: Completed

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
- Reworked Slide 6's four step items into two columns so the slide uses the same wider, more balanced line-item structure established on Slide 4.
- Increased the Slide 6 step text size so the instructions read larger and fill the slide more confidently instead of sitting as a smaller single-column stack.

GAL DOC Correction Needed:
- The steps-slide instructions should allow a two-column variant for short four-step teaching demos when a single narrow column leaves too much empty space.
- That same guidance should allow step text to scale up to the stronger Slide 4 line-item size when the slide is carrying only a small number of short instructions.

## Slide 7

Status: Completed

Started As:
- Layout: `icon-content`
- Title: `Capital Letters (The Shift Key)`
- Emoji: `⇧`
- Columns:
  - Left: `For one capital letter:\nTap the Shift key once.`
  - Right: `For ALL CAPS:\nTap the Shift key twice, quickly!`
- Intended role: explain single caps versus caps lock

Adjustments Made:
- Changed the Slide 7 shift-arrow icon to white so it reads as the active symbol inside the orange-framed circle instead of blending into the accent color.
- Matched the Slide 7 icon circle size to the smaller circle treatment used on the earlier icon slides rather than leaving it at the larger default icon-content size.
- Enlarged the two Slide 7 information cards with more padding and slightly wider spacing so the layout feels fuller and more deliberate.
- Increased the Slide 7 card heading and body text sizes so both columns read more like major teaching points and less like secondary captions.

GAL DOC Correction Needed:
- The icon-content instructions should allow slide-specific icon color overrides, including white symbols inside the orange bordered circle when the symbol needs stronger contrast.
- Those same instructions should note that icon-content slides can reuse the smaller established icon-circle size from earlier slides when the deck is converging on a tighter circle treatment.
- The two-column card guidance should allow moderate card enlargement through padding, spacing, and text-size increases when the base cards feel undersized on the slide.

## Slide 8

Status: Completed

Started As:
- Layout: `icon-tip`
- Title: `What About Numbers?`
- Emoji: `123`
- Body: `To type numbers or symbols (like ? or !), just tap the "123" key. Tap the "ABC" key to return to letters.`
- Intended role: numbers and symbols slide

Adjustments Made:
- Matched the Slide 8 icon circle to the smaller circle size already established on the earlier icon slides instead of leaving it at the larger default icon-tip size.
- Changed the `123` icon color to white so it reads clearly inside the orange bordered circle.
- Increased the Slide 8 body paragraph size so the numbers-and-symbols explanation fills the slide more confidently.

GAL DOC Correction Needed:
- The icon-tip instructions should note that later icon slides can reuse the smaller established icon-circle size rather than always falling back to the larger default circle.
- Those same instructions should allow white icon text inside the orange bordered circle when a text-based icon like `123` needs stronger contrast.
- The icon-tip body-copy guidance should allow slide-specific paragraph size increases when a single explanatory paragraph feels undersized on the slide.

## Slide 9

Status: Completed

Started As:
- Layout: `icon-tip`
- Title: `Express Yourself with Emojis!`
- Emoji: `😊`
- Body: `Emojis are small pictures you can use to show feelings. Tap the smiley face key to find them!`
- Tip: `Try: 👍 ❤️ 😂 🎂 😉`
- Intended role: emoji introduction slide

Adjustments Made:
- Matched the Slide 9 icon circle to the smaller circle size already established on the other revised icon slides instead of leaving it at the larger default icon-tip size.
- Narrowed the Slide 9 tip card so it wraps its emoji content more naturally instead of stretching across the full width of the text column.

GAL DOC Correction Needed:
- The icon-tip instructions should allow later icon slides to reuse the smaller established icon-circle size rather than always using the larger default circle.
- The tip-box guidance should allow short tip content, especially emoji-only examples, to use a content-width card instead of forcing the tip container to span the full text column.

## Slide 10

Status: Completed

Started As:
- Layout: `icon-tip`
- Title: `Talk-to-Type (Voice Dictation)`
- Emoji: `🎤`
- Body: `Don't feel like typing? Tap the microphone icon and just say what you want to write!`
- Tip: `It's like magic!`
- Intended role: voice dictation slide

Adjustments Made:
- Matched the Slide 10 microphone circle to the same smaller icon-circle size already established on the other revised icon slides instead of leaving it at the larger default `icon-tip` size.
- Narrowed the Slide 10 tip card so the short `It's like magic!` tip reads as a compact callout instead of spanning the full text column width.

GAL DOC Correction Needed:
- The `icon-tip` instructions should allow short-tip slides like voice dictation to reuse the smaller established icon-circle size rather than reverting to the larger default circle.
- The tip-box guidance should allow very short tip copy to render in a content-width card instead of forcing full-column width.

## Slide 11

Status: Completed

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
- Reworked the Slide 11 recap bullets into a two-column layout so the four summary items use the available width instead of sitting in a single centered stack.
- Increased the Slide 11 line-item size to match the larger revised checklist styling used on the earlier updated content slides.

GAL DOC Correction Needed:
- The recap checklist instructions should allow a two-column variant when a short set of summary bullets can be presented more clearly across the slide width.
- The recap-slide guidance should allow larger line-item text consistent with the other revised checklist slides instead of defaulting back to the smaller single-column list treatment.

## Slide 12

Status: Completed

Started As:
- Layout: `focus`
- Title: `Game Time!`
- Subtitle: `Let's review what we've learned.`
- Emoji: `🎮`
- Intended role: transition into game/review activity

Adjustments Made:
- No redesign changes were needed after review.

GAL DOC Correction Needed:
- None.

## Slide 13

Status: Completed

Started As:
- Layout: `closing`
- Title: `Thank You!`
- Intended role: closing slide

Adjustments Made:
- No redesign changes were needed after review.

GAL DOC Correction Needed:
- None.
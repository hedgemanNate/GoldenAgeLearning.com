---
description: "Generate ALL Golden Age Learning documents from a single Markdown file — Quiz, Worksheet, Slides, Teacher's Script, and Answer Key"
---

# GAL Full Build

Follow all shared rules in [copilot-instructions.md](../copilot-instructions.md).

Read the supplied Markdown file completely before starting. Then produce **all five document types** in this order, following each prompt file's rules exactly:

## Step 1 — Quiz
Follow all rules in [gal-quiz.prompt.md](gal-quiz.prompt.md). Run its full checklist before proceeding.

## Step 2 — Worksheet
Follow all rules in [gal-worksheet.prompt.md](gal-worksheet.prompt.md). Run its full checklist before proceeding.

## Step 3 — Slide Deck
Follow all rules in [gal-slides.prompt.md](gal-slides.prompt.md). Run its full checklist before proceeding.

## Step 4 — Teacher's Script
Follow all rules in [gal-script.prompt.md](gal-script.prompt.md). Run its full checklist before proceeding.

## Step 5 — Quiz Answer Key
Follow all rules in [gal-answers.prompt.md](gal-answers.prompt.md). Run its full checklist before proceeding.

## After All Steps

- Confirm all 5 component files exist at their correct `(admin)` route group paths
- Confirm all 5 entries have been added to the `CLASSES` manifest in `teaching/page.tsx`
- Report which files were created and their paths

Do not skip any document type. If the Markdown does not contain enough content for one of the types (e.g. no answer key data), stop and ask the user before skipping it.

// Master the Keyboard slide deck content.
// Source: Class2_PowerPoint_Script.md
// Used by both the launch page (totalSlides) and the display page (render).
// Pure data — no React, no styling decisions here.

export interface SlideContent {
  id: number;
  layout:
    | "title"
    | "checklist"
    | "icon-content"
    | "icon-tip"
    | "steps"
    | "focus"
    | "closing";
  // title slide
  title?: string;
  subtitle?: string;
  classLabel?: string;
  // icon-content / icon-tip / focus
  emoji?: string;
  body?: string;
  tip?: string;
  // steps
  steps?: string[];
  // checklist
  bullets?: string[];
  // two-column variant (capital letters slide)
  columns?: { left: string; right: string };
}

export const masterTheKeyboardSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Master the Keyboard",
    subtitle: "Typing with Confidence and Fun!",
    classLabel: "Smartphone Basics · Class 2",
  },

  // Slide 2 — What We'll Learn Today
  {
    id: 2,
    layout: "checklist",
    title: "What We'll Learn Today",
    bullets: [
      "How to find and open the keyboard",
      "How to type letters, words, and spaces",
      "How to fix mistakes with the backspace key",
      "How to type capital letters",
      "How to find numbers and symbols",
      "How to add fun with Emojis",
      'How to "talk-to-type" with Voice Dictation',
    ],
  },

  // Slide 3 — Where is the Keyboard?
  {
    id: 3,
    layout: "icon-tip",
    title: "It Pops Up When You Need It!",
    emoji: "⌨️",
    body: "The keyboard appears automatically anytime you tap on a place where you can type.",
    tip: "Tap any search bar or text area and watch it appear from the bottom of the screen.",
  },

  // Slide 4 — A Quick Tour
  {
    id: 4,
    layout: "checklist",
    title: "A Quick Tour",
    bullets: [
      "The Letter Keys — the main QWERTY area",
      "The Space Bar — makes spaces between words",
      "The Backspace / Delete Key — erases mistakes",
      "The Shift Key — for capital letters",
    ],
  },

  // Slide 5 — The Blinking Cursor
  {
    id: 5,
    layout: "icon-tip",
    title: "The Blinking Cursor",
    emoji: "▎",
    body: "This blinking line is called the cursor. It shows you exactly where the next letter you type will appear.",
    tip: 'Think of it as your "You are here" map for typing.',
  },

  // Slide 6 — Fixing Mistakes
  {
    id: 6,
    layout: "steps",
    title: "It's Easy to Fix Mistakes!",
    steps: [
      'Type "hellp" — notice the typo',
      "Find the Backspace key (the arrow pointing left)",
      "Tap Backspace once — the 'p' disappears",
      "Type 'o' — the word now correctly reads \"hello\"",
    ],
  },

  // Slide 7 — Capital Letters
  {
    id: 7,
    layout: "icon-content",
    title: "Capital Letters (The Shift Key)",
    emoji: "⇧",
    columns: {
      left: "For one capital letter:\nTap the Shift key once.",
      right: "For ALL CAPS:\nTap the Shift key twice, quickly!",
    },
  },

  // Slide 8 — Numbers & Symbols
  {
    id: 8,
    layout: "icon-tip",
    title: "What About Numbers?",
    emoji: "123",
    body: 'To type numbers or symbols (like ? or !), just tap the "123" key. Tap the "ABC" key to return to letters.',
  },

  // Slide 9 — Emojis
  {
    id: 9,
    layout: "icon-tip",
    title: "Express Yourself with Emojis!",
    emoji: "😊",
    body: "Emojis are small pictures you can use to show feelings. Tap the smiley face key to find them!",
    tip: "Try: 👍 ❤️ 😂 🎂 😉",
  },

  // Slide 10 — Voice Dictation
  {
    id: 10,
    layout: "icon-tip",
    title: "Talk-to-Type (Voice Dictation)",
    emoji: "🎤",
    body: "Don't feel like typing? Tap the microphone icon and just say what you want to write!",
    tip: "It's like magic!",
  },

  // Slide 11 — You Did It!
  {
    id: 11,
    layout: "checklist",
    title: "You've Mastered the Keyboard!",
    bullets: [
      "You can type words and sentences.",
      "You know how to fix mistakes and capitalize letters.",
      "You can find numbers, symbols, and fun emojis.",
      "You know how to use your voice to type.",
    ],
  },

  // Slide 12 — Game Time!
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let's review what we've learned.",
    emoji: "🎮",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
  },
];

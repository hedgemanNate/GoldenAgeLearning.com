// The World of Apps slide deck content.
// Source: Class3_PowerPoint_Script.md
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
  // two-column variant
  columns?: { left: string; right: string };
}

export const theWorldOfAppsSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "The World of Apps",
    subtitle: "Your Phone's Digital Toolkit",
    classLabel: "Smartphone Basics · Class 3",
  },

  // Slide 2 — Our Adventure Today
  {
    id: 2,
    layout: "checklist",
    title: "Our Adventure Today",
    bullets: [
      "Learn what an \"app\" is",
      "Discover the App Store",
      "How to get (install) a new app",
      "How to open your apps",
      "How to organize your apps",
      "How to tidy up (delete) apps",
    ],
  },

  // Slide 3 — What is an App?
  {
    id: 3,
    layout: "icon-tip",
    title: "What is an \"App\"?",
    emoji: "🧰",
    body: "An app is a tool that does one specific job. \"App\" is short for \"Application.\" Your phone is the toolbox — apps are the tools inside it!",
    tip: "Camera app: takes photos. Weather app: shows the forecast. Every app has one job!",
  },

  // Slide 4 — The Digital App Store
  {
    id: 4,
    layout: "icon-content",
    title: "Where Do We Get Apps?",
    emoji: "🏪",
    columns: {
      left: "For iPhone & iPad:\nApp Store\nBlue icon — white letter 'A'",
      right: "For Android Phones:\nGoogle Play Store\nColorful triangle icon",
    },
  },

  // Slide 5 — Finding the App Store
  {
    id: 5,
    layout: "icon-tip",
    title: "Let's Find Your Store",
    emoji: "📱",
    body: "Look on your home screen for one of these icons. When you find it, give it a tap to open it.",
    tip: "Not sure which one you have? iPhone/iPad = App Store. Samsung/Android = Play Store.",
  },

  // Slide 6 — Searching for an App
  {
    id: 6,
    layout: "icon-tip",
    title: "Finding the App You Want",
    emoji: "🔍",
    body: "Every app store has a Search button. It almost always looks like a magnifying glass. Tap it and start typing what you're looking for.",
    tip: "Ignore the ads and pictures — go straight to Search!",
  },

  // Slide 7 — How to Get a New App
  {
    id: 7,
    layout: "steps",
    title: "Getting a New App",
    steps: [
      "Open your App Store and tap Search",
      "Type the name of the app you want",
      "Tap GET or Install next to the app",
      "Approve with your fingerprint or password",
    ],
  },

  // Slide 8 — Where Did My New App Go?
  {
    id: 8,
    layout: "icon-tip",
    title: "Where Did My New App Go?",
    emoji: "📲",
    body: "After the app downloads, its new icon will appear on an empty spot on your Home Screen. It has found its home in your toolbox!",
    tip: "Look for a spinning circle — that means it's still downloading.",
  },

  // Slide 9 — Organizing Your Screen
  {
    id: 9,
    layout: "steps",
    title: "Arranging Your Tools",
    steps: [
      "Find any app on your home screen",
      "Press and hold your finger on it",
      "Watch all the apps start to wiggle!",
      "Drag the app to a new spot on your screen",
    ],
  },

  // Slide 10 — Tidying Up
  {
    id: 10,
    layout: "steps",
    title: "Tidying Up Your Toolbox",
    steps: [
      "Press and hold an app until they wiggle",
      "Tap the little 'X' or '—' on the app you want to remove",
      "Tap 'Delete' to confirm — the app is gone!",
    ],
  },

  // Slide 11 — You Did It!
  {
    id: 11,
    layout: "checklist",
    title: "You're an App Manager!",
    bullets: [
      "You know what apps are and where to get them.",
      "You can install a new app from the store.",
      "You can organize the apps on your screen.",
      "You know how to delete apps you don't use.",
    ],
  },

  // Slide 12 — Game Time!
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let's see what you've learned about the World of Apps!",
    emoji: "🎮",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Your Camera & Photos",
  },
];

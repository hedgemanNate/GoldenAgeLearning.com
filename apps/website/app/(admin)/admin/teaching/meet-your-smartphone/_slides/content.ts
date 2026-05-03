// Meet Your Smartphone/Tablet! slide deck content.
// Source: Class1_PowerPoint_Script.md
// Used by both the launch page (totalSlides) and the display page (render).
// Pure data — no React, no styling decisions here.

export interface SlideContent {
  id: number;
  layout:
    | "title"
    | "overview"
    | "device-parts"
    | "icon-tip"
    | "focus"
    | "checklist"
    | "closing";
  // title / closing
  title?: string;
  subtitle?: string;
  classLabel?: string;
  // icon-tip / focus
  emoji?: string;
  body?: string;
  tip?: string;
  // overview / checklist / device-parts
  bullets?: string[];
}

export const meetYourSmartphoneSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Meet Your Smartphone/Tablet!",
    subtitle: "Your First Step into the Digital World",
    classLabel: "Smartphone Basics · Class 1",
  },

  // Slide 2 — Today's Goals
  {
    id: 2,
    layout: "overview",
    title: "What We'll Learn Today",
    bullets: [
      "Identify the key buttons and ports on your device",
      "Turn your device on and off, and wake it from sleep",
      "Use basic touch gestures: Tap, Swipe, and Pinch-to-Zoom",
    ],
  },

  // Slide 3 — Getting to Know Your Device
  {
    id: 3,
    layout: "device-parts",
    title: "Getting to Know Your Device",
  },

  // Slide 4 — Waking Up Your Device
  {
    id: 4,
    layout: "icon-tip",
    title: "Waking Up Your Device",
    emoji: "📱",
    body: "Just a quick press of the Power Button wakes up your screen. If the device is completely off, press and hold for a few seconds to start it up.",
    tip: "Press once to wake it up. Press once more to put it back to sleep.",
  },

  // Slide 5 — The Tap
  {
    id: 5,
    layout: "icon-tip",
    title: 'The Tap: Your Digital "Button Press"',
    emoji: "☝️",
    body: "Tapping is how you select something or open an app. Just a light, quick touch — no need to press hard at all.",
    tip: "Think of tapping as clicking a mouse, but your finger is the mouse!",
  },

  // Slide 6 — The Swipe
  {
    id: 6,
    layout: "icon-tip",
    title: "The Swipe: Turning the Page",
    emoji: "👉",
    body: "Swiping lets you move between screens or scroll through lists. Place your finger on the screen and slide it across without lifting.",
    tip: "It's like turning the page in a book — just use your finger!",
  },

  // Slide 7 — Pinch-to-Zoom
  {
    id: 7,
    layout: "icon-tip",
    title: "The Zoom: Getting a Closer Look",
    emoji: "🤏",
    body: "Use two fingers — your thumb and index finger. Place them together on a photo, then spread them apart to zoom in. Pinch them back together to zoom out.",
    tip: "Perfect for reading small text or getting a closer look at a map!",
  },

  // Slide 8 — Time to Practice!
  {
    id: 8,
    layout: "focus",
    title: "Time to Practice!",
    subtitle: "Let's try these on your own device. We'll go slow and help everyone.",
    emoji: "🙌",
  },

  // Slide 9 — You've Mastered the Basics!
  {
    id: 9,
    layout: "checklist",
    title: "You've Mastered the Basics!",
    bullets: [
      "Identify the key parts of your device",
      "Wake up and sleep your screen",
      "Use the Tap, Swipe, and Zoom gestures!",
    ],
  },

  // Slide 10 — Game Time!
  {
    id: 10,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let's see what we remember!",
    emoji: "🎯",
  },

  // Slide 11 — Closing
  {
    id: 11,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: The Digital Keyboard",
  },
];

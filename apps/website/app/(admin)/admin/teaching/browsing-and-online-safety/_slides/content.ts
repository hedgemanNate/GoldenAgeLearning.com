// Browsing & Online Safety slide deck content.
// Source: Class4_PowerPoint_Script.md
// Used by both the launch page (totalSlides) and the display page (render).
// Pure data — no React, no styling decisions here.

export interface SlideContent {
  id: number;
  layout:
    | "title"
    | "agenda"
    | "three-cards"
    | "icon-tip"
    | "checklist"
    | "focus"
    | "closing";
  // title / closing
  title?: string;
  subtitle?: string;
  classLabel?: string;
  // icon-tip
  emoji?: string;
  body?: string;
  tip?: string;
  // agenda / checklist
  bullets?: string[];
  // three-cards
  cards?: Array<{ emoji: string; label: string; description: string }>;
}

export const browsingAndOnlineSafetySlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Browsing the Web & Staying Safe",
    subtitle: "Your Guide to the Internet Highway",
    classLabel: "Smartphone Basics · Class 4",
  },

  // Slide 2 — Our Journey Today
  {
    id: 2,
    layout: "agenda",
    title: "Our Journey Today",
    bullets: [
      "What is a Web Browser?",
      "How to visit a website using an address",
      "How to use \"links\" to get around",
      "The Golden Rule of Online Safety",
      "How to spot a safe website (The Lock!)",
      "Common tricks and scams to avoid",
    ],
  },

  // Slide 3 — Your Car for the Internet
  {
    id: 3,
    layout: "three-cards",
    title: "What is a Web Browser?",
    cards: [
      {
        emoji: "🧭",
        label: "Safari",
        description: "Apple's built-in browser. Found on every iPhone & iPad.",
      },
      {
        emoji: "🌐",
        label: "Google Chrome",
        description: "Popular on Android and also available for iPhone.",
      },
      {
        emoji: "🔷",
        label: "Microsoft Edge",
        description: "Microsoft's modern browser, pre-installed on Windows devices.",
      },
    ],
  },

  // Slide 4 — The Address Bar
  {
    id: 4,
    layout: "icon-tip",
    title: "Where Are We Going?",
    emoji: "🏠",
    body: "Every website has an address, just like a house. You type this address into the long bar at the very top of your browser — called the Address Bar.\n\nPress 'Go' and your browser takes you right there. Try: www.google.com",
    tip: "The address bar is always at the top of the screen. It shows where you are on the internet.",
  },

  // Slide 5 — Links
  {
    id: 5,
    layout: "icon-tip",
    title: "What is a \"Link\"?",
    emoji: "🔗",
    body: "A link is a shortcut to another page. Text that is a different color — usually blue — and underlined is almost always a link.\n\nTapping a link is the main way we travel around the internet.",
    tip: "Blue + underlined text = a link. Tap it to go somewhere new!",
  },

  // Slide 6 — The Golden Rule
  {
    id: 6,
    layout: "icon-tip",
    title: "The #1 Rule of Online Safety",
    emoji: "🥇",
    body: "The single most important rule to remember:\n\nIf it seems too good to be true, it probably is!\n\nFree iPad? Free cruise? Million dollars? It is ALWAYS a trick.",
    tip: "There is no such thing as a free iPad on the internet. Always.",
  },

  // Slide 7 — Look for the Lock
  {
    id: 7,
    layout: "icon-tip",
    title: "How to Spot a Safe Website",
    emoji: "🔒",
    body: "Before you ever type a password or credit card number, look for a small padlock icon in the address bar.\n\nThis is your sign that the website is secure — the conversation is private and scrambled.\n\nNo lock? No private information.",
    tip: "Look for 🔒 and \"https://\" (the \"s\" stands for Secure).",
  },

  // Slide 8 — Pop-Ups
  {
    id: 8,
    layout: "icon-tip",
    title: "Beware of Pop-Ups",
    emoji: "⚠️",
    body: "Pop-ups are small windows that suddenly appear in front of a webpage. They are designed to startle you and make you react without thinking.\n\nThe only thing to do with a pop-up: find the small 'X' in its corner and close it.\n\nNever click the big, flashy buttons inside a pop-up.",
    tip: "Ignore the message. Find the 'X'. Close it.",
  },

  // Slide 9 — Phishing / Scam Emails
  {
    id: 9,
    layout: "icon-tip",
    title: "Don't Take the Bait!",
    emoji: "🎣",
    body: "Scammers send fake emails that look like they're from your bank or the government.\n\nThey create URGENCY: \"Your account is locked! Click here IMMEDIATELY!\"\n\nThis is called phishing. They want you to panic and click without thinking.\n\nRule: STOP. Don't click. Call your bank directly using the number on the back of your card.",
    tip: "Scary + urgent email = almost always a scam. When in doubt, call — don't click.",
  },

  // Slide 10 — You Did It! / Checklist
  {
    id: 10,
    layout: "checklist",
    title: "You're a Safe Browser!",
    bullets: [
      "You know what a browser is and how to use links and addresses.",
      "You can spot and use links to navigate.",
      "You know the Golden Rule of Safety.",
      "You know to \"Look for the Lock!\" before entering private info.",
    ],
  },

  // Slide 11 — Game Time
  {
    id: 11,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let's review how to be a smart and safe internet traveler.",
    emoji: "🎯",
  },

  // Slide 12 — Closing
  {
    id: 12,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Your Camera & Photos",
  },
];

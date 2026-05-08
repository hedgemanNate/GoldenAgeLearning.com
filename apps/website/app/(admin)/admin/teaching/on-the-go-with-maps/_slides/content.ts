// On the Go with Maps — slide deck content.
// Source: Class 12 On the Go with Maps: Navigation and Local Discovery
// Used by both the launch page (totalSlides) and the display page (render).
// Pure data — no React, no styling decisions here.

// Alias used by the display page renderer
export type SlideContent = Slide;

export interface Slide {
  id: number;
  layout:
    | "title"
    | "agenda"
    | "three-cards"
    | "two-cards"
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
  // three-cards / two-cards
  cards?: Array<{ emoji: string; label: string; description: string }>;
}

export const onTheGoWithMapsSlides: Slide[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "On the Go with Maps",
    subtitle: "Your Guide to Navigation and Discovery",
    classLabel: "Class 12 \u00b7 Golden Age Learning",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Mission Today",
    bullets: [
      'Learn what a "Map App" is',
      'How to find your location (The "Blue Dot")',
      "How to search for a destination",
      "How to get step-by-step directions",
      "How to find nearby restaurants, gas, and more",
      "A fun way to see the world from your chair",
    ],
  },

  // Slide 3 — Paper map vs digital
  {
    id: 3,
    layout: "two-cards",
    title: "Goodbye, Foldable Maps!",
    cards: [
      {
        emoji: "\uD83D\uDDFA\uFE0F",
        label: "Paper Map",
        description:
          "Always out of date. Easy to tear. Nearly impossible to refold. No traffic updates.",
      },
      {
        emoji: "\uD83D\uDCF1",
        label: "Your Phone Map",
        description:
          "Always up-to-date. Knows exactly where you are. Shows traffic. Fits in your pocket!",
      },
    ],
  },

  // Slide 4 — Meet Your Map App
  {
    id: 4,
    layout: "two-cards",
    title: "Meet Your Map App",
    cards: [
      {
        emoji: "\uD83D\uDCCD",
        label: "For iPhone",
        description:
          'Look for the folded map icon with a pin \u2014 labeled "Maps" on your home screen.',
      },
      {
        emoji: "\uD83C\uDF10",
        label: "For Android",
        description:
          'Look for the colorful "G" on a pin \u2014 labeled "Maps" on your home screen.',
      },
    ],
  },

  // Slide 5 — The Blue Dot
  {
    id: 5,
    layout: "icon-tip",
    title: 'Where am I? The Blue Dot',
    emoji: "\uD83D\uDD35",
    body: "When you open the map, look for the Blue Dot. This is YOU! As you move, the dot moves with you. You are always at the center of your own map world.",
    tip: "If the Blue Dot is missing, tap the small arrow icon in the corner to let the app find your location.",
  },

  // Slide 6 — Searching for a Place
  {
    id: 6,
    layout: "icon-tip",
    title: "Where are we going?",
    emoji: "\uD83D\uDD0E",
    body: "Just like Google, map apps have a Search Bar. You can type an address, a name (like \u201cPublix\u201d), or even a category (like \u201cCoffee\u201d).",
    tip: "Tap inside the Search Bar at the top of the screen to start typing your destination.",
  },

  // Slide 7 — Getting Directions
  {
    id: 7,
    layout: "icon-tip",
    title: "Show Me the Way",
    emoji: "\uD83E\uDDED",
    body: "Once you find your place, tap the big blue \u201cDirections\u201d button. The app will calculate the best route and show you how many minutes it will take to arrive.",
    tip: "The route appears as a colored line on the map \u2014 that\u2019s your path from here to there!",
  },

  // Slide 8 — Start Navigating
  {
    id: 8,
    layout: "icon-tip",
    title: "Let\u2019s Go! Start",
    emoji: "\uD83D\uDE97",
    body: "To begin step-by-step guidance, tap the \u201cStart\u201d button. The phone will now talk to you and tell you exactly where to turn \u2014 you don\u2019t even have to look at the screen!",
    tip: "Keep your eyes on the road and just listen. The phone says things like \u201cIn 500 feet, turn right on Main Street.\u201d",
  },

  // Slide 9 — Nearby Places
  {
    id: 9,
    layout: "three-cards",
    title: "What\u2019s Around Me?",
    cards: [
      {
        emoji: "\u26FD",
        label: "Gas",
        description: "Tap Gas to see every nearby gas station with prices.",
      },
      {
        emoji: "\uD83C\uDF7D\uFE0F",
        label: "Restaurants",
        description: "Tap Restaurants to find every place to eat near you right now.",
      },
      {
        emoji: "\uD83D\uDED2",
        label: "Groceries",
        description: "Tap Groceries to find supermarkets and stores close by.",
      },
    ],
  },

  // Slide 10 — Street View
  {
    id: 10,
    layout: "icon-tip",
    title: "See it Before You Go!",
    emoji: "\uD83D\uDC64",
    body: "Street View lets you see a real 360-degree photo of any street corner before you leave home. Look for the little yellow person icon on the map and tap it.",
    tip: "Use Street View to preview a new doctor\u2019s office, a restaurant entrance, or even your own front door!",
  },

  // Slide 11 — Checklist
  {
    id: 11,
    layout: "checklist",
    title: "You\u2019re a Navigation Master!",
    bullets: [
      "You can find yourself on the map (The Blue Dot).",
      "You know how to search for any destination.",
      "You can get turn-by-turn directions.",
      "You can find important places nearby with one tap.",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s test our navigation skills!",
    emoji: "\uD83C\uDFB0",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Staying Connected \u2014 Video Calls",
  },
];

// Find Anything, Anytime — slide deck content.
// Source: Class 11 Find Anything, Anytime: The Art of Searching
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

export const findAnythingAnytimeSlides: Slide[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Find Anything, Anytime",
    subtitle: "The Art of Searching the Internet",
    classLabel: "Class 11 \u00b7 Golden Age Learning",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Mission Today",
    bullets: [
      'What is a "Search Engine"?',
      "How to open and use Google",
      "Tips for typing your search",
      'How to "talk" to Google (Voice Search)',
      "Sifting through your results",
      "How to know which result to trust",
    ],
  },

  // Slide 3 — What is a Search Engine?
  {
    id: 3,
    layout: "icon-tip",
    title: "What is a Search Engine?",
    emoji: "\uD83D\uDD0D",
    body: "Think of a search engine like a giant digital librarian. You ask a question, and it scours the entire internet to find the best answers for you \u2014 in seconds!",
    tip: "The most popular search engine in the world is Google. It is free to use and available on every device.",
  },

  // Slide 4 — Getting to Google
  {
    id: 4,
    layout: "icon-tip",
    title: "Let\u2019s Go to Google",
    emoji: "\uD83C\uDF10",
    body: "To start searching, open your Web Browser \u2014 Safari or Chrome. Tap the address bar at the very top and type:\n\ngoogle.com\n\nThen press \u201cGo.\u201d",
    tip: "The address bar is the long box at the very top of your browser \u2014 it shows the website address, not the search bar.",
  },

  // Slide 5 — The Search Bar
  {
    id: 5,
    layout: "icon-tip",
    title: "Where to Type",
    emoji: "\u2328\uFE0F",
    body: "Look for the long, empty box in the middle of the Google page. This is the Search Bar. Tap inside it to start typing your question!",
    tip: "You can also tap the Search Bar directly from the Google app if you have it installed on your phone.",
  },

  // Slide 6 — Tips for a Better Search
  {
    id: 6,
    layout: "two-cards",
    title: "Speak the Language of Search",
    cards: [
      {
        emoji: "\u274C",
        label: "Too Long",
        description:
          "\u201cI am looking for the instructions on how to plant a tomato in Florida.\u201d",
      },
      {
        emoji: "\u2705",
        label: "Just Right",
        description:
          "\u201cPlanting tomatoes Florida\u201d\n\nKeywords only \u2014 Google does the rest!",
      },
    ],
  },

  // Slide 7 — Voice Search
  {
    id: 7,
    layout: "icon-tip",
    title: "Use Your Voice!",
    emoji: "\uD83C\uDFA4",
    body: "Don\u2019t feel like typing? Tap the Microphone icon in the search bar and just say your question out loud! Google will type it for you and find the answer.",
    tip: "Say clearly: \u201cRestaurants near me\u201d or \u201cWeather today\u201d \u2014 Google understands natural speech.",
  },

  // Slide 8 — Understanding Results
  {
    id: 8,
    layout: "two-cards",
    title: "What Google Shows You",
    cards: [
      {
        emoji: "\uD83D\uDD35",
        label: "The Blue Title",
        description:
          "This is the name of the website. Tap it to visit the page and read the full information.",
      },
      {
        emoji: "\uD83D\uDCC4",
        label: "The Snippet",
        description:
          "A short description underneath the title. It tells you what is on that page before you tap.",
      },
    ],
  },

  // Slide 9 — Spotting Ads
  {
    id: 9,
    layout: "icon-tip",
    title: "Is it an Ad?",
    emoji: "\uD83D\uDCE2",
    body: "Sometimes the first few results are Sponsored (Ads). Companies pay to be at the top. Look for the small word \u201cSponsored\u201d or \u201cAd\u201d above the title.",
    tip: "Ads are not necessarily bad \u2014 but they are paid placements. Scroll past them to find the most relevant results.",
  },

  // Slide 10 — Trusting Results
  {
    id: 10,
    layout: "three-cards",
    title: "Who Can You Trust?",
    cards: [
      {
        emoji: "\uD83C\uDFE5",
        label: "Medical Sites",
        description:
          "Look for Mayo Clinic, WebMD, or government health sites (.gov)",
      },
      {
        emoji: "\uD83D\uDCF0",
        label: "News & Reference",
        description:
          "Major newspapers, BBC, Wikipedia \u2014 well-known, established sources",
      },
      {
        emoji: "\u2705",
        label: "Check Two Sources",
        description:
          "If two trusted sites agree, you can feel confident in the answer",
      },
    ],
  },

  // Slide 11 — Checklist
  {
    id: 11,
    layout: "checklist",
    title: "You Can Find Anything!",
    bullets: [
      "You know how to get to Google.",
      "You can type or speak your search questions.",
      "You know how to read your search results.",
      "You can spot ads and find trusted information.",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s put our searching skills to the test!",
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

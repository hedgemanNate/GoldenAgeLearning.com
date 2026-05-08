// News & Weather — slide deck content.
// Source: Class 13 News & Weather: Staying Informed with Your Device
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

export const newsAndWeatherSlides: Slide[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "News & Weather",
    subtitle: "Your Morning Paper, Reimagined",
    classLabel: "Class 13 \u00b7 Golden Age Learning",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Mission Today",
    bullets: [
      "How to find your local weather forecast",
      "How to save different locations for weather",
      "How to find trusted news sources",
      "How to search for specific news topics",
      'Understanding "Push Notifications" (Alerts)',
    ],
  },

  // Slide 3 — The Weather App (two-cards: iPhone vs Android)
  {
    id: 3,
    layout: "two-cards",
    title: "The Weather App",
    cards: [
      {
        emoji: "🌤️",
        label: "For iPhone",
        description:
          "The Apple Weather app shows your current temperature, hourly forecast, and 10-day outlook.",
      },
      {
        emoji: "☀️",
        label: "For Android",
        description:
          "The Google Weather app gives you the same great forecast — built right into your phone.",
      },
    ],
  },

  // Slide 4 — Reading the Weather (icon-tip)
  {
    id: 4,
    layout: "icon-tip",
    title: "Reading the Weather",
    emoji: "🌡️",
    body: "The big number is your Current Temperature. Scroll down for the Hourly Forecast — great for planning your day. Scroll further for the 10-Day Forecast — perfect for planning your entire week!",
    tip: "Look for the 10-day forecast to decide if Saturday is a good day for a walk or a trip to the store.",
  },

  // Slide 5 — Weather for Family Far Away (icon-tip)
  {
    id: 5,
    layout: "icon-tip",
    title: "Weather for Family Far Away",
    emoji: "📍",
    body: 'You can save other cities to check the weather for your children or grandkids! Look for the list icon (three lines) or the plus sign (+) in the corner of your app. Tap it, type a city name, and add it.',
    tip: "Add a city where a loved one lives — you can say \"I see it's snowing where you are!\" next time you call.",
  },

  // Slide 6 — Getting Your News (two-cards: browser vs news app)
  {
    id: 6,
    layout: "two-cards",
    title: "Getting Your News",
    cards: [
      {
        emoji: "🌐",
        label: "Your Web Browser",
        description:
          "Use Safari or Chrome to visit trusted news websites like BBC, ABC News, or your local paper.",
      },
      {
        emoji: "📰",
        label: "Built-In News App",
        description:
          "Your phone has a built-in News app that collects stories from many sources in one convenient place.",
      },
    ],
  },

  // Slide 7 — Search for Your Interests (icon-tip)
  {
    id: 7,
    layout: "icon-tip",
    title: "Search for Your Interests",
    emoji: "🔎",
    body: "Want to read about a specific hobby or event? Use the Search Bar inside a news app or on Google! Type \"gardening tips\" or \"Florida wildlife\" and find articles made just for you.",
    tip: "You are in control of what you read. Search for what YOU care about!",
  },

  // Slide 8 — Push Notifications (icon-tip)
  {
    id: 8,
    layout: "icon-tip",
    title: "What is that Sound? (Alerts)",
    emoji: "🔔",
    body: 'When your phone "dings" and shows a message on your screen, that\'s a Push Notification. It\'s a way for an app to deliver urgent news — like a tornado warning or a breaking news story — instantly.',
    tip: "Alerts can be very helpful for weather emergencies and important local news.",
  },

  // Slide 9 — Taming the Alerts (icon-tip)
  {
    id: 9,
    layout: "icon-tip",
    title: "You\u2019re in Control of Alerts",
    emoji: "⚙️",
    body: "If your phone is dinging too much, you can turn alerts off in your Settings. Open Settings, look for \"Notifications,\" and turn off the apps that bother you. Don\u2019t let your phone overwhelm you!",
    tip: "You are the boss of your phone. Only keep the alerts that are truly useful to you.",
  },

  // Slide 10 — Checklist / Summary
  {
    id: 10,
    layout: "checklist",
    title: "You\u2019re a News & Weather Pro!",
    bullets: [
      "You can check the local temperature and forecast.",
      "You know how to check the weather for family far away.",
      "You know where to find trusted news sources.",
      "You understand and can control your alerts.",
    ],
  },

  // Slide 11 — Game Time
  {
    id: 11,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s test our news and weather knowledge!",
  },

  // Slide 12 — Closing
  {
    id: 12,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Staying Connected \u2014 Video Calls",
  },
];

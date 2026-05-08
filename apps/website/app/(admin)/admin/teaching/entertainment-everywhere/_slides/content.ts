// Entertainment Everywhere — slide deck content.
// Source: Class 15 Entertainment Everywhere: YouTube, Music, and Podcasts
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

export const entertainmentEverywhereSlides: Slide[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Entertainment Everywhere",
    subtitle: "YouTube, Music, and Podcasts",
    classLabel: "Entertainment \u00b7 Class 15",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Mission Today",
    bullets: [
      "Learn what \u201cStreaming\u201d means",
      "How to find and watch videos on YouTube",
      "How to listen to your favorite music",
      "What a \u201cPodcast\u201d is and how to find one",
      "How to use your phone as a radio",
    ],
  },

  // Slide 3 — What is Streaming (icon-tip)
  {
    id: 3,
    layout: "icon-tip",
    title: "Magic in the Air: Streaming",
    emoji: "\u26a1",
    body: "Streaming means you can watch or listen to something instantly without downloading it first. It\u2019s like a radio or TV station that is always on!\n\nThink of it like a faucet. A download is like filling a glass of water and then drinking it. Streaming is like putting your mouth under the faucet and drinking while the water is running \u2014 instant and always available!",
    tip: "No waiting, no storage needed. If you can see it or hear it right now, that\u2019s streaming.",
  },

  // Slide 4 — Meet YouTube (icon-tip)
  {
    id: 4,
    layout: "icon-tip",
    title: "Meet YouTube",
    emoji: "\u25b6\ufe0f",
    body: "YouTube is a free website and app where you can find videos on almost anything \u2014 from cooking lessons to old TV shows to cute animals!\n\nAnyone in the world can share a video on YouTube. Want to see clips from \u201cThe Carol Burnett Show\u201d? It\u2019s on YouTube. Want to learn how to fix a leaky faucet? It\u2019s on YouTube too!",
    tip: "YouTube is completely free. You never have to pay to watch a video.",
  },

  // Slide 5 — Searching on YouTube (icon-tip)
  {
    id: 5,
    layout: "icon-tip",
    title: "Finding Your Favorite Videos",
    emoji: "\ud83d\udd0d",
    body: "Just like Google, YouTube has a Search Bar. Type in a topic, a song, or a person\u2019s name to see all the videos available.\n\nLook for the magnifying glass icon at the top of the YouTube app. Tap it and type what you\u2019re looking for. Try searching for a favorite old song or a landmark you\u2019d love to see!",
    tip: "YouTube remembers what you watch and will suggest more videos you might enjoy.",
  },

  // Slide 6 — Music Apps (two-cards)
  {
    id: 6,
    layout: "two-cards",
    title: "Music at Your Fingertips",
    cards: [
      {
        emoji: "\ud83c\udfb5",
        label: "Pandora",
        description:
          "Tell Pandora one singer you love and it creates a whole station of music just like them. It\u2019s like your own personal radio!",
      },
      {
        emoji: "\ud83c\udf1f",
        label: "Spotify",
        description:
          "Search for any song, artist, or playlist. Listen to virtually any song ever recorded, right on your phone.",
      },
    ],
  },

  // Slide 7 — Your Phone as a Radio (icon-tip)
  {
    id: 7,
    layout: "icon-tip",
    title: "Listening to the Radio",
    emoji: "\ud83d\udcfb",
    body: "You can listen to your local radio stations, or stations from across the world, using your phone!\n\nApps like iHeartRadio or TuneIn let you tune into your favorite AM and FM stations just like a regular radio \u2014 plus stations from London, Paris, Nashville, and beyond.",
    tip: "Your favorite local station is probably already on iHeartRadio. Search its call letters to find it instantly.",
  },

  // Slide 8 — What is a Podcast (icon-tip)
  {
    id: 8,
    layout: "icon-tip",
    title: "Meet the Podcast",
    emoji: "\ud83c\udfa4",
    body: "A podcast is like a radio talk show that you can listen to whenever you want. There are podcasts about news, history, hobbies, and even comedy!\n\nThe best part: it\u2019s NOT live. You listen on YOUR schedule. Missed an episode? No problem \u2014 it\u2019s waiting for you whenever you\u2019re ready.",
    tip: "Radio on your own schedule \u2014 that\u2019s the magic of podcasts.",
  },

  // Slide 9 — Finding Podcasts (two-cards)
  {
    id: 9,
    layout: "two-cards",
    title: "How to Find Podcasts",
    cards: [
      {
        emoji: "\ud83d\udfe3",
        label: "Apple Podcasts (iPhone)",
        description:
          "Look for the purple icon with a person and sound waves. It comes built right in to your iPhone. Search any topic to find a show you\u2019ll love.",
      },
      {
        emoji: "\ud83c\udf88",
        label: "Spotify / Google (Android)",
        description:
          "Spotify has podcasts built in alongside music. Search for any topic \u2014 history, gardening, comedy \u2014 and find a show in seconds.",
      },
    ],
  },

  // Slide 10 — Headphones (three-cards)
  {
    id: 10,
    layout: "three-cards",
    title: "How to Listen",
    cards: [
      {
        emoji: "\ud83c\udfa7",
        label: "Wired Earbuds",
        description:
          "Plug into the headphone jack or charging port. Simple, reliable, and great sound.",
      },
      {
        emoji: "\ud83c\udfa7",
        label: "Over-Ear Headphones",
        description:
          "Larger cups that go over your ears. Excellent sound quality and very comfortable for long listening.",
      },
      {
        emoji: "\ud83e\udd76",
        label: "Wireless Earbuds",
        description:
          "Small buds that connect via Bluetooth \u2014 no wires! Perfect for walks and staying active.",
      },
    ],
  },

  // Slide 11 — Checklist / Summary
  {
    id: 11,
    layout: "checklist",
    title: "Your Phone is a Fun Machine!",
    bullets: [
      "You know how to find and watch videos on YouTube.",
      "You can listen to any song you love.",
      "You know what a podcast is and how to find one.",
      "You can use your phone as a worldwide radio.",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s test our digital entertainment knowledge!",
    emoji: "\ud83c\udfae",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Staying Connected \u2014 Video Calls",
  },
];

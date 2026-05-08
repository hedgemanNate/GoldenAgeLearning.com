// Staying Safe Online — slide deck content.
// Source: Class 9 Staying Safe Online: Your Guide to Digital Security
// Used by both the launch page (totalSlides) and the display page (render).
// Pure data — no React, no styling decisions here.

export interface SlideContent {
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

export const stayingSafeOnlineSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Staying Safe Online",
    subtitle: "A Deeper Dive into Digital Security",
    classLabel: "Digital Security \u00b7 Class 9",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Security Goals Today",
    bullets: [
      "A quick review of our core safety rules",
      "How to create a strong, memorable password",
      "How to spot more advanced phishing scams",
      "The risks of using public Wi-Fi",
      "Why software updates are so important",
    ],
  },

  // Slide 3 — Core Safety Rules
  {
    id: 3,
    layout: "three-cards",
    title: "Our Core Safety Rules",
    cards: [
      {
        emoji: "\uD83E\uDD47",
        label: "The Golden Rule",
        description: "If it seems too good to be true, it is!",
      },
      {
        emoji: "\uD83D\uDD12",
        label: "Look for the Lock",
        description: "Always check for the padlock before entering private information.",
      },
      {
        emoji: "\uD83D\uDEAB",
        label: "No Pop-Ups",
        description: "Never click on strange pop-up windows.",
      },
    ],
  },

  // Slide 4 — What Makes a Strong Password?
  {
    id: 4,
    layout: "icon-tip",
    title: "The Key to Your Digital House",
    emoji: "\uD83D\uDD11",
    body: "A strong password is your best defense! The best passwords are:\n\n\u2022 Long \u2014 at least 12 characters.\n\n\u2022 A Mix \u2014 capital letters, lowercase letters, numbers, and symbols.\n\n\u2022 Unique \u2014 use a different password for each important website.",
    tip: "Weak: \u201cpassword\u201d \u2717   Strong: \u201cMyCatFluffy!1998\u201d \u2713",
  },

  // Slide 5 — The Pass-Phrase Method
  {
    id: 5,
    layout: "icon-tip",
    title: "An Easy Way to Make Strong Passwords",
    emoji: "\uD83D\uDCAC",
    body: "Try a \u201cpass-phrase!\u201d String together four simple, random words. It\u2019s easy for you to remember, but very hard for others to guess.\n\nYou don\u2019t need to remember random letters \u2014 just picture the words in your mind.",
    tip: "\uD83C\uDF33 + \uD83D\uDE97 + \uD83D\uDC36 + 7  =  TreeBlueDog7",
  },

  // Slide 6 — Advanced Phishing Scams
  {
    id: 6,
    layout: "three-cards",
    title: "The New Phishing Lures",
    cards: [
      {
        emoji: "\uD83D\uDCE6",
        label: "Fake Delivery",
        description: "A package delivery you weren\u2019t expecting \u2014 often fake.",
      },
      {
        emoji: "\uD83D\uDCF8",
        label: "Photo Tag",
        description: "Being \u201ctagged in a photo\u201d by someone you don\u2019t know.",
      },
      {
        emoji: "\uD83D\uDD14",
        label: "Security Alert",
        description: "A fake \u201csecurity alert\u201d from Facebook, Amazon, or your bank.",
      },
    ],
  },

  // Slide 7 — The #1 Rule for Links (two-cards: Wrong Way / Right Way)
  {
    id: 7,
    layout: "two-cards",
    title: "Don\u2019t Trust the Link, Go Direct",
    cards: [
      {
        emoji: "\u274C",
        label: "Wrong Way",
        description: "Clicking a link inside a suspicious email.",
      },
      {
        emoji: "\u2705",
        label: "Right Way",
        description: "Close the email. Open your browser and type the company\u2019s real website address yourself.",
      },
    ],
  },

  // Slide 8 — Dangers of Public Wi-Fi
  {
    id: 8,
    layout: "icon-tip",
    title: "Public Wi-Fi is a Public Place",
    emoji: "\u2615",
    body: "Free Wi-Fi at a coffee shop, hotel, or airport is great for reading the news. But it\u2019s not private \u2014 others on the network can potentially \u201clisten in.\u201d\n\nThink of it like a conversation in a crowded restaurant.",
    tip: "Avoid banking or shopping on public Wi-Fi. Wait until you\u2019re home on your private network.",
  },

  // Slide 9 — Importance of Updates
  {
    id: 9,
    layout: "icon-tip",
    title: "Why Your Phone Asks to \u201cUpdate\u201d",
    emoji: "\uD83D\uDD04",
    body: "When your phone or an app asks to \u201cUpdate,\u201d it\u2019s a good thing! Updates are free security upgrades that fix problems and patch newly discovered holes.\n\nThink of it as a repairman fixing a faulty window lock in your home \u2014 for free!",
    tip: "Always tap \u201cInstall Now\u201d when you see a software update notification.",
  },

  // Slide 10 — You're a Security Expert!
  {
    id: 10,
    layout: "checklist",
    title: "You\u2019re a Security Expert!",
    bullets: [
      "You know how to create a strong pass-phrase.",
      "You can spot more types of tricky phishing scams.",
      "You know to be careful on public Wi-Fi.",
      "You understand why updates are your friend!",
    ],
  },

  // Slide 11 — Game Time!
  {
    id: 11,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s test our new security skills!",
    emoji: "\uD83C\uDF6F",
  },

  // Slide 12 — Closing
  {
    id: 12,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Advanced Digital Skills",
  },
];

// See Them Smile — slide deck content.
// Source: Class 8 See Them Smile: An Introduction to Video Calling
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

export const seeThemSmileSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "See Them Smile",
    subtitle: "An Introduction to Video Calling",
    classLabel: "Smartphone Basics \u00b7 Class 8",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Goals for Today",
    bullets: [
      "Learn what a \u201cvideo call\u201d is",
      "Discover the most common video calling apps",
      "How to make a video call to a contact",
      "How to answer an incoming video call",
      "Tips for having a great call",
    ],
  },

  // Slide 3 — What is a Video Call?
  {
    id: 3,
    layout: "icon-tip",
    title: "What is a Video Call?",
    emoji: "\uD83D\uDCF9",
    body: "A video call is just like a regular phone call, but you can also see the person you\u2019re talking to! It\u2019s the next best thing to being in the same room.",
    tip: "Your phone needs a front-facing camera \u2014 all modern smartphones have one!",
  },

  // Slide 4 — What You Need
  {
    id: 4,
    layout: "icon-tip",
    title: "What You Need for a Great Call",
    emoji: "\uD83D\uDCF6",
    body: "For the best, smoothest experience, make sure your phone is connected to Wi-Fi. Video calls use a lot of data \u2014 Wi-Fi keeps things smooth and avoids extra charges.",
    tip: "Think of it like a big truck vs. a small car on the internet highway. Wi-Fi is the free highway!",
  },

  // Slide 5 — Common Video Call Apps
  {
    id: 5,
    layout: "two-cards",
    title: "Common Video Call Apps",
    cards: [
      {
        emoji: "\uD83C\uDF4F",
        label: "FaceTime (Apple Only)",
        description:
          "Apple\u2019s built-in video calling app. Easy to use \u2014 but only works between two Apple devices like iPhones and iPads.",
      },
      {
        emoji: "\uD83D\uDCF9",
        label: "Google Meet (For Everyone)",
        description:
          "Works on any phone, iPhone or Android. Great for calling family members no matter what device they have.",
      },
    ],
  },

  // Slide 6 — Making a Video Call
  {
    id: 6,
    layout: "icon-tip",
    title: "Making a Video Call",
    emoji: "\uD83D\uDCD3",
    body: "The easiest way is right from your Contacts list! Open the contact you want to call and look for the small video camera icon next to their name. Tap it \u2014 your phone does the rest!",
    tip: "You don\u2019t need to open a separate app. Your Contacts app is the shortcut.",
  },

  // Slide 7 — Answering a Video Call
  {
    id: 7,
    layout: "icon-tip",
    title: "\u201cHello!\u201d Answering a Call",
    emoji: "\uD83D\uDCF2",
    body: "An incoming video call looks very similar to a regular phone call. Your screen will light up with the caller\u2019s name. Just swipe the green button to answer and see their smiling face!",
    tip: "Green = Answer \u2022 Red = Decline. Same as a regular phone call.",
  },

  // Slide 8 — Controls During Your Call
  {
    id: 8,
    layout: "two-cards",
    title: "During the Call: Mute & Camera Off",
    cards: [
      {
        emoji: "\uD83C\uDFA4",
        label: "Mute Button",
        description:
          "Tap to turn off your sound. The other person can\u2019t hear you. Perfect if the dog starts barking! Tap again to unmute.",
      },
      {
        emoji: "\uD83D\uDCF9",
        label: "Stop Camera Button",
        description:
          "Tap to turn off your video. They can still hear you, but won\u2019t see you. Tap again to turn video back on.",
      },
    ],
  },

  // Slide 9 — Netiquette Tips
  {
    id: 9,
    layout: "agenda",
    title: "Tips for a Great Call",
    bullets: [
      "Look at the little camera on the front of your phone \u2014 it feels like eye contact!",
      "Make sure you have good lighting on your face.",
      "Be aware of what\u2019s in the background behind you.",
    ],
  },

  // Slide 10 — You Did It!
  {
    id: 10,
    layout: "checklist",
    title: "You\u2019re a Video Caller!",
    bullets: [
      "You know what video calling is and what you need for it.",
      "You can make a video call from your contacts.",
      "You know how to answer an incoming video call.",
      "You have tips for being a video call pro!",
    ],
  },

  // Slide 11 — Game Time
  {
    id: 11,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s review what we\u2019ve learned about seeing them smile!",
    emoji: "\uD83C\uDFAF",
  },
];

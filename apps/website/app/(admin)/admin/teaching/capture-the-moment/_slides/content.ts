// Capture the Moment — slide deck content.
// Source: Class 10 Capture the Moment: Taking and Sharing Photos
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

export const captureTheMomentSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Capture the Moment",
    subtitle: "Taking and Sharing Your Photos",
    classLabel: "Photography \u00b7 Class 10",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Photo Adventure",
    bullets: [
      "How to use the Camera app to take a picture",
      "A simple trick for a clearer photo",
      "How to find and view your photos",
      "Two easy ways to make your photos look even better",
      "How to share your photos with family and friends",
    ],
  },

  // Slide 3 — Your Camera is an App
  {
    id: 3,
    layout: "icon-tip",
    title: "Your Camera is an App!",
    emoji: "\uD83D\uDCF7",
    body: "To get started, find and tap the 'Camera' app icon on your screen.\n\nLook on your home screen for the icon that looks like a camera lens. Tap it and you\u2019re ready to take photos!\n\nIt\u2019s one of the most powerful tools in your digital toolbox.",
    tip: "The Camera app is usually on your home screen. If you can\u2019t find it, try swiping down and searching for 'Camera.'",
  },

  // Slide 4 — How to Take a Picture
  {
    id: 4,
    layout: "icon-tip",
    title: "Taking a Picture is Easy!",
    emoji: "\uD83D\uDCF8",
    body: "It only takes two steps:\n\n1. Point your phone at what you want to capture.\n\n2. Tap the big white circle at the bottom of the screen \u2014 that\u2019s the shutter button!",
    tip: "You can also press the volume button on the side of your phone to take a photo \u2014 great for steady shots!",
  },

  // Slide 5 — Tap to Focus
  {
    id: 5,
    layout: "icon-tip",
    title: "A Simple Trick: Tap to Focus",
    emoji: "\uD83C\uDFAF",
    body: "Before you take the picture, tap your subject on the screen. A little yellow or white square will appear.\n\nThis tells the camera: 'Make this sharp and perfectly lit!'\n\nIt\u2019s a tiny move that makes a huge difference in photo quality.",
    tip: "Always tap your subject first \u2014 especially for portraits. Your photos will look dramatically sharper!",
  },

  // Slide 6 — Finding Your Photos
  {
    id: 6,
    layout: "two-cards",
    title: "Viewing Your Memories",
    subtitle: "Your photos are automatically saved \u2014 here\u2019s where to find them:",
    cards: [
      {
        emoji: "\uD83C\uDF38",
        label: "For iPhone or iPad",
        description: "Look for the colorful flower icon \u2014 it\u2019s the 'Photos' app. Tap it to see all your pictures!",
      },
      {
        emoji: "\uD83C\uDF00",
        label: "For Android Phone",
        description: "Look for the colorful pinwheel icon \u2014 it\u2019s the 'Gallery' or 'Photos' app. Your pictures are waiting inside!",
      },
    ],
  },

  // Slide 7 — Editing intro
  {
    id: 7,
    layout: "icon-tip",
    title: "A Touch of Magic: Editing",
    emoji: "\u2728",
    body: "You can make your photos look even better! Open any photo you\u2019ve taken, then look for the 'Edit' button.\n\nIt\u2019s usually at the top or bottom of the screen. Tap it to see your editing options.",
    tip: "Don\u2019t worry \u2014 editing never deletes your original photo. Tap 'Cancel' anytime to go back to the original.",
  },

  // Slide 8 — Two Essential Edits
  {
    id: 8,
    layout: "two-cards",
    title: "Two Quick & Easy Edits",
    subtitle: "Don\u2019t get overwhelmed \u2014 just learn these two!",
    cards: [
      {
        emoji: "\u2702\uFE0F",
        label: "Crop & Rotate",
        description: "Straighten a crooked photo or cut out distracting things on the side. Tap the crop icon and drag the edges.",
      },
      {
        emoji: "\uD83E\uDE84",
        label: "Auto-Enhance",
        description: "Look for the magic wand icon. One tap automatically improves the light and color in your photo!",
      },
    ],
  },

  // Slide 9 — Share Icon
  {
    id: 9,
    layout: "two-cards",
    title: "The Best Part: Sharing",
    subtitle: "Open a photo and look for the Share icon \u2014 your gateway to the world!",
    cards: [
      {
        emoji: "\uD83D\uDCE4",
        label: "On iPhone",
        description: "The share icon is a box with an arrow pointing up. You\u2019ll find it at the bottom of the screen.",
      },
      {
        emoji: "\uD83D\uDD37",
        label: "On Android",
        description: "The share icon looks like three dots connected by lines. You\u2019ll find it at the top or bottom of the screen.",
      },
    ],
  },

  // Slide 10 — How to Share
  {
    id: 10,
    layout: "icon-tip",
    title: "How to Share Your Photo",
    emoji: "\uD83D\uDCF2",
    body: "Tapping the Share icon opens a menu. Just tap the app you want to use:\n\n\u2022 Tap 'Messages' to text the photo to a family member.\n\n\u2022 Tap 'Mail' to send it in an email.\n\n\u2022 Tap more options to see all the ways you can share!",
    tip: "When someone receives your photo, it looks exactly like it did on your screen. Sharing is that simple!",
  },

  // Slide 11 — You're a Photographer!
  {
    id: 11,
    layout: "checklist",
    title: "You\u2019re a Photographer!",
    bullets: [
      "You can take clear, focused photos",
      "You know how to find all your pictures",
      "You can make simple edits to improve your photos",
      "You can share your favorite moments with loved ones!",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s review our new photography skills!",
    emoji: "\uD83C\uDFAE",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Social Media & Staying Connected",
  },
];

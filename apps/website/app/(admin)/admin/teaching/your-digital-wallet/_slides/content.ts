// Your Digital Wallet — slide deck content.
// Source: Class 14 Your Digital Wallet: An Introduction to Mobile Payments
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

export const yourDigitalWalletSlides: Slide[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Your Digital Wallet",
    subtitle: "An Introduction to Mobile Payments",
    classLabel: "Mobile Payments \u00b7 Class 14",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Mission Today",
    bullets: [
      "What is a Digital Wallet?",
      "Meet Apple Pay and Google Pay",
      'The \u201cMagic Move\u201d \u2014 how to pay at the store',
      "Why mobile payments are incredibly secure",
      "How to keep your wallet safe",
    ],
  },

  // Slide 3 — What is a Digital Wallet (icon-tip)
  {
    id: 3,
    layout: "icon-tip",
    title: "Goodbye, Bulky Wallets!",
    emoji: "\ud83d\udcb3",
    body: "A digital wallet is an app on your phone that securely stores your credit and debit cards. Instead of digging through a bulky wallet, your phone holds all your cards safely — ready to pay with just a tap.",
    tip: "You\u2019re not replacing your bank account. Your phone just gets a secure way to use it.",
  },

  // Slide 4 — Finding Your App (two-cards)
  {
    id: 4,
    layout: "two-cards",
    title: "Finding Your App",
    cards: [
      {
        emoji: "\ud83c\udf4e",
        label: "For iPhone",
        description:
          "Look for the Wallet app \u2014 it has colorful cards on the icon. It comes built right in to your iPhone.",
      },
      {
        emoji: "\ud83e\udd16",
        label: "For Android",
        description:
          "Look for Google Wallet \u2014 a colorful \u201cG\u201d on a white background. It\u2019s already on most Android phones.",
      },
    ],
  },

  // Slide 5 — The Tap to Pay Symbol (icon-tip)
  {
    id: 5,
    layout: "icon-tip",
    title: "Look for the Wave!",
    emoji: "\ud83d\udce1",
    body: "At the checkout counter, look at the little payment machine where you normally swipe your card. If you see a symbol that looks like a sideways Wi-Fi signal \u2014 four curved lines pointing right \u2014 that means you can tap to pay with your phone!",
    tip: "You\u2019ll find this symbol at Publix, Walgreens, Target, CVS, and most coffee shops.",
  },

  // Slide 6 — The Magic Move (icon-tip)
  {
    id: 6,
    layout: "icon-tip",
    title: "The \u201cMagic Move\u201d",
    emoji: "\ud83e\ude84",
    body: "Step 1: Double-tap the button on the side of your phone to open your wallet. Step 2: Your phone checks your Face or Fingerprint to confirm it\u2019s you. Step 3: Hold the top of your phone near the wave symbol on the reader. You\u2019ll hear a little ping and see a green checkmark. You\u2019re done!",
    tip: "No typing a PIN on a dirty keypad. Your face is your signature!",
  },

  // Slide 7 — Why It's More Secure (icon-tip)
  {
    id: 7,
    layout: "icon-tip",
    title: "Why It\u2019s Incredibly Safe",
    emoji: "\ud83d\udee1\ufe0f",
    body: "When you swipe a physical card, the store sees your real account number. But when you tap your phone, it creates a unique, one-time number just for that purchase. If a hacker stole that number an hour later, it would be completely useless! Your real card number is never shared.",
    tip: "Mobile payments are considered one of the most secure ways to pay ever invented.",
  },

  // Slide 8 — Face ID & Fingerprint (two-cards)
  {
    id: 8,
    layout: "two-cards",
    title: "Your Face is the Key",
    cards: [
      {
        emoji: "\ud83e\udd33",
        label: "Face ID (iPhone)",
        description:
          "Your iPhone\u2019s camera recognizes your face in an instant. No thief can copy your face.",
      },
      {
        emoji: "\u261d\ufe0f",
        label: "Fingerprint (Android)",
        description:
          "Your unique fingerprint is your personal lock and key. It\u2019s the only one in the world.",
      },
    ],
  },

  // Slide 9 — What if I Lose My Phone (icon-tip)
  {
    id: 9,
    layout: "icon-tip",
    title: "Your Phone is a Vault",
    emoji: "\ud83d\udd12",
    body: "If you lose your phone, your money is still safe. Without your face or fingerprint, no one can open your wallet \u2014 not even the person who found it. And if you need to, you can freeze your wallet from any computer by logging into iCloud or your Google account.",
    tip: "Losing your phone is often safer than losing your purse, because the wallet requires your biometrics to open.",
  },

  // Slide 10 — Where Can I Use It (three-cards)
  {
    id: 10,
    layout: "three-cards",
    title: "Everywhere You Go!",
    cards: [
      {
        emoji: "\ud83d\uded2",
        label: "Grocery Stores",
        description:
          "Publix, Winn-Dixie, Walmart, and most major grocery stores all accept tap to pay.",
      },
      {
        emoji: "\ud83d\udc8a",
        label: "Pharmacies",
        description:
          "Walgreens, CVS, and Rite Aid all support mobile payments at the register.",
      },
      {
        emoji: "\u2615",
        label: "Coffee & More",
        description:
          "Starbucks, Dunkin\u2019, gas stations, and thousands of restaurants accept the wave symbol.",
      },
    ],
  },

  // Slide 11 — Checklist / Summary
  {
    id: 11,
    layout: "checklist",
    title: "You\u2019re a Mobile Payment Master!",
    bullets: [
      "You know what a digital wallet is.",
      "You can spot the \u201cwave\u201d symbol at any store.",
      "You know the three-step Magic Move.",
      "You understand why it\u2019s safer than a physical card.",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s test our mobile payment knowledge!",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Staying Connected \u2014 Video Calls",
  },
];

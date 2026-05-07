// Making Connections: Contacts & Calls — slide deck content.
// Source: Class5_PowerPoint_Script.md
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

export const makingConnectionsSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Making Connections",
    subtitle: "Your Guide to Contacts & Calls",
    classLabel: "Smartphone Basics · Class 5",
  },

  // Slide 2 — Our Goals for Today
  {
    id: 2,
    layout: "agenda",
    title: "Our Goals for Today",
    bullets: [
      "Explore your phone\u2019s digital address book",
      "How to create a new contact",
      "How to edit a contact\u2019s information",
      "How to set \u201cFavorites\u201d for people you call often",
      "How to make a phone call",
      "How to answer a phone call",
    ],
  },

  // Slide 3 — Your Digital Address Book
  {
    id: 3,
    layout: "icon-tip",
    title: "Goodbye, Little Black Book!",
    emoji: "📖",
    body: "Your phone has a built-in digital address book called \u201cContacts.\u201d\n\nIt\u2019s the place where you save every phone number so you never have to hunt for one again!\n\nOnce a number is saved, it\u2019s there for good \u2014 easy to find, easy to update.",
    tip: "Unlike paper, your digital Contacts will never get messy or hard to read.",
  },

  // Slide 4 — A Tour of the Phone App
  {
    id: 4,
    layout: "agenda",
    title: "A Tour of the Phone App",
    bullets: [
      "\u2b50 Favorites \u2014 Your VIP shortlist for people you call often",
      "\uD83D\uDD50 Recents \u2014 A log of your last calls, incoming and outgoing",
      "\uD83D\uDC64 Contacts \u2014 Your complete digital address book",
      "\u2328\uFE0F Keypad \u2014 For dialing a number by hand",
    ],
  },

  // Slide 5 — Saving a New Number
  {
    id: 5,
    layout: "icon-tip",
    title: "Saving a New Number",
    emoji: "\u2795",
    body: "Open your Contacts list and look for a plus sign (+) in the top corner. Tap it to begin.\n\nThe + sign almost always means \u201cAdd new\u201d in any app.\n\nYou\u2019ll land on a blank \u201cNew Contact\u201d page, ready for you to fill in.",
    tip: "No + sign? Look for a button that says \u201cNew\u201d or \u201cAdd Contact.\u201d",
  },

  // Slide 6 — Filling in the Details
  {
    id: 6,
    layout: "icon-tip",
    title: "Filling in the Details",
    emoji: "\uD83D\uDCCB",
    body: "You only need two things: a name and a phone number.\n\n1. Tap the First Name box and type their first name.\n2. Tap the Last Name box and type their last name.\n3. Tap the Phone box and type their number.\n\nWhen you\u2019re done, tap the \u201cSave\u201d or \u201cDone\u201d button.",
    tip: "That\u2019s it! Name + number. Everything else is optional.",
  },

  // Slide 7 — Editing a Contact
  {
    id: 7,
    layout: "icon-tip",
    title: "Need to Make a Change?",
    emoji: "\u270F\uFE0F",
    body: "If someone gets a new phone number, updating it is simple.\n\nFind their name in Contacts. Tap to open their contact card.\n\nThen tap the \u201cEdit\u201d button \u2014 usually in the top corner. Change whatever you need, then tap \u201cSave\u201d or \u201cDone.\u201d",
    tip: "No need to delete and start over. Edit is your friend!",
  },

  // Slide 8 — Favorites
  {
    id: 8,
    layout: "icon-tip",
    title: "Your VIPs: The Favorites List",
    emoji: "\u2B50",
    body: "For the people you call all the time \u2014 your spouse, your children, your best friend \u2014 add them to Favorites!\n\nOpen their contact card and look for \u201cAdd to Favorites.\u201d Tap it and they appear on a special short list.\n\nNow you can reach your most important people in just one tap.",
    tip: "Favorites live at the very first tab of your Phone app \u2014 always front and center.",
  },

  // Slide 9 — Making a Call
  {
    id: 9,
    layout: "icon-tip",
    title: "Let\u2019s Make a Call!",
    emoji: "\uD83D\uDCDE",
    body: "It\u2019s just two taps!\n\n1. Find the person in Contacts or Favorites and tap their name.\n\n2. Tap their phone number on the contact card.\n\nYour phone dials automatically and shows you a \u201cCalling\u2026\u201d screen.",
    tip: "You can also call from Recents \u2014 tap any name in your call history.",
  },

  // Slide 10 — Answering a Call
  {
    id: 10,
    layout: "two-cards",
    title: "\u201cHello?\u201d Answering a Call",
    subtitle: "When someone calls you, your screen lights up with their name. You have two choices:",
    cards: [
      {
        emoji: "\uD83D\uDCDE",
        label: "Swipe GREEN to Answer",
        description: "Slide the green button across the screen to pick up. Say hello!",
      },
      {
        emoji: "\uD83D\uDCF5",
        label: "Swipe RED to Ignore",
        description: "Slide the red button to send the call to voicemail. They can leave a message.",
      },
    ],
  },

  // Slide 11 — Checklist / Summary
  {
    id: 11,
    layout: "checklist",
    title: "You\u2019re a Connections Master!",
    bullets: [
      "You can create and edit contacts in your digital address book.",
      "You can set Favorites for your most important people.",
      "You know how to make a phone call from your contacts list.",
      "You know how to answer \u2014 and ignore \u2014 an incoming call.",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s review what we\u2019ve learned about making connections.",
    emoji: "\uD83C\uDFAF",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Your Camera & Photos",
  },
];

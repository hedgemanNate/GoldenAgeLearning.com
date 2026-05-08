// Email Essentials — slide deck content.
// Source: Class6_EmailEssentials content
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

export const emailEssentialsSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Email Essentials",
    subtitle: "Stay Connected with Family & Friends",
    classLabel: "Smartphone Basics \u00b7 Class 6",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "What We\u2019ll Cover Today",
    bullets: [
      "What is email and how does it work?",
      "The four main parts of every email",
      "How to write and send your first email",
      "Reply vs. Forward \u2014 which one to use",
      "Keeping your inbox organized",
      "Staying safe from spam and scams",
    ],
  },

  // Slide 3 — What Is Email?
  {
    id: 3,
    layout: "icon-tip",
    title: "What Is Email?",
    emoji: "\uD83D\uDCE7",
    body: "Email stands for \u201cElectronic Mail.\u201d It\u2019s a way to send messages from your phone, tablet, or computer to anyone in the world instantly.\n\nEvery email has a unique address, just like your home address. It looks like: yourname@gmail.com\n\nOnce you send a message, it arrives in the other person\u2019s inbox in seconds \u2014 no stamps required!",
    tip: "Email is free! It doesn\u2019t use your text messages or cost anything extra.",
  },

  // Slide 4 — The Four Parts of an Email
  {
    id: 4,
    layout: "agenda",
    title: "Every Email Has Four Main Parts",
    bullets: [
      "\uD83D\uDCEE To \u2014 The email address of the person you are writing to",
      "\uD83D\uDCDD Subject \u2014 A short title that tells what your email is about",
      "\u270D\uFE0F Body \u2014 The main message you want to say",
      "\u2708\uFE0F Send \u2014 The button that delivers your email instantly",
    ],
  },

  // Slide 5 — The 'To' Field
  {
    id: 5,
    layout: "icon-tip",
    title: "The \u2018To\u2019 Field: Who Gets Your Message",
    emoji: "\uD83D\uDC64",
    body: "The \u201cTo\u201d field is where you type the email address of the person you are writing to.\n\nEvery email address has three parts: a name, the @ symbol, and a domain (like gmail.com or yahoo.com).\n\nExample: mary.smith@gmail.com\n\nIf even one letter is wrong, the email won\u2019t reach them \u2014 so take your time typing it!",
    tip: "Start typing a name and your phone may suggest the address automatically from your contacts.",
  },

  // Slide 6 — The Subject Line
  {
    id: 6,
    layout: "icon-tip",
    title: "The Subject Line: A Window Into Your Message",
    emoji: "\uD83D\uDCDD",
    body: "The Subject line is a short phrase that tells the reader what your email is about \u2014 before they even open it.\n\nThink of it like the cover of a book. A clear subject helps your friend find your email quickly later.\n\nGood examples: \u201cLunch plans for Friday\u201d or \u201cPhotos from the family reunion\u201d",
    tip: "Keep it short! One brief phrase is perfect. An empty subject line may cause your email to be missed.",
  },

  // Slide 7 — The Body
  {
    id: 7,
    layout: "icon-tip",
    title: "The Body: Writing Your Message",
    emoji: "\u270D\uFE0F",
    body: "The Body is where you write your actual message. Treat it just like writing a friendly note.\n\nStart with a greeting: \u201cHi Mary!\u201d\nWrite what you want to say.\nEnd with a sign-off: \u201cTalk soon, Jane\u201d\n\nYou can write as much or as little as you like. There\u2019s no limit!",
    tip: "Not ready to send yet? Tap \u201cSave as Draft\u201d and come back to it whenever you\u2019re ready.",
  },

  // Slide 8 — Reply vs. Forward
  {
    id: 8,
    layout: "two-cards",
    title: "Reply vs. Forward",
    subtitle: "Both are ways to respond to an email \u2014 but they do very different things.",
    cards: [
      {
        emoji: "\u21A9\uFE0F",
        label: "Reply",
        description:
          "Sends your response back to ONLY the person who sent you the email. Great for a private conversation.",
      },
      {
        emoji: "\u27A1\uFE0F",
        label: "Forward",
        description:
          "Passes the original email on to someone ELSE entirely. Use it to share a message with a friend who wasn\u2019t on it.",
      },
    ],
  },

  // Slide 9 — Sending & Your Inbox
  {
    id: 9,
    layout: "icon-tip",
    title: "Sending \u2014 and Finding Your Inbox",
    emoji: "\u2708\uFE0F",
    body: "When you\u2019re happy with your email, tap the Send button \u2014 it\u2019s usually a paper airplane \u2728\n\nYour sent emails are saved in the Sent folder. If you start writing but aren\u2019t ready to send, they go to Drafts.\n\nDeleted emails go to Trash. They stay there for a while before disappearing permanently.",
    tip: "Check your inbox every day or two so you never miss an important message from family or friends.",
  },

  // Slide 10 — Staying Safe: Spotting Spam
  {
    id: 10,
    layout: "icon-tip",
    title: "Staying Safe: Spotting Spam \uD83D\uDEE1\uFE0F",
    emoji: "\uD83D\uDEA8",
    body: "Spam emails are unwanted messages, and some are dangerous. Watch for these red flags:\n\n\u2022 A stranger asks for your password, bank info, or Social Security number.\n\u2022 The email says you\u2019ve won a prize and need to click a link.\n\u2022 It creates panic: \u201cYour account will be closed!\u201d\n\nThe Golden Rule: If you\u2019re not sure, DON\u2019T tap it. Delete it.",
    tip: "No bank, doctor, or government office will ever ask for your password by email.",
  },

  // Slide 11 — Checklist
  {
    id: 11,
    layout: "checklist",
    title: "You\u2019re an Email Pro!",
    bullets: [
      "You know what email is and how email addresses work.",
      "You can write an email with a To field, Subject, Body, and Send it.",
      "You know the difference between Reply and Forward.",
      "You can spot the warning signs of a spam or scam email.",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s put your email knowledge to the test!",
    emoji: "\uD83C\uDFAF",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Camera \u0026 Photos",
  },
];

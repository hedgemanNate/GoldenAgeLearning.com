// Texting & Messaging — slide deck content.
// Source: Class 7 Texting & Messaging
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

export const textingAndMessagingSlides: SlideContent[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Texting & Messaging",
    subtitle: "Quick & Easy Conversations",
    classLabel: "Smartphone Basics \u00b7 Class 7",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "What We\u2019ll Learn Today",
    bullets: [
      "Why text instead of email?",
      "How to read and reply to a message",
      "Starting a brand new conversation",
      "Sending a photo to someone you love",
      "What is a group chat?",
      "The golden rule of texting safety",
    ],
  },

  // Slide 3 — Texting vs. Email
  {
    id: 3,
    layout: "two-cards",
    title: "Texting vs. Email: What\u2019s the Difference?",
    cards: [
      {
        emoji: "\uD83D\uDCAC",
        label: "Text Message",
        description:
          "Like passing a quick note. Short and fast. Perfect for \u201cOn my way!\u201d or \u201cSee you at 5.\u201d",
      },
      {
        emoji: "\u2709\uFE0F",
        label: "Email",
        description:
          "Like writing a full letter. Better for longer, detailed messages or sharing lots of information.",
      },
    ],
  },

  // Slide 4 — Your Messages App
  {
    id: 4,
    layout: "icon-tip",
    title: "Your \u2018Messages\u2019 App",
    emoji: "\uD83D\uDCF1",
    body: "The Messages app is where all your text conversations live.\n\nOn an iPhone, it\u2019s a green icon with a white speech bubble. On an Android, it\u2019s usually a blue icon.\n\nLook for it on your home screen and tap it to open. When you do, you\u2019ll see a list of all your conversations.",
    tip: "Can\u2019t find it? Swipe down on your home screen and type \u201cMessages\u201d in the search bar.",
  },

  // Slide 5 — Conversation List
  {
    id: 5,
    layout: "icon-tip",
    title: "Your List of Conversations",
    emoji: "\uD83D\uDCCB",
    body: "When you open the Messages app, you\u2019ll see your conversation list. It works like an inbox for texts.\n\nEach row is a different person or group. The newest conversations are always at the top.\n\nTap any row to open that conversation and read the messages.",
    tip: "A bold name means there is an unread message waiting for you.",
  },

  // Slide 6 — Reading and Replying
  {
    id: 6,
    layout: "icon-tip",
    title: "How to Read and Reply",
    emoji: "\uD83D\uDC46",
    body: "Tap any conversation to open it. Your messages and the other person\u2019s messages appear as speech bubbles on opposite sides of the screen.\n\nTo reply, tap the white text box at the bottom of the screen. Your keyboard will pop up. Type your message, then tap the arrow button to send it.",
    tip: "You can use the emoji keyboard too! Look for the smiley face button on your keyboard.",
  },

  // Slide 7 — Starting a New Text
  {
    id: 7,
    layout: "icon-tip",
    title: "Starting a Brand New Text",
    emoji: "\u270F\uFE0F",
    body: "To start a fresh conversation, look for the Compose icon on your conversation list screen. It looks like a square with a pencil in the corner.\n\nTap it, and a \u201cNew Message\u201d screen will appear. In the \u201cTo:\u201d field, start typing a name. Your Contacts list will suggest matches \u2014 tap the right name and you\u2019re ready to type!",
    tip: "You never have to remember a phone number. Just type the person\u2019s name from your Contacts.",
  },

  // Slide 8 — Sharing a Picture
  {
    id: 8,
    layout: "icon-tip",
    title: "Sharing a Picture",
    emoji: "\uD83D\uDCF7",
    body: "Sending a photo is easy and a wonderful way to share moments with family.\n\nInside any conversation, look for the camera icon. Tap it to take a new photo right then and send it.\n\nOr, tap the photo gallery icon (it looks like a little stack of photos) to choose a picture you\u2019ve already taken.",
    tip: "The photo is sent inside the same conversation \u2014 no email or attachment needed!",
  },

  // Slide 9 — Group Chats
  {
    id: 9,
    layout: "icon-tip",
    title: "What Is a Group Chat?",
    emoji: "\uD83D\uDC65",
    body: "A group chat is a text conversation that includes three or more people at the same time.\n\nTo create one, start a new message and add more than one name to the \u201cTo:\u201d field. Everyone added will be part of the conversation.\n\nWhen you type and send a reply, everyone in the group will see it.",
    tip: "Group chats are great for family catch-ups, planning events, or staying in touch with a circle of friends.",
  },

  // Slide 10 — Safety Rule
  {
    id: 10,
    layout: "icon-tip",
    title: "An Important Safety Rule",
    emoji: "\u26A0\uFE0F",
    body: "Text messages are not completely private. Think of them like postcards \u2014 not sealed envelopes.\n\nBecause of this, you should NEVER send sensitive personal information in a text message:\n\n\u2022 Passwords\n\u2022 Credit card numbers\n\u2022 Social Security number\n\nWhen in doubt, pick up the phone and call instead.",
    tip: "No bank or government office will ever ask for your password or SSN over text.",
  },

  // Slide 11 — Checklist
  {
    id: 11,
    layout: "checklist",
    title: "You\u2019re a Messaging Master!",
    bullets: [
      "You know when to text vs. when to email.",
      "You can read, reply, and start a new conversation.",
      "You can share a photo right from your Messages app.",
      "You know the golden rule of texting safely.",
    ],
  },

  // Slide 12 — Game Time
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s put your texting skills to the test!",
    emoji: "\uD83C\uDFAF",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "Next Class: Camera & Photos",
  },
];

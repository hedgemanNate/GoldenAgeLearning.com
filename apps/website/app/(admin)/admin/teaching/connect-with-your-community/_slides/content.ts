// Connect with Your Community — slide deck content.
// Source: Class 16 Connect with Your Community: Understanding Social Media
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

export const connectWithYourCommunitySlides: Slide[] = [
  // Slide 1 — Title
  {
    id: 1,
    layout: "title",
    title: "Connect with Your Community",
    subtitle: "Understanding Social Media (Facebook)",
    classLabel: "Social Media \u00b7 Class 16",
  },

  // Slide 2 — Agenda
  {
    id: 2,
    layout: "agenda",
    title: "Our Mission Today",
    bullets: [
      "What is \u201cSocial Media\u201d?",
      "Meet Facebook: The World\u2019s Town Square",
      "How to find and \u201cFollow\u201d your family",
      "How to join local groups (Hobbies & Community)",
      "The \u201cLike\u201d and \u201cComment\u201d buttons",
      "How to stay safe and private on social media",
    ],
  },

  // Slide 3 — What is Social Media? (icon-tip)
  {
    id: 3,
    layout: "icon-tip",
    title: "What is Social Media?",
    emoji: "\ud83c\udfd9\ufe0f",
    body: "Social media is a website or app where people share photos, stories, and news with each other.\n\nThink of it like a giant digital community center that is always open \u2014 24 hours a day, right in your pocket.",
    tip: "It\u2019s just like the town square or community center you already know \u2014 but digital!",
  },

  // Slide 4 — Meet Facebook (icon-tip)
  {
    id: 4,
    layout: "icon-tip",
    title: "The Big Player: Facebook",
    emoji: "\ud83d\udcf1",
    body: "Facebook is the most popular social media app for seniors. Look for the blue icon with the \u201cf\u201d on your phone.\n\nIt\u2019s the best place to see photos of your grandkids and stay in touch with friends.",
    tip: "Facebook is free to use \u2014 you just need an account and a Wi-Fi connection.",
  },

  // Slide 5 — Finding Your Family (icon-tip)
  {
    id: 5,
    layout: "icon-tip",
    title: "Following the People You Love",
    emoji: "\ud83d\udd0d",
    body: "Tap the Search Bar at the top and type in the name of a child or grandchild. When their profile pops up, tap \u201cAdd Friend.\u201d\n\nOnce they accept, their photos and stories will appear on your phone automatically \u2014 like a digital scrapbook that updates itself!",
    tip: "You can search for anyone by name. Their profile photo helps you confirm it\u2019s the right person.",
  },

  // Slide 6 — Joining Local Groups (three-cards)
  {
    id: 6,
    layout: "three-cards",
    title: "Find Your \u201cTribe\u201d",
    cards: [
      {
        emoji: "\ud83c\udfe0",
        label: "Neighborhood",
        description: "Stay up-to-date on local news and events right in your community.",
      },
      {
        emoji: "\ud83c\udf3c",
        label: "Hobbies",
        description: "Gardening, classic cars, bridge \u2014 there\u2019s a group for every passion.",
      },
      {
        emoji: "\ud83e\udd1d",
        label: "Community",
        description: "Senior center updates, church groups, and local clubs all have Facebook groups.",
      },
    ],
  },

  // Slide 7 — Your Feed (icon-tip)
  {
    id: 7,
    layout: "icon-tip",
    title: "Reading the Digital Newspaper",
    emoji: "\ud83d\udcf0",
    body: "When you open Facebook, you see your \u201cFeed.\u201d This is a never-ending list of photos and stories from the people and groups you follow.\n\nJust scroll down with your finger to keep reading \u2014 new updates appear automatically.",
    tip: "Your Feed is personalized \u2014 you only see posts from people and groups you follow.",
  },

  // Slide 8 — Like & Comment (two-cards)
  {
    id: 8,
    layout: "two-cards",
    title: "Showing You Care",
    cards: [
      {
        emoji: "\ud83d\udc4d",
        label: "The \u201cLike\u201d Button",
        description: "Tap the thumbs-up icon to give someone a digital \u201cpat on the back.\u201d It tells them you enjoyed their photo or story.",
      },
      {
        emoji: "\ud83d\udcac",
        label: "The \u201cComment\u201d Button",
        description: "Tap the speech bubble icon and your keyboard appears. Type a short message like \u201cGreat hit, Tommy!\u201d to let family know you\u2019re thinking of them.",
      },
    ],
  },

  // Slide 9 — Sharing Your Story (icon-tip)
  {
    id: 9,
    layout: "icon-tip",
    title: "Sharing Your Story",
    emoji: "\ud83d\udce4",
    body: "Want to share a photo or some news? At the top of your Feed, look for the box that says \u201cWhat\u2019s on your mind?\u201d\n\nTap it, type your message, and tap \u201cPost.\u201d You can also tap the camera icon to share a photo you took!",
    tip: "You only need to post when you want to. There is no pressure \u2014 just reading and liking is perfectly fine!",
  },

  // Slide 10 — Privacy & Safety (icon-tip)
  {
    id: 10,
    layout: "icon-tip",
    title: "Who Can See Your Business?",
    emoji: "\ud83d\udd12",
    body: "You are in control! In Settings, you can set your account so that only your \u201cFriends\u201d can see your photos and posts.\n\nAlways remember: never share your phone number, home address, or travel plans on your public profile.",
    tip: "The magic setting is \u201cFriends Only.\u201d This keeps strangers from seeing your life.",
  },

  // Slide 11 — Checklist / Summary
  {
    id: 11,
    layout: "checklist",
    title: "You\u2019re a Social Media Master!",
    bullets: [
      "You know what social media is.",
      "You can find and follow family on Facebook.",
      "You know how to join groups for your interests.",
      "You can \u201cLike\u201d and \u201cComment\u201d on posts.",
      "You know how to stay safe and private.",
    ],
  },

  // Slide 12 — Game Time (focus)
  {
    id: 12,
    layout: "focus",
    title: "Game Time!",
    subtitle: "Let\u2019s review our new social skills!",
    emoji: "\ud83c\udfae",
  },

  // Slide 13 — Closing
  {
    id: 13,
    layout: "closing",
    title: "Thank You!",
    subtitle: "This is our final class \u2014 Congratulations!",
  },
];

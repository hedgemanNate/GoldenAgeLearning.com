export default function TextingAndMessagingScript() {
  const sections = [
    {
      timing: "Approx. 0–3 minutes",
      slideLabel: "SLIDE 1: TITLE SLIDE",
      paragraphs: [
        "Hello again, everyone! Last time, we learned all about **email**, which is great for writing letters. Today, we're going to learn about email's faster, shorter cousin: **Text Messaging**. This is how you have quick, back-and-forth conversations with friends and family, and it's one of the most popular features of any smartphone.",
      ],
    },
    {
      timing: "Approx. 3–5 minutes",
      slideLabel: "SLIDE 2: TODAY'S GOALS",
      paragraphs: [
        "Here's our plan for today. We'll start by talking about *why* you would send a text instead of an email. Then we'll dive right into the app, learning how to read a message and, of course, how to reply. We'll learn how to start a brand new conversation, how to send a photo — which is so much fun — and we'll briefly touch on 'group chats.' And as always, we'll finish with a very important rule for texting safely.",
      ],
    },
    {
      timing: "Approx. 5–8 minutes",
      slideLabel: "SLIDE 3: TEXT VS. EMAIL",
      paragraphs: [
        "So, a text or an email? What's the difference? It's simple, really. Think of **texting like passing a quick note** to a friend. It's for short sentences like 'See you at 5!' or 'Running late!'",
        "**Emails are like writing a full letter.** You use those for longer, more detailed information. We use texting for fast, casual chats, and email for more formal or longer conversations. Today is all about the quick and easy notes.",
      ],
    },
    {
      timing: "Approx. 8–12 minutes",
      slideLabel: "SLIDE 4 & 5: FINDING YOUR MESSAGES & THE CONVERSATION LIST",
      paragraphs: [
        "Okay, let's find the app. Everyone please look on your home screen for your **Messages app**. On an iPhone, it's usually green with a white speech bubble. On an Android phone, it's often blue. Please tap it to open it.",
        "(Pause and walk around, ensuring everyone has the app open.)",
        "What you're seeing now is your conversation list. It's like your email inbox, but for texts. Each line represents a conversation with a different person. The newest conversations will always be at the top. You might not have any yet, and that's perfectly okay! We're about to change that.",
      ],
    },
    {
      timing: "Approx. 12–18 minutes",
      slideLabel: "SLIDE 6 & 7: READING, REPLYING, & STARTING A NEW TEXT",
      paragraphs: [
        "To read a conversation, you just tap on it. When you open it, you'll see the messages look like **speech bubbles**. Your messages will be on one side, and the other person's will be on the other.",
        "To reply, just tap the typing box at the bottom, and your keyboard will pop up.",
        "But what if we want to start a brand new conversation? On your main conversation list screen, look for the **'Compose' icon**. It usually looks like a square with a pencil in it. Let's all tap that now.",
        "(Walk around and help everyone get to the 'New Message' screen.)",
        "You'll see a 'To:' field, just like in an email. But here's the great part: you don't have to remember their phone number! You can just start typing the name of someone in your Contacts list, and they will pop up. Let's all practice together...",
      ],
    },
    {
      timing: "Approx. 18–25 minutes",
      slideLabel: "PRACTICE ACTIVITY — NO SLIDE",
      paragraphs: [
        "Okay, for our main activity today, everyone is going to send me a text message. My phone number is on the board.",
        "In the 'To:' field, please type my phone number.",
        "Now, tap on the message box at the bottom. Your keyboard will appear. I want you to find your **emoji keyboard**, and send me one emoji that shows how you're feeling today! It can be a smiley face, a thumbs up, whatever you like.",
        "When you've picked your emoji, look for the 'Send' button. It's usually an **upward-pointing arrow**. Tap it, and you've sent a text! You should see your emoji appear in a speech bubble on your screen.",
        "(This is the key activity. Spend plenty of time walking around, helping students find the emoji keyboard and send their first text. Your phone will be receiving the messages, which you can acknowledge with a smile.)",
      ],
    },
    {
      timing: "Approx. 25–30 minutes",
      slideLabel: "SLIDE 8 & 9: SENDING PHOTOS & GROUP CHATS",
      paragraphs: [
        "Excellent work, everyone! Now, what if you want to send a picture of your grandchild or your pet? It's so easy to do. In the conversation, near where you type, you'll see a little **camera icon**. If you tap that, you can take a picture right now and send it. Or, if you tap the icon that looks like your **photo gallery**, you can pick a picture you've already taken. It's a wonderful way to share moments with family.",
        "You can also talk to multiple people at once. When you're composing a new message, you can just add more than one person to the 'To:' field. This creates a **'group chat.'** It's like having a conference call, but with texting. Just remember, when you reply, everyone in that group will see your message.",
      ],
    },
    {
      timing: "Approx. 30–32 minutes",
      slideLabel: "SLIDE 10: A QUICK SAFETY RULE",
      paragraphs: [
        "And now for our very important safety rule. While texting is wonderful, it is not the most private form of communication. You should think of a text message like a **postcard**. You wouldn't write your bank account number or your Social Security number on a postcard for everyone to see, would you? The same rule applies here. **Never, ever send passwords, credit card numbers, or other very sensitive private information in a text message.**",
      ],
    },
    {
      timing: "Approx. 32–35 minutes",
      slideLabel: "SLIDE 11: YOU'RE A TEXTER!",
      paragraphs: [
        "And that's it! It really is that simple. Let's recap what we can do now. You can read and reply to texts, start a new conversation, share a photo, and you know the basics of group chats and safety. You are officially a texter! Congratulations!",
      ],
    },
    {
      timing: "Approx. 35–60 minutes",
      slideLabel: "SLIDE 12: GAME TIME!",
      paragraphs: [
        "You all did a fantastic job today. Now let's have a little fun and review everything we've learned about texting. It's time for our game!",
        "(Lead the students in the 25-minute review game.)",
      ],
    },
  ];

  const isStageDirection = (text: string) =>
    text.startsWith("(") && text.endsWith(")");

  const renderParagraph = (text: string, key: number) => {
    if (isStageDirection(text)) {
      return (
        <p
          key={key}
          style={{ fontSize: 17, color: "#888888", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 10px 0" }}
        >
          {text}
        </p>
      );
    }
    // Render **bold** inline
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={key} style={{ fontSize: 17, color: "#000", lineHeight: 1.7, margin: "0 0 10px 0" }}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </p>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>
          Texting &amp; Messaging
        </h1>
        <p style={{ fontSize: 16, color: "#666666", margin: "0 0 8px 0" }}>Teacher&rsquo;s Script</p>
        <div style={{ borderBottom: "1px solid #DDDDDD", marginBottom: 20 }} />

        {/* Class Goals */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 17, fontWeight: "bold", color: "#000", margin: "0 0 6px 0" }}>Class Goals:</p>
          <ul style={{ fontSize: 17, color: "#000", lineHeight: 1.7, margin: 0, paddingLeft: 24 }}>
            <li>Teach the core skills of reading, sending, and starting text messages.</li>
            <li>Differentiate texting from email as a communication tool.</li>
            <li>Introduce photo messaging and group chats in a simple way.</li>
          </ul>
        </div>

        {/* Teacher's Note */}
        <div
          style={{
            backgroundColor: "#F5F5F5",
            borderLeft: "3px solid #CCCCCC",
            padding: 12,
            marginBottom: 28,
          }}
        >
          <p style={{ fontSize: 17, color: "#000", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
            <strong>Teacher&rsquo;s Note:</strong> Texting is often seen as a more casual and immediate form of communication. Your tone should reflect this — make it fun, light, and easy. The key is to get them comfortable with the back-and-forth nature of a text conversation. Have them open their Messages app at the beginning to follow along.
          </p>
        </div>

        {/* Slides */}
        {sections.map((section, i) => (
          <div key={i} style={{ marginTop: 32 }}>
            <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>{section.timing}</p>
            <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 6px 0" }}>
              [{section.slideLabel}]
            </h2>
            <div style={{ borderBottom: "1px solid #EEEEEE", marginBottom: 12 }} />
            {section.paragraphs.map((p, j) => renderParagraph(p, j))}
          </div>
        ))}
      </div>
    </div>
  );
}

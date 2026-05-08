export default function SeeThemSmileScript() {
  const sections = [
    {
      timing: "Approx. 0–3 minutes",
      slideLabel: "SLIDE 1: TITLE SLIDE",
      paragraphs: [
        "Hello, everyone! It is so good to see all your smiling faces in person. Today, we're going to learn how to see the smiling faces of our loved ones, even when they're far away. We're going to talk all about **video calling**. How many of you have ever been on the phone with a grandchild and just wished you could see their face? (Allow for a show of hands). Well, after today, you'll know exactly how to do that.",
      ],
    },
    {
      timing: "Approx. 3–5 minutes",
      slideLabel: "SLIDE 2: TODAY'S GOALS",
      paragraphs: [
        "Here's what we're going to cover. We'll start with what a video call is and what you need to make one happen. We'll look at the most common apps you'll use. Then, we'll walk through the exact steps for how to make a video call and how to answer one when it comes in. Finally, and this is the fun part, I'll give you a few simple tips to make sure you look and feel great on camera.",
      ],
    },
    {
      timing: "Approx. 5–10 minutes",
      slideLabel: "SLIDE 3 & 4: WHAT IS VIDEO CALLING & WHAT YOU'LL NEED",
      paragraphs: [
        "So, what is a video call? It's exactly what it sounds like: a phone call where you can also see a live video of the person you're talking to. It truly is the next best thing to being in the same room, and it's a wonderful way to feel connected to family.",
        "Now, to make this work well, there are two things you need. First, your phone needs a front-facing camera, which all modern smartphones have. Second — and this is very important — it's best to be connected to **Wi-Fi**. Think of it this way: a regular phone call is like a small car on the internet highway. A video call is like a big truck — it uses a lot more 'fuel,' or 'data.' By connecting to the free Wi-Fi in your home, you're using the 'free highway' instead of your phone's expensive 'gasoline.'",
      ],
    },
    {
      timing: "Approx. 10–13 minutes",
      slideLabel: "SLIDE 5: THE MAIN VIDEO CALL APPS",
      paragraphs: [
        "There are many different apps, or 'brands of cars,' for video calling. The two you'll hear about most are FaceTime and Google Meet.",
        "**FaceTime** is Apple's own video calling app. It's incredibly easy to use, but it has one big rule: it only works between two Apple devices. If you have an iPhone and your grandchild has an iPhone, it's perfect.",
        "But what if you have an iPhone and they have a Samsung or other Android phone? That's where an app like **Google Meet** comes in. It's an app that anyone can install, no matter what kind of phone they have, so it works for everybody. For today, we'll focus on the steps that are similar for all these apps.",
      ],
    },
    {
      timing: "Approx. 13–20 minutes",
      slideLabel: "SLIDE 6 & 7: MAKING & ANSWERING A VIDEO CALL",
      paragraphs: [
        "So, how do you start a video call? You don't even need to find the app! The easiest way is right from your address book. Let's all open our 'Contacts' app.",
        "(Wait for students to open Contacts).",
        "Now, find a contact for a friend or family member. When you look at their details, next to their phone number or email, you will often see two icons: one for a regular call (a phone), and one for a video call (a video camera). If you want to video call them, you just tap that little **video camera icon**. It's that simple! Your phone will handle the rest.",
        "Now, what if someone calls you? It will look almost exactly like a regular phone call. Your phone will ring, and the screen will light up. You'll see the name of the person calling, and you'll see a green button and a red button. Just like a regular call, you **swipe the green button to answer** and see their smiling face!",
      ],
    },
    {
      timing: "Approx. 20–25 minutes",
      slideLabel: "SLIDE 8: CONTROLS DURING YOUR CALL",
      paragraphs: [
        "Once you're in a call, you have a few simple controls. You might have to tap your screen once to make them appear. The two most useful buttons are 'Mute' and 'Stop Camera.'",
        "The **Mute button**, which looks like a microphone, is your best friend if something noisy happens on your end. If the dog starts barking, or the doorbell rings, you can tap 'Mute' to turn off your sound so the other person doesn't hear it. Just tap it again to unmute yourself.",
        "The **'Stop Camera' button** does exactly what it says. If you need to sneeze, or take a bite of your lunch, you can tap this button to temporarily turn off your video. The other person will still be able to hear you, but they won't see you. Tap it again to turn your video back on.",
      ],
    },
    {
      timing: "Approx. 25–30 minutes",
      slideLabel: "SLIDE 9: NETIQUETTE — TIPS FOR A GREAT CALL",
      paragraphs: [
        "Finally, a few simple tips to make your video calls great. We call this 'Netiquette,' or etiquette for the internet.",
        "First, try to **look at the little camera lens** on the front of your phone sometimes, not just at the person's face on your screen. This will make it feel like you are making eye contact with them.",
        "Second, make sure you have **good lighting on your face.** If the window is behind you, your face might be in shadow. Try to face a window or a lamp so they can see you clearly.",
        "And last, a fun one: **be aware of your background!** Before you make a call, just take a quick look at what's behind you. You might not want to show the other person a big pile of laundry!",
      ],
    },
    {
      timing: "Approx. 30–35 minutes",
      slideLabel: "SLIDE 10: YOU DID IT!",
      paragraphs: [
        "And that is everything you need to know to get started. You know what video calling is, how to start a call right from your contacts list, how to answer a call, and you even have tips on how to be a video calling pro! You are ready to see those smiles. Great job today.",
      ],
    },
    {
      timing: "Approx. 35–60 minutes",
      slideLabel: "SLIDE 11: GAME TIME!",
      paragraphs: [
        "Alright, to finish up, let's have some fun and review what we've learned about video calling. It's time for our game!",
        "(Lead the students in the 25-minute review game.)",
      ],
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Page title */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#000000",
            margin: "0 0 4px 0",
          }}
        >
          See Them Smile: An Introduction to Video Calling
        </h1>
        <p style={{ fontSize: 16, color: "#666666", margin: "0 0 12px 0" }}>
          Teacher&apos;s Script
        </p>
        <div style={{ borderBottom: "1px solid #DDDDDD", marginBottom: 24 }} />

        {/* Class Goals */}
        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              fontSize: 17,
              fontWeight: "bold",
              color: "#000000",
              margin: "0 0 8px 0",
            }}
          >
            Class Goals:
          </p>
          <ul
            style={{
              fontSize: 17,
              color: "#000000",
              lineHeight: 1.7,
              paddingLeft: 24,
              margin: 0,
            }}
          >
            <li>To demystify video calling and build excitement for its use.</li>
            <li>
              To teach the practical steps for making and answering a video call.
            </li>
            <li>
              To provide simple tips (&quot;Netiquette&quot;) that build confidence for being on
              camera.
            </li>
          </ul>
        </div>

        {/* Teacher's Note */}
        <div
          style={{
            backgroundColor: "#F5F5F5",
            borderLeft: "3px solid #CCCCCC",
            padding: 12,
            marginBottom: 32,
            fontStyle: "italic",
            fontSize: 17,
            color: "#000000",
            lineHeight: 1.7,
          }}
        >
          <strong>Teacher&apos;s Note:</strong> Video calling can feel very personal and a little
          intimidating for new users. Your tone should be warm, encouraging, and
          focused on the emotional benefit: connecting with loved ones. Unlike
          other classes, a live practice call is difficult, so the focus is on
          knowing the <em>steps</em> and being confident in the process.
        </div>

        {/* Script sections */}
        {sections.map((section, i) => (
          <div key={i} style={{ marginTop: 32 }}>
            <p
              style={{
                fontSize: 13,
                color: "#888888",
                margin: "0 0 4px 0",
              }}
            >
              {section.timing}
            </p>
            <h2
              style={{
                fontSize: 19,
                fontWeight: "bold",
                color: "#000000",
                margin: "0 0 8px 0",
              }}
            >
              [{section.slideLabel}]
            </h2>
            <div
              style={{ borderBottom: "1px solid #EEEEEE", marginBottom: 12 }}
            />
            {section.paragraphs.map((para, j) => {
              const isStageDirection =
                para.startsWith("(") && para.endsWith(")");
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p
                  key={j}
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: isStageDirection ? "#888888" : "#000000",
                    fontStyle: isStageDirection ? "italic" : "normal",
                    margin: "0 0 12px 0",
                  }}
                >
                  {parts.map((part, k) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <strong key={k}>{part.slice(2, -2)}</strong>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

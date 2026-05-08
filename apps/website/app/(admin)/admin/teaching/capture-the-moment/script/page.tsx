export default function CaptureTheMomentScript() {
  const sections = [
    {
      timing: "Approx. 0–3 minutes",
      slideLabel: "SLIDE 1: TITLE SLIDE",
      paragraphs: [
        "Good morning, everyone! It’s so wonderful to see you all. Today, we are going to explore one of the most magical features of your device: the camera.",
        "We’re going to learn how to capture beautiful memories, how to find them later, and—the best part—how to send them to your friends and family so they can share those moments with you. By the end of today, you’ll all be official smartphone photographers!",
      ],
    },
    {
      timing: "Approx. 3–5 minutes",
      slideLabel: "SLIDE 2: TODAY’S GOALS",
      paragraphs: [
        "Here is our plan for our photo adventure. We’ll start with the basics: how to open your camera and take a picture. I’m going to share a very simple secret for making your photos look much sharper and clearer.",
        "Then, we’ll learn where those photos go and how to look through them. We’ll look at two very easy ‘magic’ tricks to improve your photos after you’ve taken them. And finally, we’ll learn how to use the ‘Share’ button to send your masterpieces to the people you love. Let’s get started!",
      ],
    },
    {
      timing: "Approx. 5–8 minutes",
      slideLabel: "SLIDE 3: YOUR CAMERA IS AN APP!",
      paragraphs: [
        "First things first: where is the camera? Just like everything else on your device, your camera is an app. Look on your home screen for the icon that looks like a camera lens. Go ahead and tap it to open it.",
        "(Pause and walk around, ensuring everyone has their camera app open).",
        "Now you’re looking through your phone’s ‘eye.’ You should see whatever the phone is pointed at right now on your screen.",
      ],
    },
    {
      timing: "Approx. 8–12 minutes",
      slideLabel: "SLIDE 4: HOW TO TAKE A PICTURE",
      paragraphs: [
        "Taking the picture is the easiest part. You just point the phone at what you want to capture, and then you tap the big **shutter button** at the bottom of the screen. It’s usually a large white circle.",
        "Let’s all try it! Point your camera at something in the room—maybe a flower on the table or a neighbor’s smiling face—and give that big white button a gentle tap.",
        "(Wait for the sound of ‘clicks’ around the room).",
        "Great! You’ve just taken a photo. It’s that simple.",
      ],
    },
    {
      timing: "Approx. 12–17 minutes",
      slideLabel: "SLIDE 5: A QUICK TIP FOR A CLEAR PHOTO",
      paragraphs: [
        "Now, I want to share a pro secret with you. Sometimes your photos might look a little blurry or too dark. Here is how you fix that: **Tap to Focus.**",
        "Before you take the picture, I want you to tap your finger directly on the subject’s face or the object you are photographing on your screen. Do you see a little yellow or white square appear where you tapped?",
        "That square tells the camera: ‘Hey, this is the most important part of the picture! Make it sharp and make sure the light is perfect right here.’ It’s a tiny move that makes a huge difference. Try taking another photo now, but tap on your subject first.",
      ],
    },
    {
      timing: "Approx. 17–22 minutes",
      slideLabel: "SLIDE 6: FINDING YOUR PHOTO ALBUM",
      paragraphs: [
        "So, where did those photos go? They are automatically saved in your **‘Photos’** or **‘Gallery’** app.",
        "Let’s go find them. Press your home button or swipe up to go back to your main screen. Look for the colorful flower icon (on iPhone) or the colorful pinwheel icon (on Android). Tap it to open your digital photo album.",
        "(Wait for everyone to open their photo app).",
        "There they are! You should see the photos we just took at the very bottom of the list. You can tap on any photo to see it full-screen.",
      ],
    },
    {
      timing: "Approx. 22–27 minutes",
      slideLabel: "SLIDE 7 & 8: A TOUCH OF MAGIC (SIMPLE EDITS)",
      paragraphs: [
        "Now, let’s learn how to make a good photo even better. Open one of the photos you just took. Somewhere on the screen, you should see the word **‘Edit.’** Go ahead and tap it.",
        "(Walk around and assist).",
        "Don’t let all these new buttons scare you. We’re only going to focus on two today. First, look for the **Crop tool**, which looks like two overlapping right angles. This lets you straighten a crooked picture or trim away distracting things at the edge.",
        "Second, look for the **‘Auto-Enhance’** button—it often looks like a magic wand. If you tap that wand, your phone will use its ‘brain’ to automatically adjust the brightness and colors to make the photo pop. It’s like magic! If you like the change, just tap ‘Done’ or ‘Save.’",
      ],
    },
    {
      timing: "Approx. 27–32 minutes",
      slideLabel: "SLIDE 9 & 10: THE BEST PART: SHARING!",
      paragraphs: [
        "Now for the most rewarding part of photography: sharing your joy with others. To do this, we use the **Share icon**.",
        "On an iPhone, it’s a little square with an arrow pointing up. On an Android phone, it looks like three dots connected by lines. This icon is your gateway to the world!",
        "When you tap that Share icon while looking at a photo, a menu will pop up. It will ask you how you want to share. You can tap ‘Messages’ to text it to a grandchild, or ‘Mail’ to send it in an email. It’s the easiest way to stay connected. Let’s all try to find that share icon on our screen now.",
      ],
    },
    {
      timing: "Approx. 32–35 minutes",
      slideLabel: "SLIDE 11: YOU’RE A PHOTOGRAPHER!",
      paragraphs: [
        "Let’s look at what you can do now. You can open your camera, focus on your subject, and take a clear photo. You can find your pictures in your gallery, make them look even better with a ‘magic wand’ edit, and share them with the people you love.",
        "Your ‘homework’ this week is the best kind of homework: take photos! Take pictures of your lunch, your pets, or a sunset. The more you do it, the more natural it will feel. You all did a wonderful job today!",
      ],
    },
    {
      timing: "Approx. 35–60 minutes",
      slideLabel: "SLIDE 12: GAME TIME!",
      paragraphs: [
        "Alright, photographers! It’s time to put our knowledge to the test. Let’s get ready for our review game!",
        "(Lead the students in the 25-minute review game.)",
      ],
    },
  ];

  const goals = [
    "To teach students how to confidently use their device’s camera.",
    "To introduce basic photo viewing, simple editing, and sharing skills.",
    "To empower students to document and share their lives with loved ones.",
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
        <h1
          style={{ fontSize: 24, fontWeight: "bold", color: "#000000", margin: "0 0 4px 0" }}
        >
          Capture the Moment: Taking and Sharing Photos
        </h1>
        <p style={{ fontSize: 16, color: "#666666", margin: "0 0 12px 0" }}>
          Teacher’s Script
        </p>
        <div style={{ borderBottom: "1px solid #DDDDDD", marginBottom: 24 }} />

        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 17, fontWeight: "bold", color: "#000000", margin: "0 0 8px 0" }}>
            Class Goals:
          </p>
          <ul style={{ fontSize: 17, color: "#000000", lineHeight: 1.7, paddingLeft: 24, margin: 0 }}>
            {goals.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>

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
          <strong>Teacher’s Note:</strong> This is often the students’ favorite class!
          Photos are deeply personal and emotional. Encourage them to take a few photos of things
          in the room or of each other during the session. Your goal is to make the process feel
          light, creative, and successful. Have your own device ready to demonstrate the
          “tap to focus” and “share” features.
        </div>

        {sections.map((section, i) => (
          <div key={i} style={{ marginTop: 32 }}>
            <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>
              {section.timing}
            </p>
            <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000000", margin: "0 0 8px 0" }}>
              [{section.slideLabel}]
            </h2>
            <div style={{ borderBottom: "1px solid #EEEEEE", marginBottom: 12 }} />
            {section.paragraphs.map((para, j) => {
              const isStageDirection = para.startsWith("(") && para.endsWith(")");
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
                      return <strong key={k}>{part.slice(2, -2)}</strong>;
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

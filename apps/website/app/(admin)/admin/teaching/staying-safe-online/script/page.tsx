export default function StayingSafeOnlineScript() {
  const sections = [
    {
      timing: "Approx. 0–3 minutes",
      slideLabel: "SLIDE 1: TITLE SLIDE",
      paragraphs: [
        "Hello, everyone, and welcome back. In a previous class, we learned the basic 'rules of the road' for the internet. Today, we're going to learn how to be 'defensive drivers.' We're going to take a deeper dive into digital security, learning the advanced tips and tricks that will keep you in control and out of trouble online. This is the class where you learn to spot the scams before they even get close.",
      ],
    },
    {
      timing: "Approx. 3–5 minutes",
      slideLabel: "SLIDE 2 & 3: GOALS & REVIEW",
      paragraphs: [
        "Here's our plan. First, we'll do a very quick review of our three core safety rules that we always follow. Then, we're going to spend some quality time on passwords—how to create one that is strong but that you can actually remember.",
        "We'll look at new, more clever 'phishing' scams that go beyond just fake bank emails. And we'll talk about the risks of using public Wi-Fi and, finally, why those 'update' messages on your phone are so important.",
        "But first, let's recite our Core Safety Rules together. Number one: If it seems too good to be true, it is! Number two: Always look for the lock! And number three: Never click on strange pop-up windows. Excellent! That foundation is the key to everything else.",
      ],
    },
    {
      timing: "Approx. 5–13 minutes",
      slideLabel: "SLIDE 4 & 5: STRONG PASSWORDS & THE PASS-PHRASE",
      paragraphs: [
        "Let's talk about passwords. A password is the key to your digital house—your email, your banking, everything. You wouldn't use a flimsy, cheap key for your house, and you shouldn't use a weak password online. As you can see, 'password123' is a weak password. A strong password is long and a mix of characters.",
        "But who can remember something like `R7#t9&pL*`? Nobody! So I'm going to teach you the **'pass-phrase' method**. It is the best-kept secret to online security. Instead of a password, you create a pass *phrase*.",
        "Look at the slide. All you do is think of four simple, random words. It's easy for you to remember, but very hard for others to guess! Let's make one up together right now. Someone give me a random object in this room. (e.g., 'Chair'). Great. Someone give me a color. (e.g., 'Green'). Someone give me an animal. (e.g., 'Fish'). And a random number. (e.g., '50').",
        "Our new pass-phrase is `ChairGreenFish50`. Is that easy for us to remember? Yes! Is it hard for a computer to guess? Extremely! This is the method you should use from now on.",
      ],
    },
    {
      timing: "Approx. 13–20 minutes",
      slideLabel: "SLIDE 6 & 7: ADVANCED PHISHING & THE #1 RULE FOR LINKS",
      paragraphs: [
        "We already know to be suspicious of scary emails from our 'bank.' But the tricksters have gotten more clever. They know what we like to do online. They'll send fake notifications about a package delivery from FedEx or Amazon. Or they'll send a message that says a friend 'tagged you in a photo' to get you to click. They are all traps.",
        "This brings us to the new number one rule for handling these messages: **Don't trust the link, go direct.** What does that mean?",
        "If you get an email that says your FedEx package has a problem, do you click the link in the email? (Wait for 'No!' from class). That's right! You close the email, you open your web browser, and you type `fedex.com` yourself. If the notification is real, it will be waiting for you on the real website. This one simple habit—going direct to the source—will defeat almost every phishing scam.",
      ],
    },
    {
      timing: "Approx. 20–25 minutes",
      slideLabel: "SLIDE 8: THE DANGERS OF PUBLIC WI-FI",
      paragraphs: [
        "Everyone loves free Wi-Fi at the coffee shop or the airport, right? It's wonderful for browsing the news or checking the weather. But I want you to think of public Wi-Fi as a **public place.**",
        "It's like having a conversation in the middle of a crowded restaurant. It's fine for casual chit-chat, but you wouldn't start discussing your bank account number or your medical history out loud, would you? The same rule applies. Because that network is open and public, it's not private. Other people can potentially 'listen in.' So, it's safest to avoid doing any banking, shopping, or typing any passwords while on a free, public Wi-Fi network. Wait until you get home to your own private Wi-Fi.",
      ],
    },
    {
      timing: "Approx. 25–30 minutes",
      slideLabel: "SLIDE 9: THE IMPORTANCE OF UPDATES",
      paragraphs: [
        "Has anyone's phone ever popped up with a message that says 'Software Update Available'? It can be tempting to just hit 'Later.' But I want you to start thinking of those updates as a good thing.",
        "Think of your phone like a brand-new house. Sometimes, after you've moved in, the builder—like Apple or Google—realizes that one of the window locks is a bit faulty. A software update is them sending a repairman to your house, for free, to install a new, stronger lock.",
        "If you ignore the update, the faulty lock stays on your window. If you accept the update, you get a free security upgrade! These updates are designed to fix newly discovered problems and keep the tricksters out. They are your friend. It's always a good idea to install them.",
      ],
    },
    {
      timing: "Approx. 30–35 minutes",
      slideLabel: "SLIDE 10: YOU'RE A SECURITY EXPERT!",
      paragraphs: [
        "And that's it! Let's just take a moment to realize what we've learned today. You know how to create an incredibly strong but easy-to-remember pass-phrase. You know how to spot the new, clever phishing scams and the number one rule for defeating them. You know when it is and isn't safe to use public Wi-Fi. And you know that software updates are your friend. You are all officially security experts. You have the knowledge to stay in control and stay safe online.",
      ],
    },
    {
      timing: "Approx. 35–60 minutes",
      slideLabel: "SLIDE 11: GAME TIME!",
      paragraphs: [
        "Alright, you've learned the advanced techniques. Let's have some fun and put that new knowledge to the test. It's time for our game!",
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
          Staying Safe Online: Your Guide to Digital Security
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
            <li>To reinforce and deepen students&apos; understanding of core online safety rules.</li>
            <li>To teach practical skills for creating strong passwords and identifying sophisticated scams.</li>
            <li>To empower students to feel confident and skeptical, not fearful, when online.</li>
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
          <strong>Teacher&apos;s Note:</strong> This is a &quot;level-up&quot; class for safety. Your tone
          should be that of a trusted advisor sharing advanced, inside tips. Use the analogies
          heavily — they are the key to making these abstract concepts stick. The goal is for
          students to leave feeling smarter and more in control, not more scared.
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

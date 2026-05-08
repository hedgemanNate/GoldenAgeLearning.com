export default function YourDigitalWalletScript() {
  const sections = [
    {
      timing: "Approx. 0–3 minutes",
      slide: "SLIDE 1: TITLE SLIDE",
      paragraphs: [
        "Good morning, everyone! Today, we are going to learn how to make shopping easier, cleaner, and much more secure. We're going to explore the world of Digital Wallets.",
        "How many of you have ever had to dig through a heavy purse or a bulky wallet to find your credit card while a line of people waited behind you? (Allow for smiles and agreement). Today, we're going to learn how to pay for your groceries or your coffee with just a simple tap of your phone. It feels like the future, and it's wonderful!",
      ],
    },
    {
      timing: "Approx. 3–5 minutes",
      slide: "SLIDE 2: TODAY'S GOALS",
      paragraphs: [
        "Here is our plan for today. We'll start by talking about what a 'Digital Wallet' actually is. We'll meet the two most common apps—Apple Pay and Google Pay.",
        "I'll show you the 'Magic Move' for how to actually pay at the store. We'll spend some time talking about why this is one of the most secure ways to spend money ever invented. And finally, I'll show you how to keep your digital wallet safe and what to do if you ever lose your phone. Let's get started!",
      ],
    },
    {
      timing: "Approx. 5–8 minutes",
      slide: "SLIDE 3: YOUR PHYSICAL WALLET, REIMAGINED",
      paragraphs: [
        "A digital wallet is exactly what it sounds like. It's an app on your phone that holds a digital version of your credit and debit cards.",
        "Think of all those cards you carry around—your bank card, your favorite store card, maybe even your library card. Instead of carrying them all in a bulky physical wallet, you can store them securely inside your phone. You're not replacing your bank account; you're just giving your phone the power to use it safely.",
      ],
    },
    {
      timing: "Approx. 8–12 minutes",
      slide: "SLIDE 4 & 5: FINDING YOUR APP & THE SYMBOL",
      paragraphs: [
        "Let's find our wallet. If you have an iPhone, look for the 'Wallet' icon with the stack of colorful cards. If you have an Android, look for the 'Google Wallet' icon. Go ahead and find it on your home screen, but you don't have to open it yet.",
        "Now, how do you know if you can use it at a store? You look for the **'Tap to Pay' symbol**. It's on the screen right now—it looks like a sideways Wi-Fi signal or a little radio wave. Next time you're at Publix or CVS, look at the little machine where you usually slide your card. If you see that symbol, you can use your phone to pay!",
      ],
    },
    {
      timing: "Approx. 12–18 minutes",
      slide: 'SLIDE 6: THE "MAGIC MOVE" (HOW TO PAY)',
      paragraphs: [
        "So, how does it actually work? It's a three-step dance.",
        "**Step 1:** When the cashier tells you the total, you double-tap the button on the side of your phone.",
        "**Step 2:** The phone will check your face or your fingerprint to make sure it's really you.",
        "**Step 3:** You just hold the top of your phone near that 'wave' symbol on the card reader.",
        "You'll hear a little 'ping' and see a green checkmark on your screen. That's it! You're done. No digging for cards, no typing in a PIN on a dirty keypad.",
      ],
    },
    {
      timing: "Approx. 18–25 minutes",
      slide: "SLIDE 7 & 8: WHY IT'S MORE SECURE & NO PIN NEEDED",
      note: "Many seniors are very hesitant about mobile payments because of security concerns. Your most important job today is to explain why it is actually much safer than carrying a physical card. Focus on the 'one-time number' concept—it's the biggest 'Aha!' moment for safety.",
      paragraphs: [
        "Now, I know what some of you are thinking: 'Is it safe?' The answer is: **It is actually much safer than using a physical card.**",
        "When you slide your physical card at a store, the store sees your real name and your real account number. If their computer ever gets hacked, they have your information.",
        "But with a digital wallet, your phone **never tells the store your real card number.** Instead, it creates a one-time, temporary number for that one purchase. If a hacker stole that number five minutes later, it would be completely useless! It's like using a secret code that changes every time you spend money.",
        "And remember, you don't even have to touch the keypad to type a PIN. Your face or your fingerprint is your signature. It's faster, safer, and much cleaner!",
      ],
    },
    {
      timing: "Approx. 25–30 minutes",
      slide: "SLIDE 9 & 10: BUILT-IN SAFETY & WHERE TO USE IT",
      paragraphs: [
        "What if you lose your phone? In many ways, that's safer than losing your purse. If someone finds your purse, they have your cards and your ID. But if they find your phone, they can't open your wallet without your face or your fingerprint! Your money is locked behind a digital vault that only you can open.",
        "You can use this almost everywhere now. Grocery stores like Publix, pharmacies like Walgreens, and even most coffee shops and gas stations. It's becoming the standard way to pay.",
      ],
    },
    {
      timing: "Approx. 30–35 minutes",
      slide: "SLIDE 11: YOU'RE A DIGITAL SPENDER!",
      paragraphs: [
        "Look at everything you've learned! You know what a digital wallet is, you can spot the 'wave' symbol at the store, you know the 'Magic Move' to pay, and you understand why it's the most secure way to shop. You are now a master of modern commerce!",
        "Your 'homework' this week is very simple: next time you go to the store, just look for that 'wave' symbol on the payment machine. You don't have to use your phone yet if you're not ready, but just seeing how common it is will make you feel much more comfortable. Great job today!",
      ],
    },
    {
      timing: "Approx. 35–60 minutes",
      slide: "SLIDE 12: GAME TIME!",
      paragraphs: [
        "Alright, everyone! It's time to have some fun and review what we've learned about digital wallets. Let's get ready for our game!",
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
          Your Digital Wallet: An Introduction to Mobile Payments
        </h1>
        <p style={{ fontSize: 16, fontWeight: 400, color: "#666666", margin: "0 0 12px 0" }}>
          Teacher&rsquo;s Script
        </p>
        <div style={{ borderBottom: "1px solid #DDDDDD", marginBottom: 20 }} />

        {/* Class goals */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#000", margin: "0 0 6px 0", lineHeight: 1.7 }}>
            Class Goals:
          </p>
          <ul style={{ margin: "0 0 0 20px", padding: 0 }}>
            {[
              "To teach students the concept and benefits of using a digital wallet.",
              "To demonstrate the security advantages of mobile payments over physical cards.",
              'To build confidence in performing a "tap to pay" transaction.',
            ].map((goal) => (
              <li key={goal} style={{ fontSize: 17, color: "#000", lineHeight: 1.7 }}>
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* Teacher's note */}
        <div
          style={{
            backgroundColor: "#F5F5F5",
            borderLeft: "3px solid #CCCCCC",
            padding: 12,
            marginBottom: 28,
          }}
        >
          <p style={{ fontSize: 17, fontStyle: "italic", color: "#000", margin: 0, lineHeight: 1.7 }}>
            <strong>Teacher&rsquo;s Note:</strong> Many seniors are very hesitant about mobile payments because of security concerns. Your most important job today is to explain <em>why</em> it is actually much safer than carrying a physical card. Focus on the &ldquo;one-time number&rdquo; concept&mdash;it&rsquo;s the biggest &ldquo;Aha!&rdquo; moment for safety. Keep the demonstration light and easy.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.slide} style={{ marginTop: 32 }}>
            <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>
              {section.timing}
            </p>
            <h2
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: "#000",
                margin: "0 0 8px 0",
              }}
            >
              [{section.slide}]
            </h2>
            <div style={{ borderBottom: "1px solid #EEEEEE", marginBottom: 12 }} />

            {section.note && (
              <div
                style={{
                  backgroundColor: "#F5F5F5",
                  borderLeft: "3px solid #CCCCCC",
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <p style={{ fontSize: 17, fontStyle: "italic", color: "#000", margin: 0, lineHeight: 1.7 }}>
                  {section.note}
                </p>
              </div>
            )}

            {section.paragraphs.map((para, i) => {
              const isStageDirection = para.startsWith("(");
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p
                  key={i}
                  style={{
                    fontSize: 17,
                    color: isStageDirection ? "#888888" : "#000",
                    fontStyle: isStageDirection ? "italic" : "normal",
                    lineHeight: 1.7,
                    margin: "0 0 10px 0",
                  }}
                >
                  {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j}>{part.slice(2, -2)}</strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

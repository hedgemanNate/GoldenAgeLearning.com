export default function BrowsingQuizAnswers() {
  const answers: Array<{ q: string; correct: string; wrong: string[] }> = [
    {
      q: "A web browser is the app you use to travel the...",
      correct: "b) Internet",
      wrong: ["a) App Store", "c) Photo gallery"],
    },
    {
      q: "Blue, underlined text that you can tap to go to a new page is called a...",
      correct: "a) Link",
      wrong: ["b) Title", "c) Pop-up"],
    },
    {
      q: "What is the #1 Rule of Online Safety?",
      correct: "a) If it seems too good to be true, it probably is.",
      wrong: [
        "b) Click on every button to see what it does.",
        "c) Always share your password with friends.",
      ],
    },
    {
      q: "What icon should you always look for in the address bar before entering private information?",
      correct: "c) A padlock",
      wrong: ["a) A smiley face", "b) A red 'X'"],
    },
    {
      q: 'When a "pop-up" window appears with an amazing prize, what is the safest thing to do?',
      correct: "c) Look for the small 'X' in the corner to close the window.",
      wrong: ['a) Click the "Claim Prize" button.', "b) Fill out the form with your information."],
    },
    {
      q: 'If you get a scary, urgent email from your "bank," you should...',
      correct: "c) Stop, don't click, and call the bank using a number you trust.",
      wrong: [
        "a) Immediately click the link they provide.",
        "b) Reply with your account information.",
      ],
    },
  ];

  return (
    <div style={{
      maxWidth: 680,
      margin: "0 auto",
      padding: 20,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: 17,
      lineHeight: 1.7,
      backgroundColor: "#fff",
      color: "#000",
    }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", margin: "0 0 8px 0" }}>
        Class 4 Quiz: Answer Key
      </h1>
      <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "0 0 24px 0" }} />

      {answers.map((item, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <p style={{ fontWeight: "bold", margin: "0 0 4px 0", fontSize: 17 }}>
            {i + 1}. {item.q}
          </p>
          <p style={{ margin: "0 0 3px 20px", fontWeight: "bold", color: "#2E7D32", fontSize: 17 }}>
            ✓ {item.correct}
          </p>
          {item.wrong.map((w, wi) => (
            <p key={wi} style={{ margin: "0 0 1px 20px", color: "#999", fontSize: 17 }}>
              {w}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function TheWorldOfAppsAnswers() {
  const questions = [
    {
      number: 1,
      text: "The best way to think of an \"app\" is as a...",
      answer: "b) Tool in a toolbox",
      wrong: ["a) Phone call", "c) Password"],
    },
    {
      number: 2,
      text: "Where do you go to find and download new apps?",
      answer: "b) The App Store / Play Store",
      wrong: ["a) The Settings Menu", "c) The Camera"],
    },
    {
      number: 3,
      text: "Which icon do you usually tap to search for a new app?",
      answer: "a) A magnifying glass",
      wrong: ["b) A smiley face", "c) A trash can"],
    },
    {
      number: 4,
      text: "To move your apps around on the screen, you should first...",
      answer: "b) Press and hold the app icon until it wiggles",
      wrong: ["a) Tap the app icon once", "c) Shake the phone gently"],
    },
    {
      number: 5,
      text: "When you find an app you want in the store, you should tap the button that says...",
      answer: "b) \"GET\" or \"Install\"",
      wrong: ["a) \"Exit\"", "c) \"Open\""],
    },
    {
      number: 6,
      text: "Deleting an app usually involves making the icons wiggle and then tapping a small...",
      answer: "a) 'X' or '—' symbol",
      wrong: ["b) Thumbs-up icon", "c) 'OK' button"],
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
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000000",
            margin: "0 0 12px 0",
          }}
        >
          Class 3 Quiz: Answer Key
        </h1>
        <hr style={{ border: "none", borderTop: "1px solid #DDDDDD", margin: "0 0 24px 0" }} />

        {questions.map((q) => (
          <div key={q.number} style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                color: "#000000",
                margin: "0 0 4px 0",
                lineHeight: "1.7",
              }}
            >
              {q.number}. {q.text}
            </p>
            <p
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                color: "#2E7D32",
                margin: "0 0 2px 0",
                paddingLeft: "20px",
                lineHeight: "1.7",
              }}
            >
              {q.answer}
            </p>
            {q.wrong.map((w, i) => (
              <p
                key={i}
                style={{
                  fontSize: "17px",
                  fontWeight: "normal",
                  color: "#999999",
                  margin: "0",
                  paddingLeft: "20px",
                  lineHeight: "1.7",
                }}
              >
                {w}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

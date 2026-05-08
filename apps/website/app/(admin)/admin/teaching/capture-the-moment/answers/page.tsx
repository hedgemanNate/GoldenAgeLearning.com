export default function CaptureTheMomentAnswers() {
  const questions = [
    {
      number: 1,
      text: "To take a picture, you should tap the big _________ button on your screen.",
      correct: { letter: "b", text: "Shutter (White Circle)" },
      wrong: [
        { letter: "a", text: "Volume" },
        { letter: "c", text: "Power" },
      ],
    },
    {
      number: 2,
      text: 'What is the "Tap to Focus" trick used for?',
      correct: { letter: "c", text: "Making your subject sharp and clear" },
      wrong: [
        { letter: "a", text: "Making the photo brighter" },
        { letter: "b", text: "Deleting a bad photo" },
      ],
    },
    {
      number: 3,
      text: "Where are your photos automatically saved?",
      correct: { letter: "a", text: 'In the "Photos" or "Gallery" app' },
      wrong: [
        { letter: "b", text: "In the App Store" },
        { letter: "c", text: 'In the "Messages" app' },
      ],
    },
    {
      number: 4,
      text: 'The "Auto-Enhance" or "Magic Wand" tool is used to...',
      correct: { letter: "b", text: "Automatically improve the light and color of a photo" },
      wrong: [
        { letter: "a", text: "Send a photo to a friend" },
        { letter: "c", text: "Take a video" },
      ],
    },
    {
      number: 5,
      text: "Which icon do you tap to send a photo to someone else?",
      correct: { letter: "b", text: "The Share icon" },
      wrong: [
        { letter: "a", text: "The Trash Can icon" },
        { letter: "c", text: "The Settings icon" },
      ],
    },
    {
      number: 6,
      text: "If you want to trim away the edges of a photo, which tool should you use?",
      correct: { letter: "a", text: "Crop" },
      wrong: [
        { letter: "b", text: "Rotate" },
        { letter: "c", text: "Mute" },
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
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#000000",
            margin: "0 0 12px 0",
          }}
        >
          Class 10 Quiz: Answer Key
        </h1>
        <div style={{ borderBottom: "1px solid #DDDDDD", marginBottom: 28 }} />

        {questions.map((q) => {
          const allOptions = [q.correct, ...q.wrong].sort((a, b) =>
            a.letter.localeCompare(b.letter)
          );
          return (
            <div key={q.number} style={{ marginBottom: 28 }}>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "#000000",
                  margin: "0 0 8px 0",
                  lineHeight: 1.7,
                }}
              >
                {q.number}. {q.text}
              </p>
              {allOptions.map((opt) => {
                const isCorrect = opt.letter === q.correct.letter;
                return (
                  <p
                    key={opt.letter}
                    style={{
                      fontSize: 17,
                      fontWeight: isCorrect ? "bold" : "normal",
                      color: isCorrect ? "#2E7D32" : "#999999",
                      margin: "0 0 4px 16px",
                      lineHeight: 1.7,
                    }}
                  >
                    {opt.letter}) {opt.text}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

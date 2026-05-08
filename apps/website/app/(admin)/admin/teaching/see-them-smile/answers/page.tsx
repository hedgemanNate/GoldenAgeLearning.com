export default function SeeThemSmileAnswers() {
  const questions = [
    {
      number: 1,
      text: "For the best, smoothest video call, it is recommended that you connect your phone to...",
      correct: { letter: "b", text: "Wi-Fi" },
      wrong: [
        { letter: "a", text: "A power outlet" },
        { letter: "c", text: "Bluetooth" },
      ],
    },
    {
      number: 2,
      text: "The easiest way to start a video call is to find a person in your...",
      correct: { letter: "c", text: "Contacts app" },
      wrong: [
        { letter: "a", text: "Notes app" },
        { letter: "b", text: "Calendar app" },
      ],
    },
    {
      number: 3,
      text: "To start a video call with a contact, you should tap the icon that looks like a...",
      correct: { letter: "a", text: "Video camera" },
      wrong: [
        { letter: "b", text: "Telephone" },
        { letter: "c", text: "Microphone" },
      ],
    },
    {
      number: 4,
      text: 'During a call, if the dog starts barking, you can tap the "Mute" button to temporarily turn off your...',
      correct: { letter: "b", text: "Sound" },
      wrong: [
        { letter: "a", text: "Screen" },
        { letter: "c", text: "Camera" },
      ],
    },
    {
      number: 5,
      text: 'A good "netiquette" tip is to try to look at the __________ sometimes to make eye contact.',
      correct: { letter: "b", text: "Little camera on the front of your phone" },
      wrong: [
        { letter: "a", text: "Person's picture on the screen" },
        { letter: "c", text: "Mute button" },
      ],
    },
    {
      number: 6,
      text: 'The "FaceTime" app is mainly used for making video calls between...',
      correct: { letter: "a", text: "Two Apple devices" },
      wrong: [
        { letter: "b", text: "Two Android devices" },
        { letter: "c", text: "An Apple and an Android device" },
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
        {/* Title */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#000000",
            margin: "0 0 12px 0",
          }}
        >
          Class 8 Quiz: Answer Key
        </h1>
        <div
          style={{
            borderBottom: "1px solid #DDDDDD",
            marginBottom: 28,
          }}
        />

        {/* Questions */}
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

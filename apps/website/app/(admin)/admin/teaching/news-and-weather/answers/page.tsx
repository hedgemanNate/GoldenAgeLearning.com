export default function NewsAndWeatherAnswers() {
  const questions = [
    {
      number: 1,
      text: "Which forecast helps you plan your entire week?",
      correct: { letter: "b", text: "10-day forecast" },
      wrong: [
        { letter: "a", text: "Hourly forecast" },
        { letter: "c", text: "Past week forecast" },
      ],
    },
    {
      number: 2,
      text: "To see the weather for a city where your grandkids live, you should...",
      correct: { letter: "b", text: "Add their city to your Weather app list" },
      wrong: [
        { letter: "a", text: "Call them and ask" },
        { letter: "c", text: "Turn off your phone" },
      ],
    },
    {
      number: 3,
      text: "Where is the best place to find news sources you can trust?",
      correct: { letter: "b", text: "In your web browser or a built-in news app" },
      wrong: [
        { letter: "a", text: "On a strange pop-up window" },
        { letter: "c", text: "By clicking on scary links in emails" },
      ],
    },
    {
      number: 4,
      text: 'What is a "Push Notification" (Alert)?',
      correct: { letter: "b", text: "A way for an app to give you instant info or warnings" },
      wrong: [
        { letter: "a", text: "A bill from your phone company" },
        { letter: "c", text: "A new photo you just took" },
      ],
    },
    {
      number: 5,
      text: "If a news app is \"dinging\" too much with alerts, you can control them in your phone's...",
      correct: { letter: "a", text: "Settings" },
      wrong: [
        { letter: "b", text: "Photos" },
        { letter: "c", text: "Contacts" },
      ],
    },
    {
      number: 6,
      text: 'To search for a specific news topic (like "Florida Birds"), you should use the...',
      correct: { letter: "b", text: "Search bar" },
      wrong: [
        { letter: "a", text: "Volume button" },
        { letter: "c", text: "Charging port" },
      ],
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#000",
            margin: "0 0 8px 0",
          }}
        >
          Class 13 Quiz: Answer Key
        </h1>
        <hr style={{ border: "none", borderTop: "1px solid #DDDDDD", margin: "0 0 24px 0" }} />

        {questions.map((q) => {
          const allOptions = [q.correct, ...q.wrong].sort((a, b) =>
            a.letter.localeCompare(b.letter)
          );
          return (
            <div key={q.number} style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#000",
                  margin: "0 0 6px 0",
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
                      fontWeight: isCorrect ? 700 : 400,
                      color: isCorrect ? "#2E7D32" : "#999999",
                      margin: "0 0 2px 16px",
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

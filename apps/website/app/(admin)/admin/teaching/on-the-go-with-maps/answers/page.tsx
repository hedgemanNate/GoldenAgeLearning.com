export default function OnTheGoWithMapsAnswers() {
  const questions = [
    {
      number: 1,
      text: 'On a digital map, what does the glowing "Blue Dot" represent?',
      correct: { letter: "b", text: "Your current location" },
      wrong: [
        { letter: "a", text: "A police car" },
        { letter: "c", text: "A traffic light" },
      ],
    },
    {
      number: 2,
      text: "To find a place on the map, you should tap at the top of the screen in the...",
      correct: { letter: "b", text: "Search Bar" },
      wrong: [
        { letter: "a", text: "Clock" },
        { letter: "c", text: "Battery icon" },
      ],
    },
    {
      number: 3,
      text: "Which button should you tap to see the route and the time it will take to get somewhere?",
      correct: { letter: "c", text: "Directions" },
      wrong: [
        { letter: "a", text: "Delete" },
        { letter: "b", text: "Edit" },
      ],
    },
    {
      number: 4,
      text: "To have the phone start talking and giving you turn-by-turn guidance, tap the...",
      correct: { letter: "a", text: "Start button" },
      wrong: [
        { letter: "b", text: "Mute button" },
        { letter: "c", text: "Cancel button" },
      ],
    },
    {
      number: 5,
      text: "If you need to find a place to eat nearby, which category button should you tap?",
      correct: { letter: "c", text: "Restaurants" },
      wrong: [
        { letter: "a", text: "Gas" },
        { letter: "b", text: "Groceries" },
      ],
    },
    {
      number: 6,
      text: "Which feature lets you see a real 360-degree photograph of a street corner?",
      correct: { letter: "a", text: "Street View" },
      wrong: [
        { letter: "b", text: "Satellite View" },
        { letter: "c", text: "Print View" },
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
          Class 12 Quiz: Answer Key
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

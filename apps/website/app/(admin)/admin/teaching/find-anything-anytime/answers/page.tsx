export default function FindAnythingAnytimeAnswers() {
  const questions = [
    {
      number: 1,
      text: "A search engine like Google is most like a digital...",
      correct: { letter: "b", text: "Librarian" },
      wrong: [
        { letter: "a", text: "Post Office" },
        { letter: "c", text: "Calculator" },
      ],
    },
    {
      number: 2,
      text: "Where do you type your questions when you are on the Google website?",
      correct: { letter: "b", text: "In the search bar" },
      wrong: [
        { letter: "a", text: 'In the "Settings" menu' },
        { letter: "c", text: 'In the "Email" app' },
      ],
    },
    {
      number: 3,
      text: "When searching, it is usually best to use...",
      correct: { letter: "b", text: "Just a few simple keywords" },
      wrong: [
        { letter: "a", text: "Long, perfect sentences" },
        { letter: "c", text: "Only capital letters" },
      ],
    },
    {
      number: 4,
      text: "To search using your voice, you should tap the icon that looks like a...",
      correct: { letter: "b", text: "Microphone" },
      wrong: [
        { letter: "a", text: "Magnifying glass" },
        { letter: "c", text: "Star" },
      ],
    },
    {
      number: 5,
      text: 'If a search result has the word "Sponsored" next to it, it means it is a...',
      correct: { letter: "c", text: "Paid advertisement" },
      wrong: [
        { letter: "a", text: "Trusted medical site" },
        { letter: "b", text: "Helpful news story" },
      ],
    },
    {
      number: 6,
      text: "To visit a website from the Google results list, you should tap on its...",
      correct: { letter: "c", text: "Large Blue Title" },
      wrong: [
        { letter: "a", text: "Gray description text" },
        { letter: "b", text: "Small website address" },
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
          Class 11 Quiz: Answer Key
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

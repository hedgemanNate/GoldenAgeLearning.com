export default function MakingConnectionsQuizAnswers() {
  const answers: Array<{ q: string; correct: string; wrong: string[] }> = [
    {
      q: 'The "Contacts" app on your phone is like a...',
      correct: "b) Digital address book",
      wrong: ["a) Digital camera", "c) Digital map"],
    },
    {
      q: "To add a new contact, you should look for and tap the...",
      correct: "c) Plus sign (+)",
      wrong: ["a) Minus sign (-)", "b) Question mark (?)"],
    },
    {
      q: 'The "Favorites" list is a special, short list for...',
      correct: "a) People you call most often",
      wrong: [
        "b) All the contacts in your phone",
        "c) The last person who called you",
      ],
    },
    {
      q: "If you need to change a person's phone number, you should open their contact and tap...",
      correct: 'b) "Edit"',
      wrong: ['a) "Delete"', 'c) "Call"'],
    },
    {
      q: "When your phone rings, you usually swipe the GREEN button to...",
      correct: "a) Answer the call",
      wrong: ["b) Ignore the call", "c) Send a text message"],
    },
    {
      q: "Which tab in the Phone app shows you a list of the last people who called you or who you called?",
      correct: "c) Recents",
      wrong: ["a) Keypad", "b) Favorites"],
    },
  ];

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: 20,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 17,
        lineHeight: 1.7,
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: "bold", margin: "0 0 8px 0" }}>
        Class 5 Quiz: Answer Key
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

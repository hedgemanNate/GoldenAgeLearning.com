export default function TextingAndMessagingAnswers() {
  const questions = [
    {
      q: "A text message is best used for...",
      options: [
        { label: "a) Writing a long, detailed letter", correct: false },
        { label: "b) Short and quick conversations", correct: true },
        { label: "c) Storing your passwords", correct: false },
      ],
    },
    {
      q: "The icon to start a brand new conversation usually looks like a...",
      options: [
        { label: "a) Trash can", correct: false },
        { label: "b) Pencil on a square", correct: true },
        { label: "c) Star", correct: false },
      ],
    },
    {
      q: 'A "group chat" is a single conversation with...',
      options: [
        { label: "a) Just you and one other person", correct: false },
        { label: 'b) Only your "Favorite" contacts', correct: false },
        { label: "c) Multiple people at once", correct: true },
      ],
    },
    {
      q: "To send a photo you have already taken, you should tap the...",
      options: [
        { label: "a) Photo gallery icon", correct: true },
        { label: "b) Camera icon", correct: false },
        { label: "c) Paper airplane icon", correct: false },
      ],
    },
    {
      q: "You should NEVER send what kind of information in a text message?",
      options: [
        { label: "a) A joke or a fun fact", correct: false },
        { label: "b) Your dinner plans", correct: false },
        { label: "c) Your password or credit card number", correct: true },
      ],
    },
    {
      q: "Text message conversations are usually displayed on the screen as...",
      options: [
        { label: "a) A list of files", correct: false },
        { label: "b) Speech bubbles", correct: true },
        { label: "c) Formal letters", correct: false },
      ],
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#000", margin: "0 0 8px 0" }}>
          Class 7 Quiz: Answer Key
        </h1>
        <div style={{ borderBottom: "1px solid #DDDDDD", marginBottom: 24 }} />

        {questions.map((item, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 17, fontWeight: "bold", color: "#000", margin: "0 0 6px 0", lineHeight: 1.7 }}>
              {i + 1}. {item.q}
            </p>
            {item.options.map((opt, j) => (
              <p
                key={j}
                style={{
                  fontSize: 17,
                  color: opt.correct ? "#2E7D32" : "#999999",
                  fontWeight: opt.correct ? "bold" : "normal",
                  margin: "0 0 2px 16px",
                  lineHeight: 1.7,
                }}
              >
                {opt.label}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

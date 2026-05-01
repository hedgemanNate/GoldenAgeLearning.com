export default function MasterTheKeyboardAnswers() {
  const questions = [
    {
      number: 1,
      text: "Which key do you press to erase a mistake?",
      answer: "b) The Backspace Key",
    },
    {
      number: 2,
      text: "What is the long bar at the bottom of the keyboard used for?",
      answer: "a) Making spaces between words",
    },
    {
      number: 3,
      text: "If you want to type just ONE capital letter, you should:",
      answer: "c) Tap the Shift key once",
    },
    {
      number: 4,
      text: 'Where can you find numbers and symbols like the question mark (?)',
      answer: 'b) By tapping the "123" key',
    },
    {
      number: 5,
      text: "The little blinking line that shows where you will type next is called the:",
      answer: "c) The Cursor",
    },
    {
      number: 6,
      text: "The key with the smiley face on it takes you to the...",
      answer: "a) Emoji keyboard",
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
          Class 2 Quiz: Answer Key
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
                margin: "0",
                paddingLeft: "20px",
                lineHeight: "1.7",
              }}
            >
              {q.answer}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

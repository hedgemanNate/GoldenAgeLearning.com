export default function EmailEssentialsQuizAnswers() {
  const answers: Array<{ q: string; correct: string; wrong: string[] }> = [
    {
      q: "What does the word \"email\" stand for?",
      correct: "b) Electronic mail",
      wrong: ["a) Every mail", "c) Easy message"],
    },
    {
      q: "Which part of an email tells the reader what the message is about before they open it?",
      correct: "b) The Subject line",
      wrong: ["a) The 'To' field", "c) The email signature"],
    },
    {
      q: "You receive an email from a stranger asking for your password and bank account number. What should you do?",
      correct: "c) Delete it — it is likely a scam",
      wrong: [
        "a) Reply with the information they asked for",
        "b) Forward it to all your friends",
      ],
    },
    {
      q: "When you tap \"Reply,\" who receives your response?",
      correct: "b) Only the person who sent you the email",
      wrong: [
        "a) Everyone in your contacts list",
        "c) Your entire inbox",
      ],
    },
    {
      q: "When you delete an email, where does it go?",
      correct: "a) The Trash (or Deleted Items) folder",
      wrong: [
        "b) It disappears from your phone forever",
        "c) Your Drafts folder",
      ],
    },
    {
      q: "Which button actually sends your email after you have finished writing it?",
      correct: "c) The Send button — usually a paper airplane icon ✈️",
      wrong: [
        "a) The Save button",
        "b) The Draft button",
      ],
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
        Class 6 Quiz: Answer Key
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

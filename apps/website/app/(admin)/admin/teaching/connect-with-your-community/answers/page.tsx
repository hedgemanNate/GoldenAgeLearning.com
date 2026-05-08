export default function ConnectWithYourCommunityAnswers() {
  const questions = [
    {
      number: 1,
      text: "Social Media is most like a digital version of a\u2026",
      correct: "b) Town square or community center",
      wrong: ["a) Bank vault", "c) Remote control"],
    },
    {
      number: 2,
      text: "Which app is the most popular for seniors to see photos of family?",
      correct: "a) Facebook",
      wrong: ["b) Settings", "c) Calculator"],
    },
    {
      number: 3,
      text: "To see updates from your grandkids, you should first send them a\u2026",
      correct: "b) Friend Request",
      wrong: ["a) Bill", "c) Letter by mail"],
    },
    {
      number: 4,
      text: "Where can you go on Facebook to talk with people who share your hobbies?",
      correct: "a) Groups",
      wrong: ["b) The delete button", "c) The battery icon"],
    },
    {
      number: 5,
      text: 'The \u201cLike\u201d button (thumbs up) is used to\u2026',
      correct: "b) Show someone you enjoyed their post",
      wrong: ["a) Erase a photo", "c) Change your password"],
    },
    {
      number: 6,
      text: "To keep your life private, you should set your Facebook account to\u2026",
      correct: "b) Friends Only",
      wrong: ["a) Public (Everyone can see)", "c) Secret (No one can see)"],
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#000000",
            margin: "0 0 8px 0",
          }}
        >
          Class 16 Quiz: Answer Key
        </h1>
        <div
          style={{
            borderBottom: "1px solid #DDDDDD",
            marginBottom: 24,
            paddingBottom: 8,
          }}
        />

        {questions.map((q) => (
          <div key={q.number} style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#000000",
                margin: "0 0 6px 0",
                lineHeight: 1.7,
              }}
            >
              {q.number}. {q.text}
            </p>
            <p
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#2E7D32",
                margin: "0 0 4px 0",
                paddingLeft: 16,
                lineHeight: 1.7,
              }}
            >
              \u2713 {q.correct}
            </p>
            {q.wrong.map((opt) => (
              <p
                key={opt}
                style={{
                  fontSize: 17,
                  fontWeight: 400,
                  color: "#999999",
                  margin: "0 0 2px 0",
                  paddingLeft: 16,
                  lineHeight: 1.7,
                }}
              >
                {opt}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

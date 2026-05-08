export default function StayingSafeOnlineAnswers() {
  const questions = [
    {
      number: 1,
      text: 'What is the "pass-phrase" method used for?',
      correct: { letter: "a", text: "Creating a strong, easy-to-remember password" },
      wrong: [
        { letter: "b", text: "Sending a secret text message" },
        { letter: "c", text: "Naming a Wi-Fi network" },
      ],
    },
    {
      number: 2,
      text: "Phishing scams often try to make you feel...",
      correct: { letter: "b", text: "Scared and urgent" },
      wrong: [
        { letter: "a", text: "Calm and relaxed" },
        { letter: "c", text: "Happy and excited" },
      ],
    },
    {
      number: 3,
      text: "If you get a suspicious email from your bank, what is the SAFEST thing to do?",
      correct: { letter: "c", text: "Close the email and go directly to the bank's website yourself." },
      wrong: [
        { letter: "a", text: "Click the link in the email to see if it's real." },
        { letter: "b", text: "Reply with your account number." },
      ],
    },
    {
      number: 4,
      text: "You should avoid doing online banking or shopping when connected to...",
      correct: { letter: "c", text: "Free, public Wi-Fi at a coffee shop" },
      wrong: [
        { letter: "a", text: "Your private home Wi-Fi" },
        { letter: "b", text: "A friend's private Wi-Fi" },
      ],
    },
    {
      number: 5,
      text: 'When your phone asks you to "Update Software," it is offering you a...',
      correct: { letter: "a", text: "Free security upgrade" },
      wrong: [
        { letter: "b", text: "Computer virus" },
        { letter: "c", text: "Bill for a new service" },
      ],
    },
    {
      number: 6,
      text: "Before entering a password on a website, you should always look for the...",
      correct: { letter: "b", text: "Padlock icon" },
      wrong: [
        { letter: "a", text: '"Like" button' },
        { letter: "c", text: "Shopping cart icon" },
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
          Class 9 Quiz: Answer Key
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

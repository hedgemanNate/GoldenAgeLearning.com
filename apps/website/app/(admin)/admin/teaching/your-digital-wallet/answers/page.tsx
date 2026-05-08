export default function YourDigitalWalletAnswers() {
  const questions = [
    {
      number: 1,
      text: 'A "Digital Wallet" is an app on your phone that securely stores your...',
      correct: { letter: "b", text: "Credit and Debit cards" },
      wrong: [
        { letter: "a", text: "Photos" },
        { letter: "c", text: "Text messages" },
      ],
    },
    {
      number: 2,
      text: "Which symbol should you look for on a card reader to use mobile payments?",
      correct: { letter: "b", text: 'A "sideways Wi-Fi" wave symbol' },
      wrong: [
        { letter: "a", text: "A smiley face" },
        { letter: "c", text: "A red 'X'" },
      ],
    },
    {
      number: 3,
      text: "Before your phone will let you pay, it first checks your...",
      correct: { letter: "b", text: "Face (Face ID) or Fingerprint" },
      wrong: [
        { letter: "a", text: "Battery level" },
        { letter: "c", text: "Contacts list" },
      ],
    },
    {
      number: 4,
      text: "When you pay with your phone, the store...",
      correct: { letter: "a", text: "Never sees your real credit card number" },
      wrong: [
        { letter: "b", text: "Gets a copy of all your photos" },
        { letter: "c", text: "Sees your Social Security number" },
      ],
    },
    {
      number: 5,
      text: "One big advantage of mobile payments is that you don't have to...",
      correct: { letter: "b", text: "Touch the dirty keypad to type a PIN" },
      wrong: [
        { letter: "a", text: "Pay for your groceries" },
        { letter: "c", text: "Talk to the cashier" },
      ],
    },
    {
      number: 6,
      text: "If you lose your phone, your digital wallet is safe because it is locked by...",
      correct: { letter: "b", text: "Your face or fingerprint" },
      wrong: [
        { letter: "a", text: "A physical key" },
        { letter: "c", text: "A piece of tape" },
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
            fontWeight: 700,
            color: "#000",
            margin: "0 0 12px 0",
          }}
        >
          Class 14 Quiz: Answer Key
        </h1>
        <div
          style={{
            borderBottom: "1px solid #DDDDDD",
            marginBottom: 24,
          }}
        />

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

export default function EntertainmentEverywhereAnswers() {
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
            color: "#000000",
            margin: "0 0 12px 0",
          }}
        >
          Class 15 Quiz: Answer Key
        </h1>
        <hr style={{ border: "none", borderTop: "1px solid #DDDDDD", margin: "0 0 24px 0" }} />

        {[
          {
            q: '1. "Streaming" means you can watch or listen to something...',
            correct: "b) Instantly over the internet",
            wrong: ["a) In the bathtub", "c) Only while you are sleeping"],
          },
          {
            q: "2. Which app is the world's biggest library for videos?",
            correct: "a) YouTube",
            wrong: ["b) Contacts", "c) Settings"],
          },
          {
            q: "3. To find a specific song or video, you should look for the icon of a...",
            correct: "b) Magnifying glass (Search)",
            wrong: ["a) Trash can", "c) Battery"],
          },
          {
            q: '4. A "Podcast" is most like a digital version of a...',
            correct: "b) Radio talk show",
            wrong: ["a) Newspaper", "c) Photo album"],
          },
          {
            q: "5. Apps like Pandora and Spotify are used for listening to...",
            correct: "b) Music",
            wrong: ["a) The weather report", "c) Your voicemails"],
          },
          {
            q: "6. If you want to listen to a video or music without bothering others, you should use...",
            correct: "b) Headphones or earbuds",
            wrong: ["a) A louder volume", "c) A different room"],
          },
        ].map((item, idx) => (
          <div key={idx} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#000000", margin: "0 0 6px 0" }}>
              {item.q}
            </p>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#2E7D32", margin: "0 0 4px 0", paddingLeft: 16 }}>
              {item.correct}
            </p>
            {item.wrong.map((w, i) => (
              <p key={i} style={{ fontSize: 17, fontWeight: 400, color: "#999999", margin: "0 0 2px 0", paddingLeft: 16 }}>
                {w}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

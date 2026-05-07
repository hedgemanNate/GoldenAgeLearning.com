export default function GamePage() {
  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: 20,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: "#FFFFFF",
        color: "#000000",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0" }}>
        The World of Apps — Game
      </h1>
      <p style={{ fontSize: 16, color: "#666666", margin: "0 0 24px 0" }}>
        Class 3 Review Game
      </p>
      <hr
        style={{ border: "none", borderTop: "1px solid #DDDDDD", margin: 0 }}
      />
      <p
        style={{
          fontSize: 17,
          marginTop: 32,
          color: "#666666",
          fontStyle: "italic",
        }}
      >
        Game content coming soon. The session controller above will drive this
        page once the game is built.
      </p>
    </div>
  );
}

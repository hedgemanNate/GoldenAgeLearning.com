"use client";

// ─── Game Types ────────────────────────────────────────────────────────────────
// When a new game type is added, add it here.
const GAME_TYPES = [
  { id: "millionaire", name: "Who Wants to Be a Millionaire" },
];

// ─── Game Instance type (used once backend exists) ─────────────────────────────
interface GameInstance {
  id: string;
  name: string;
  className: string;
  gameType: string;
  timerSeconds: number;
  questionCount: number;
}

// Placeholder — replace with real Firebase data fetch once backend is built
const GAMES: GameInstance[] = [];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-[64px] gap-[12px]">
      <div className="w-[48px] h-[48px] rounded-full bg-[rgba(201,168,76,0.08)] flex items-center justify-center mb-[4px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[22px] h-[22px] text-[rgba(201,168,76,0.5)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-[14px] font-medium text-[rgba(245,237,214,0.55)]">No games yet</p>
      <p className="text-[12px] text-[rgba(245,237,214,0.3)] text-center max-w-[320px]">
        Create your first game to get started. Each game is linked to a class and uses questions you upload via CSV.
      </p>
    </div>
  );
}

export default function AdminTeachingGames() {
  return (
    <div className="p-[32px] font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-[28px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Games</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">
            Manage trivia games for your classes. Upload questions and run live games on the projector.
          </p>
        </div>
        <button
          disabled
          title="Coming soon — game creation will be available once the backend is connected"
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] opacity-40 cursor-not-allowed select-none"
        >
          + Create Game
        </button>
      </div>

      {/* Game instances table */}
      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden mb-[24px]">
        {GAMES.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full table-fixed text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(245,237,214,0.07)]">
                <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Game Name</th>
                <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Class</th>
                <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Game Type</th>
                <th className="w-[10ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Timer</th>
                <th className="w-[12ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Questions</th>
                <th className="w-[16ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {GAMES.map((game, i) => (
                <tr key={game.id} className={i < GAMES.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""}>
                  <td className="px-[16px] py-[13px] text-[var(--color-cream)] font-medium">{game.name}</td>
                  <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.7)]">{game.className}</td>
                  <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{game.gameType}</td>
                  <td className="w-[10ch] px-[8px] py-[13px] text-[rgba(245,237,214,0.6)]">{game.timerSeconds}s</td>
                  <td className="w-[12ch] px-[8px] py-[13px] text-[rgba(245,237,214,0.6)]">{game.questionCount}</td>
                  <td className="w-[16ch] px-[8px] py-[13px]">
                    <div className="flex items-center gap-[12px]">
                      <button className="text-[var(--color-gold)] text-[12px] font-medium hover:underline">Manage</button>
                      <button className="text-[var(--color-teal)] text-[12px] font-medium hover:underline">Upload Questions</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info card */}
      <div className="bg-[var(--color-dark-surface)] rounded-[10px] border border-[rgba(245,237,214,0.07)] px-[24px] py-[20px]">
        <h2 className="font-display text-[16px] font-bold text-[var(--color-cream)] mb-[12px]">About the Games Platform</h2>
        <div className="flex flex-col gap-[10px]">
          <InfoRow
            title="Who Wants to Be a Millionaire"
            description="A 15-question trivia game with a points ladder, lifelines, and live class participation. Questions are loaded via CSV and played on the projector with the instructor controlling from their phone."
          />
          <InfoRow
            title="How questions are loaded"
            description="Upload a CSV file to any game instance. The CSV must include: question, option_a, option_b, option_c, option_d, correct_answer, difficulty, and fifty_fifty_remove columns. The system validates every row before saving."
          />
          <InfoRow
            title="How scores are awarded"
            description="Points are added to enrolled students' accounts at the end of each game. Scores accumulate across games — correct answers, safe havens, and walk-away values all count toward class totals."
          />
          <InfoRow
            title="Game types available"
            description={`Currently available: ${GAME_TYPES.map((t) => t.name).join(", ")}. More game formats will be added to the platform in future updates.`}
          />
        </div>
      </div>

    </div>
  );
}

function InfoRow({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-[12px] py-[10px] border-b border-[rgba(245,237,214,0.05)] last:border-0 last:pb-0 first:pt-0">
      <div className="w-[6px] h-[6px] rounded-full bg-[var(--color-gold)] flex-shrink-0 mt-[6px]" />
      <div>
        <p className="text-[13px] font-semibold text-[var(--color-cream)] mb-[2px]">{title}</p>
        <p className="text-[12px] text-[rgba(245,237,214,0.5)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

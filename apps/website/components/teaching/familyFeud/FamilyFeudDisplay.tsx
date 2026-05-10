"use client";

// Projector / big-screen view for the Family Feud game.
// Renders directly from FamilyFeudGameState — no internal phase logic.
// All transitions are driven by the instructor remote via Firebase.
//
// Brand palette:
//   Background: #252D32
//   Gold/Orange: #EC8B24
//   Cream:       #FAF5C9
//   Muted cream: #C8C199
//   Card BG:     #1E272C
//   White:       #FFFFFF

import { useEffect, useRef, useState } from "react";
import type { FamilyFeudGameState, FamilyFeudMainQuestion } from "../../../types/game";
import { useFamilyFeudAudio } from "../../../lib/games/familyFeudAudio";
import { getAnswers, getPoints, getCurrentQuestion } from "../../../lib/games/familyFeud";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  state: FamilyFeudGameState;
  gameName: string;
  audioEnabled: boolean;
  /** Called when the starting fanfare ends — remote uses this to auto-advance. */
  onStartingComplete?: () => void;
  /** Called when fast-money-intro audio ends — remote auto-advances to player1. */
  onFastMoneyIntroComplete?: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FamilyFeudDisplay({
  state,
  gameName,
  audioEnabled,
  onStartingComplete,
  onFastMoneyIntroComplete,
}: Props) {
  useFamilyFeudAudio(state, audioEnabled, onStartingComplete, onFastMoneyIntroComplete);

  const phase = state.phase;

  if (phase === "idle") return <IdleScreen gameName={gameName} />;
  if (phase === "starting") return <StartingScreen />;

  if (
    phase === "face-off" ||
    phase === "face-off-buzz" ||
    phase === "face-off-correct" ||
    phase === "face-off-wrong"
  ) {
    return <FaceOffScreen state={state} />;
  }

  if (
    phase === "playing" ||
    phase === "answer-revealed" ||
    phase === "strike" ||
    phase === "three-strikes"
  ) {
    return <BoardScreen state={state} />;
  }

  if (phase === "round-over") return <RoundOverScreen state={state} />;
  if (phase === "round-transition") return <RoundTransitionScreen state={state} />;
  if (phase === "fast-money-intro") return <FastMoneyIntroScreen />;

  if (phase === "fast-money-player1") return <FastMoneyPlayerScreen state={state} player={1} />;
  if (phase === "fast-money-player1-done") return <FastMoneyPlayerDoneScreen player={1} />;
  if (phase === "fast-money-player2") return <FastMoneyPlayerScreen state={state} player={2} />;
  if (phase === "fast-money-player2-done") return <FastMoneyPlayerDoneScreen player={2} />;
  if (phase === "fast-money-reveal") return <FastMoneyRevealScreen state={state} />;
  if (phase === "fast-money-score") return <FastMoneyScoreScreen state={state} />;
  if (phase === "game-over") return <GameOverScreen state={state} />;

  return <IdleScreen gameName={gameName} />;
}

// ─── Shell ────────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundColor: "#252D32",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Lato', sans-serif",
      position: "relative",
    }}>
      {children}
    </div>
  );
}

// ─── Idle Screen ──────────────────────────────────────────────────────────────

function IdleScreen({ gameName }: { gameName: string }) {
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "2.5vh",
      }}>
        <h1 style={{
          fontFamily: "'Garamond', serif",
          fontSize: "4.5vw", fontWeight: "bold",
          color: "#FAF5C9", margin: 0, textAlign: "center",
        }}>
          Family Feud
        </h1>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "2vw", color: "#EC8B24", margin: 0,
        }}>
          {gameName}
        </p>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "1.5vw", color: "#C8C199", margin: 0, marginTop: "1vh",
        }}>
          Waiting to Start…
        </p>
      </div>
    </Shell>
  );
}

// ─── Starting Screen ──────────────────────────────────────────────────────────

function StartingScreen() {
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "2.5vh",
      }}>
        <h1 style={{
          fontFamily: "'Garamond', serif",
          fontSize: "5.5vw", fontWeight: "bold",
          color: "#EC8B24", margin: 0, textAlign: "center",
          textShadow: "0 0 40px rgba(236,139,36,0.4)",
        }}>
          Family Feud!
        </h1>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "2vw", color: "#FAF5C9", margin: 0,
        }}>
          Get Ready…
        </p>
      </div>
    </Shell>
  );
}

// ─── Face-Off Screen ──────────────────────────────────────────────────────────

function FaceOffScreen({ state }: { state: FamilyFeudGameState }) {
  const q = getCurrentQuestion(state);
  const answers = q ? getAnswers(q) : [];
  const pts = q ? getPoints(q) : [];

  const buzzer = state.faceOffBuzzedStudent;
  const phase = state.phase;
  const revealedAnswerIndices = state.revealedAnswerIndices ?? [];
  const revealedIdx = revealedAnswerIndices[0] ?? -1;

  return (
    <Shell>
      {/* Top banner */}
      <div style={{
        backgroundColor: "#EC8B24", height: "1.2vh", width: "100%", flexShrink: 0,
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.5vh 3vw", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.4vw", color: "#C8C199" }}>
          Round {state.currentRound} of 3
        </span>
        <span style={{
          fontFamily: "'Garamond', serif", fontSize: "1.8vw",
          fontWeight: "bold", color: "#EC8B24",
        }}>
          {phase === "face-off" ? "⚡ FACE-OFF" :
           phase === "face-off-buzz" ? `Student ${buzzer} — Answer?` :
           phase === "face-off-correct" ? "✓ On the Board!" :
           phase === "face-off-wrong" ? "✗ Not on the Board!" : ""}
        </span>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.4vw", color: "#C8C199" }}>
          Total: {state.gameTotal}
        </span>
      </div>

      {/* Question */}
      {q && (
        <div style={{
          textAlign: "center", padding: "1vh 8vw 2vh",
          fontFamily: "'Garamond', serif", fontSize: "2.8vw",
          fontWeight: "bold", color: "#FAF5C9",
        }}>
          {q.question_text}
        </div>
      )}

      {/* Answer board — all tiles shown with blanks until revealed */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: "0.8vh", padding: "0.5vh 6vw 2vh",
        justifyContent: "center",
      }}>
        {answers.map((ans, i) => {
          const isRevealed = phase === "face-off-correct" && revealedIdx === i;
          return (
            <AnswerTile
              key={i}
              index={i}
              text={isRevealed ? ans : ""}
              points={isRevealed ? pts[i] : null}
              revealed={isRevealed}
              strike={false}
            />
          );
        })}
      </div>
    </Shell>
  );
}

// ─── Board Screen ─────────────────────────────────────────────────────────────

function BoardScreen({ state }: { state: FamilyFeudGameState }) {
  const q = getCurrentQuestion(state);
  const answers = q ? getAnswers(q) : [];
  const pts = q ? getPoints(q) : [];
  const phase = state.phase;

  const revealedAnswerIndices = state.revealedAnswerIndices ?? [];
  const revealedSet = new Set(revealedAnswerIndices);
  const roundPoints = revealedAnswerIndices.reduce((sum, idx) => sum + (pts[idx] ?? 0), 0);

  return (
    <Shell>
      {/* Top bar */}
      <div style={{
        backgroundColor: "#EC8B24", height: "1.2vh", width: "100%", flexShrink: 0,
      }} />

      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2vh 3vw", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.4vw", color: "#C8C199" }}>
          Round {state.currentRound} of 3
        </span>
        <StrikeBar strikes={state.strikes} />
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.4vw", color: "#C8C199" }}>
          Game Total: {state.gameTotal}
        </span>
      </div>

      {/* Question */}
      {q && (
        <div style={{
          textAlign: "center", padding: "0.5vh 8vw 1.5vh",
          fontFamily: "'Garamond', serif", fontSize: "2.4vw",
          fontWeight: "bold", color: "#FAF5C9",
        }}>
          {q.question_text}
        </div>
      )}

      {/* Answer board */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: "0.7vh", padding: "0.5vh 6vw 0",
        justifyContent: "center",
      }}>
        {answers.map((ans, i) => (
          <AnswerTile
            key={i}
            index={i}
            text={revealedSet.has(i) ? ans : ""}
            points={revealedSet.has(i) ? pts[i] : null}
            revealed={revealedSet.has(i)}
            strike={false}
            flash={phase === "answer-revealed" && i === revealedAnswerIndices[revealedAnswerIndices.length - 1]}
          />
        ))}
      </div>

      {/* Strike + round total row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "4vw", padding: "1.5vh 3vw 2vh", flexShrink: 0,
      }}>
        {phase === "strike" && (
          <span style={{
            fontFamily: "'Lato', sans-serif", fontSize: "2vw",
            fontWeight: "bold", color: "#EC8B24",
            animation: "ff-shake 0.4s ease",
          }}>
            ✗ WRONG ANSWER
          </span>
        )}
        {phase === "three-strikes" && (
          <span style={{
            fontFamily: "'Lato', sans-serif", fontSize: "2vw",
            fontWeight: "bold", color: "#EC8B24",
          }}>
            ✗ ✗ ✗ THREE STRIKES!
          </span>
        )}
        <span style={{
          fontFamily: "'Lato', sans-serif", fontSize: "1.6vw", color: "#FAF5C9",
        }}>
          Round Total: <strong>{roundPoints}</strong>
        </span>
      </div>

      <style>{`
        @keyframes ff-shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </Shell>
  );
}

// ─── Round Over Screen ────────────────────────────────────────────────────────

function RoundOverScreen({ state }: { state: FamilyFeudGameState }) {
  const roundPoints = state.roundTotals[state.currentRound - 1];

  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "3vh",
      }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.6vw", color: "#C8C199", margin: 0 }}>
          Round {state.currentRound} Complete
        </p>
        <h2 style={{
          fontFamily: "'Garamond', serif", fontSize: "4vw", fontWeight: "bold",
          color: "#FAF5C9", margin: 0,
        }}>
          {roundPoints} Points!
        </h2>
        <div style={{
          backgroundColor: "#1E272C", border: "1px solid #EC8B24",
          borderRadius: "12px", padding: "2vh 4vw", textAlign: "center",
        }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.5vw", color: "#C8C199", margin: 0 }}>
            Game Total
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "2.5vw", fontWeight: "bold", color: "#EC8B24", margin: "0.5vh 0 0" }}>
            {state.gameTotal}
          </p>
        </div>
      </div>
    </Shell>
  );
}

// ─── Round Transition Screen ──────────────────────────────────────────────────

function RoundTransitionScreen({ state }: { state: FamilyFeudGameState }) {
  const nextRound = state.currentRound < 3 ? state.currentRound + 1 : null;

  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "2vh",
      }}>
        {nextRound ? (
          <>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.6vw", color: "#C8C199", margin: 0 }}>
              Coming Up…
            </p>
            <h2 style={{
              fontFamily: "'Garamond', serif", fontSize: "5vw", fontWeight: "bold",
              color: "#EC8B24", margin: 0,
            }}>
              Round {nextRound}
            </h2>
          </>
        ) : (
          <h2 style={{
            fontFamily: "'Garamond', serif", fontSize: "4.5vw", fontWeight: "bold",
            color: "#EC8B24", margin: 0,
          }}>
            Fast Money Round!
          </h2>
        )}
      </div>
    </Shell>
  );
}

// ─── Fast Money Intro Screen ──────────────────────────────────────────────────

function FastMoneyIntroScreen() {
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "2.5vh",
      }}>
        <h1 style={{
          fontFamily: "'Garamond', serif", fontSize: "6vw", fontWeight: "bold",
          color: "#EC8B24", margin: 0, textAlign: "center",
          textShadow: "0 0 40px rgba(236,139,36,0.5)",
        }}>
          Fast Money!
        </h1>
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: "1.8vw", color: "#FAF5C9", margin: 0,
        }}>
          Two players. Two chances. One big score.
        </p>
      </div>
    </Shell>
  );
}

// ─── Fast Money Player Screen ─────────────────────────────────────────────────

function FastMoneyPlayerScreen({ state, player }: { state: FamilyFeudGameState; player: 1 | 2 }) {
  const fm = state.fastMoneyState;
  const questions = state.fastMoneyQuestions;
  const [timeLeft, setTimeLeft] = useState<number>(
    fm?.timerEndsAt ? Math.max(0, Math.ceil((fm.timerEndsAt - Date.now()) / 1000)) : 0
  );

  useEffect(() => {
    if (!fm?.timerEndsAt) return;
    const interval = setInterval(() => {
      const secs = Math.max(0, Math.ceil((fm.timerEndsAt! - Date.now()) / 1000));
      setTimeLeft(secs);
      if (secs <= 0) clearInterval(interval);
    }, 250);
    return () => clearInterval(interval);
  }, [fm?.timerEndsAt]);

  const answers = player === 1 ? fm?.player1Answers : fm?.player2Answers;
  const timerLimit = player === 1 ? state.fastMoneyTimerPlayer1 : state.fastMoneyTimerPlayer2;
  const timerColor = timeLeft <= 5 ? "#EC8B24" : "#FAF5C9";

  return (
    <Shell>
      {/* Top bar */}
      <div style={{
        backgroundColor: "#EC8B24", height: "1.2vh", width: "100%", flexShrink: 0,
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.5vh 3vw", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Garamond', serif", fontSize: "2vw", fontWeight: "bold", color: "#FAF5C9" }}>
          Fast Money — Player {player}
        </span>
        {/* Large timer */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'Garamond', serif",
            fontSize: "4.5vw", fontWeight: "bold", color: timerColor,
            lineHeight: 1,
            transition: "color 0.3s",
          }}>
            {timeLeft}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "1vw", color: "#C8C199" }}>
            seconds
          </div>
        </div>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.4vw", color: "#C8C199" }}>
          Game Total: {state.gameTotal}
        </span>
      </div>

      {/* Questions + typed answers */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: "1.2vh", padding: "1vh 6vw 2vh", justifyContent: "center",
      }}>
        {questions.map((q, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "2vw",
            backgroundColor: "#1E272C", borderRadius: "8px",
            padding: "1.2vh 2vw", border: "1px solid rgba(236,139,36,0.3)",
          }}>
            <span style={{
              fontFamily: "'Lato', sans-serif", fontSize: "1.3vw",
              color: "#EC8B24", fontWeight: "bold", minWidth: "1.5vw", textAlign: "right",
            }}>
              {i + 1}.
            </span>
            <span style={{
              fontFamily: "'Lato', sans-serif", fontSize: "1.5vw", color: "#FAF5C9", flex: 1,
            }}>
              {q.question_text}
            </span>
            <span style={{
              fontFamily: "'Lato', sans-serif", fontSize: "1.6vw",
              color: answers?.[i] ? "#EC8B24" : "#4a555c",
              minWidth: "20vw", textAlign: "left",
              fontStyle: answers?.[i] ? "normal" : "italic",
            }}>
              {answers?.[i] || "—"}
            </span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ─── Fast Money Player Done Screen ────────────────────────────────────────────

function FastMoneyPlayerDoneScreen({ player }: { player: 1 | 2 }) {
  const nextPlayer = player === 1 ? 2 : null;
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "3vh",
      }}>
        <h2 style={{
          fontFamily: "'Lato', sans-serif", fontSize: "2.2vw", fontWeight: "bold",
          color: "#EC8B24", margin: 0,
        }}>
          ⏱ Time&apos;s Up — Player {player}!
        </h2>
        {nextPlayer ? (
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.8vw", color: "#FAF5C9", margin: 0 }}>
            Player 2, get ready…
          </p>
        ) : (
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.8vw", color: "#FAF5C9", margin: 0 }}>
            Preparing the reveal…
          </p>
        )}
      </div>
    </Shell>
  );
}

// ─── Fast Money Reveal Screen ─────────────────────────────────────────────────

function FastMoneyRevealScreen({ state }: { state: FamilyFeudGameState }) {
  const fm = state.fastMoneyState;
  const questions = state.fastMoneyQuestions;
  if (!fm) return null;

  const pts = (qi: number) => {
    const q = questions[qi];
    if (!q) return [];
    return getPoints(q);
  };

  function selectionPoints(sel: number | "not-on-board" | "duplicate" | null, qi: number): number {
    if (typeof sel !== "number") return 0;
    return pts(qi)[sel] ?? 0;
  }

  return (
    <Shell>
      {/* Top bar */}
      <div style={{
        backgroundColor: "#EC8B24", height: "1.2vh", width: "100%", flexShrink: 0,
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.5vh 3vw", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Garamond', serif", fontSize: "1.8vw", fontWeight: "bold", color: "#FAF5C9" }}>
          Fast Money — Reveal
        </span>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.5vw", color: "#EC8B24", fontWeight: "bold" }}>
          Fast Money Total: {fm.fastMoneyTotal}
        </span>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "1.4vw", color: "#C8C199" }}>
          Game Total: {state.gameTotal}
        </span>
      </div>

      {/* Reveal grid */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: "0.8vh", padding: "0.5vh 3vw 2vh",
      }}>
        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "0.4fr 2fr 1.2fr 1.2fr",
          gap: "1vw", padding: "0 0.5vw",
        }}>
          {["#", "Question", "Player 1", "Player 2"].map((h) => (
            <span key={h} style={{
              fontFamily: "'Lato', sans-serif", fontSize: "1.1vw",
              color: "#C8C199", fontWeight: "bold", textAlign: "center",
            }}>
              {h}
            </span>
          ))}
        </div>

        {questions.map((q, i) => {
          const revealed = fm.revealedQuestions[i];
          const p1sel = fm.player1Selections[i];
          const p2sel = fm.player2Selections[i];
          const isCurrent = fm.currentRevealQuestion === i;

          const p1ans = fm.player1Answers[i] || "—";
          const p2ans = fm.player2Answers[i] || "—";

          const p1pts = selectionPoints(p1sel, i);
          const p2pts = selectionPoints(p2sel as number | "not-on-board" | "duplicate" | null, i);

          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "0.4fr 2fr 1.2fr 1.2fr",
              gap: "1vw",
              backgroundColor: isCurrent ? "#1E272C" : "transparent",
              border: isCurrent ? "1px solid #EC8B24" : "1px solid transparent",
              borderRadius: "8px",
              padding: "1vh 0.5vw",
              transition: "background-color 0.3s",
            }}>
              {/* Number */}
              <span style={{
                fontFamily: "'Lato', sans-serif", fontSize: "1.4vw",
                color: "#EC8B24", fontWeight: "bold", textAlign: "center",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i + 1}
              </span>
              {/* Question */}
              <span style={{
                fontFamily: "'Lato', sans-serif", fontSize: "1.3vw", color: "#FAF5C9",
                display: "flex", alignItems: "center",
              }}>
                {q.question_text}
              </span>
              {/* Player 1 */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "0.3vh",
              }}>
                {revealed ? (
                  <>
                    <span style={{
                      fontFamily: "'Lato', sans-serif", fontSize: "1.3vw",
                      color: typeof p1sel === "number" ? "#EC8B24" : "#C8C199",
                    }}>
                      {p1ans}
                    </span>
                    <span style={{
                      fontFamily: "'Lato', sans-serif", fontSize: "1.1vw",
                      color: p1pts > 0 ? "#FAF5C9" : "#C8C199",
                      fontWeight: "bold",
                    }}>
                      {p1pts > 0 ? `+${p1pts}` : "0"}
                    </span>
                  </>
                ) : (
                  <span style={{ color: "#4a555c", fontSize: "1.3vw" }}>—</span>
                )}
              </div>
              {/* Player 2 */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "0.3vh",
              }}>
                {revealed ? (
                  <>
                    <span style={{
                      fontFamily: "'Lato', sans-serif", fontSize: "1.3vw",
                      color: typeof p2sel === "number" ? "#EC8B24" : "#C8C199",
                    }}>
                      {p2ans}
                      {p2sel === "duplicate" && " (dup.)"}
                    </span>
                    <span style={{
                      fontFamily: "'Lato', sans-serif", fontSize: "1.1vw",
                      color: p2pts > 0 ? "#FAF5C9" : "#C8C199",
                      fontWeight: "bold",
                    }}>
                      {p2pts > 0 ? `+${p2pts}` : "0"}
                    </span>
                  </>
                ) : (
                  <span style={{ color: "#4a555c", fontSize: "1.3vw" }}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

// ─── Fast Money Score Screen ──────────────────────────────────────────────────

function FastMoneyScoreScreen({ state }: { state: FamilyFeudGameState }) {
  const fm = state.fastMoneyState;
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "3vh",
      }}>
        <h2 style={{
          fontFamily: "'Garamond', serif", fontSize: "3.5vw", fontWeight: "bold",
          color: "#FAF5C9", margin: 0,
        }}>
          Fast Money Complete!
        </h2>
        <div style={{
          display: "flex", gap: "4vw", alignItems: "center", justifyContent: "center",
        }}>
          <ScoreCard label="Fast Money" value={fm?.fastMoneyTotal ?? 0} />
          <ScoreCard label="Final Total" value={state.gameTotal} highlight />
        </div>
      </div>
    </Shell>
  );
}

// ─── Game Over Screen ─────────────────────────────────────────────────────────

function GameOverScreen({ state }: { state: FamilyFeudGameState }) {
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "3vh",
      }}>
        <h1 style={{
          fontFamily: "'Garamond', serif", fontSize: "4.5vw", fontWeight: "bold",
          color: "#EC8B24", margin: 0, textAlign: "center",
        }}>
          🎉 Game Over! 🎉
        </h1>
        <div style={{
          display: "flex", gap: "4vw", alignItems: "center", justifyContent: "center",
        }}>
          {state.roundTotals.map((pts, i) => (
            <ScoreCard key={i} label={`Round ${i + 1}`} value={pts} />
          ))}
          {state.fastMoneyState && (
            <ScoreCard label="Fast Money" value={state.fastMoneyState.fastMoneyTotal} />
          )}
          <ScoreCard label="Final Score" value={state.gameTotal} highlight />
        </div>
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: "1.6vw", color: "#FAF5C9", margin: 0, marginTop: "1vh",
        }}>
          Points have been added to your accounts!
        </p>
      </div>
    </Shell>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function AnswerTile({
  index, text, points, revealed, strike, flash = false,
}: {
  index: number;
  text: string;
  points: number | null;
  revealed: boolean;
  strike: boolean;
  flash?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      backgroundColor: revealed ? "#1E272C" : "#1a2226",
      border: `1px solid ${revealed ? "#EC8B24" : "rgba(236,139,36,0.3)"}`,
      borderRadius: "8px",
      padding: "1.2vh 2.5vw",
      transition: "all 0.4s ease",
      outline: flash ? "2px solid #EC8B24" : "none",
      gap: "2vw",
    }}>
      {/* Rank number */}
      <span style={{
        fontFamily: "'Garamond', serif", fontSize: "1.5vw", fontWeight: "bold",
        color: "#EC8B24", minWidth: "1.8vw", textAlign: "center",
      }}>
        {index + 1}
      </span>
      {/* Answer text */}
      <span style={{
        flex: 1, fontFamily: "'Lato', sans-serif", fontSize: "1.8vw",
        color: revealed ? "#FAF5C9" : "#4a555c",
        fontStyle: revealed ? "normal" : "italic",
      }}>
        {text || ""}
      </span>
      {/* Points */}
      {revealed && points !== null && (
        <span style={{
          fontFamily: "'Garamond', serif", fontSize: "1.8vw", fontWeight: "bold",
          color: "#EC8B24", minWidth: "4vw", textAlign: "right",
        }}>
          {points}
        </span>
      )}
    </div>
  );
}

function StrikeBar({ strikes }: { strikes: number }) {
  return (
    <div style={{ display: "flex", gap: "0.8vw", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: "2.5vw", height: "2.5vw", borderRadius: "50%",
          backgroundColor: i < strikes ? "#EC8B24" : "#1E272C",
          border: "2px solid #EC8B24",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Lato', sans-serif", fontSize: "1.2vw",
          fontWeight: "bold", color: "#FFFFFF",
          transition: "background-color 0.3s",
        }}>
          {i < strikes ? "✗" : ""}
        </div>
      ))}
    </div>
  );
}

function ScoreCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div style={{
      backgroundColor: "#1E272C",
      border: `2px solid ${highlight ? "#EC8B24" : "rgba(236,139,36,0.4)"}`,
      borderRadius: "12px",
      padding: "2.5vh 3.5vw",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: "'Lato', sans-serif", fontSize: "1.3vw", color: "#C8C199", margin: 0,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: highlight ? "'Garamond', serif" : "'Lato', sans-serif",
        fontSize: highlight ? "3.5vw" : "2.5vw",
        fontWeight: "bold", color: highlight ? "#EC8B24" : "#FAF5C9",
        margin: "0.5vh 0 0",
      }}>
        {value}
      </p>
    </div>
  );
}

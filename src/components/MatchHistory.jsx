/* ============================================
   MatchHistory.jsx — Saved match results
   Displays past matches stored in localStorage
   ============================================ */

export default function MatchHistory({ history, onClear }) {
  return (
    <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in-up">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
        📋 Match History
      </h3>

      {history.length === 0 ? (
        <p className="text-center py-6 text-[var(--color-text-muted)] text-sm italic">
          No matches played yet. Complete a match to see results here.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {history.map((match) => (
              <div
                key={match.id}
                className="flex justify-between items-center p-3.5 bg-[var(--color-surface-dim)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-sm transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">
                    {match.teamA} vs {match.teamB}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {formatScore(match.firstInnings)} &nbsp;•&nbsp; {formatScore(match.secondInnings)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-[var(--color-accent-green)]/10 text-[var(--color-accent-green)] text-[11px] font-bold rounded-full">
                    {match.result}
                  </span>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{match.date}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            id="btn-clear-history"
            onClick={onClear}
            className="mt-3 w-full py-2.5 bg-transparent border-2 border-[var(--color-accent-red)]/30 text-[var(--color-accent-red)] text-xs font-semibold rounded-xl cursor-pointer hover:bg-[var(--color-accent-red)]/10 hover:border-[var(--color-accent-red)] transition-all duration-200"
          >
            🗑️ Clear All History
          </button>
        </>
      )}
    </div>
  );
}

/** Format innings score for display */
function formatScore(innings) {
  if (!innings) return '—';
  const overs = Math.floor(innings.balls / 6);
  const ballsInOver = innings.balls % 6;
  return `${innings.runs}/${innings.wickets} (${overs}.${ballsInOver})`;
}

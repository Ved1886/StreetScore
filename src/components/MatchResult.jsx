/* MatchResult.jsx — Final match result screen */

export default function MatchResult({ match, onNewMatch, onDashboard }) {
  const first = match.firstInningsData;
  const second = { team: match.innings === 2 ? (match.battingTeamKey === 'A' ? match.teamA : match.teamB) : '', runs: match.runs, wickets: match.wickets, balls: match.balls };

  const fmtOvers = (b) => `${Math.floor(b / 6)}.${b % 6}`;

  return (
    <div className="text-center py-10 animate-fade-in-up">
      <span className="text-6xl block mb-4">🏆</span>
      <h2 className="text-2xl font-black text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Match Over!
      </h2>
      <p className="text-base font-bold text-[var(--color-accent-green)] mb-6">{match.matchResult}</p>

      {/* Both innings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {first && (
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">1st Innings</p>
            <p className="text-sm font-bold text-[var(--color-primary)] mb-1">{first.team}</p>
            <p className="text-3xl font-black text-[var(--color-text)]">{first.runs}/{first.wickets}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">({fmtOvers(first.balls)} ov)</p>
          </div>
        )}
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">2nd Innings</p>
          <p className="text-sm font-bold text-[var(--color-accent-green)] mb-1">{second.team}</p>
          <p className="text-3xl font-black text-[var(--color-text)]">{second.runs}/{second.wickets}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">({fmtOvers(second.balls)} ov)</p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onDashboard} className="px-6 py-3 rounded-2xl text-sm font-bold border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] transition-all duration-200 cursor-pointer">
          🏠 Dashboard
        </button>
        <button onClick={onNewMatch} className="px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          🏏 New Match
        </button>
      </div>
    </div>
  );
}

/* MatchResult.jsx — Final match result screen */
import { useState } from 'react';
import ScorecardModal from './ScorecardModal';

export default function MatchResult({ match, onNewMatch, onDashboard }) {
  const [scorecardInnings, setScorecardInnings] = useState(null);

  const first = match.firstInningsData;
  const second = {
    team: match.innings === 2 ? (match.battingTeamKey === 'A' ? match.teamA : match.teamB) : '',
    runs: match.runs,
    wickets: match.wickets,
    balls: match.balls,
    batsmanStats: match.batsmanStats,
    bowlerStats: match.bowlerStats
  };

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
            <button
              onClick={() => setScorecardInnings(1)}
              className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold border-2 border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)] transition-all duration-200 cursor-pointer active:scale-95"
            >
              📋 Scorecard
            </button>
          </div>
        )}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">2nd Innings</p>
            <p className="text-sm font-bold text-[var(--color-accent-green)] mb-1">{second.team}</p>
            <p className="text-3xl font-black text-[var(--color-text)]">{second.runs}/{second.wickets}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">({fmtOvers(second.balls)} ov)</p>
          </div>
          <button
            onClick={() => setScorecardInnings(2)}
            className="w-full py-2.5 rounded-xl text-xs font-bold border-2 border-[var(--color-accent-green)]/30 text-[var(--color-accent-green)] hover:bg-[var(--color-accent-green)]/10 hover:border-[var(--color-accent-green)] transition-all duration-200 cursor-pointer active:scale-95"
          >
            📋 Scorecard
          </button>
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
      {scorecardInnings === 1 && first && (
        <ScorecardModal data={first} title="1st Innings Scorecard" onClose={() => setScorecardInnings(null)} />
      )}
      {scorecardInnings === 2 && (
        <ScorecardModal data={second} title="2nd Innings Scorecard" onClose={() => setScorecardInnings(null)} />
      )}
    </div>
  );
}

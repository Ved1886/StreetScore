import { useState } from 'react';

/* ============================================
   TeamRoster.jsx — Shows both team rosters
   during the match, with collapsible panels
   ============================================ */

export default function TeamRoster({ teamA, teamB, teamAPlayers, teamBPlayers, innings }) {
  const [expanded, setExpanded] = useState(false);

  // Batting team is first in innings 1, second in innings 2
  const battingName = innings === 1 ? teamA : teamB;
  const bowlingName = innings === 1 ? teamB : teamA;
  const battingPlayers = innings === 1 ? teamAPlayers : teamBPlayers;
  const bowlingPlayers = innings === 1 ? teamBPlayers : teamAPlayers;

  return (
    <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in-up">
      {/* Header — click to toggle */}
      <button
        id="btn-toggle-roster"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
          👥 Team Squads
        </h3>
        <span className={`text-xs text-[var(--color-text-muted)] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Summary (always visible) */}
      <div className="flex gap-3 mt-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15">
          <span className="text-sm">🏏</span>
          <span className="text-xs font-bold text-[var(--color-primary)] truncate">{battingName}</span>
          <span className="ml-auto text-[10px] font-semibold text-[var(--color-text-muted)]">{battingPlayers.length}p</span>
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-accent-green)]/8 border border-[var(--color-accent-green)]/15">
          <span className="text-sm">⚾</span>
          <span className="text-xs font-bold text-[var(--color-accent-green)] truncate">{bowlingName}</span>
          <span className="ml-auto text-[10px] font-semibold text-[var(--color-text-muted)]">{bowlingPlayers.length}p</span>
        </div>
      </div>

      {/* Expanded Player Lists */}
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 animate-fade-in-up">
          {/* Batting Team */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2 flex items-center gap-1">
              🏏 {battingName} <span className="text-[var(--color-text-muted)]">(Batting)</span>
            </p>
            <div className="space-y-1">
              {battingPlayers.map((player, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-dim)] border border-[var(--color-border)]"
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-[9px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text)]">{player}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bowling Team */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-green)] mb-2 flex items-center gap-1">
              ⚾ {bowlingName} <span className="text-[var(--color-text-muted)]">(Bowling)</span>
            </p>
            <div className="space-y-1">
              {bowlingPlayers.map((player, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-dim)] border border-[var(--color-border)]"
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-green-light)] flex items-center justify-center text-[9px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text)]">{player}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

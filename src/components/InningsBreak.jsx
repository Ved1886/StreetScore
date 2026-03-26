import { useState } from 'react';

/* InningsBreak.jsx — Shows 1st innings score, target, select 2nd innings openers */

export default function InningsBreak({ firstInningsData, battingTeam, bowlingTeam, battingPlayers, bowlingPlayers, onStart }) {
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');
  const target = firstInningsData.runs + 1;
  const fmtOvers = `${Math.floor(firstInningsData.balls / 6)}.${firstInningsData.balls % 6}`;
  const canStart = striker && nonStriker && bowler && striker !== nonStriker;

  return (
    <div className="animate-fade-in-up">
      {/* 1st Innings Summary */}
      <div className="glass-card rounded-3xl p-8 mb-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">1st Innings Complete</p>
        <p className="text-sm font-bold text-[var(--color-primary)] mb-2">{firstInningsData.team}</p>
        <p className="text-5xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent mb-2"
          style={{ fontFamily: 'var(--font-display)' }}>
          {firstInningsData.runs}/{firstInningsData.wickets}
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">in {fmtOvers} overs</p>
      </div>

      {/* Target */}
      <div className="glass-card rounded-2xl p-5 mb-4 text-center bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">🎯 Target</p>
        <p className="text-4xl font-black text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{target}</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">{battingTeam} needs {target} runs to win</p>
      </div>

      {/* 2nd Innings Openers */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">🏏 {battingTeam} — Opening Pair</h3>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)] mt-3 mb-2">Striker</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {battingPlayers.map(p => (
            <button key={p} onClick={() => setStriker(p)} disabled={p === nonStriker}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                striker === p ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-md'
                  : p === nonStriker ? 'opacity-40 cursor-not-allowed bg-[var(--color-surface-dim)] text-[var(--color-text-muted)]'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>{p}</button>
          ))}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent-green)] mb-2">Non-Striker</p>
        <div className="flex flex-wrap gap-2">
          {battingPlayers.map(p => (
            <button key={p} onClick={() => setNonStriker(p)} disabled={p === striker}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                nonStriker === p ? 'bg-gradient-to-r from-[var(--color-accent-green)] to-[var(--color-accent-green-light)] text-white shadow-md'
                  : p === striker ? 'opacity-40 cursor-not-allowed bg-[var(--color-surface-dim)] text-[var(--color-text-muted)]'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Bowler */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">⚾ {bowlingTeam} — Opening Bowler</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {bowlingPlayers.map(p => (
            <button key={p} onClick={() => setBowler(p)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                bowler === p ? 'bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-blue-light)] text-white shadow-md'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      <button onClick={() => onStart({ striker, nonStriker, bowler })} disabled={!canStart}
        className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 cursor-pointer ${
          canStart ? 'bg-gradient-to-r from-[var(--color-accent-green)] to-[var(--color-accent-green-light)] text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
            : 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] border-2 border-[var(--color-border)] cursor-not-allowed'
        }`}>
        {canStart ? '🏏 Start 2nd Innings' : 'Select all players to continue'}
      </button>
    </div>
  );
}

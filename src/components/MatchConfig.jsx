import { useState } from 'react';

/* MatchConfig.jsx — Select overs, batting order, opening players */

const OVER_OPTIONS = [1, 2, 3, 5, 10, 15, 20];

export default function MatchConfig({ teamA, teamB, teamAPlayers, teamBPlayers, onStart, onBack }) {
  const [totalOvers, setTotalOvers] = useState(20);
  const [customOvers, setCustomOvers] = useState('');
  const [battingFirst, setBattingFirst] = useState('A');
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');

  const battingTeam = battingFirst === 'A' ? teamA : teamB;
  const bowlingTeam = battingFirst === 'A' ? teamB : teamA;
  const battingPlayers = battingFirst === 'A' ? teamAPlayers : teamBPlayers;
  const bowlingPlayers = battingFirst === 'A' ? teamBPlayers : teamAPlayers;
  const overs = customOvers ? parseInt(customOvers) : totalOvers;
  const canStart = overs > 0 && striker && nonStriker && bowler && striker !== nonStriker;

  const handleStart = () => {
    if (!canStart) return;
    onStart({ totalOvers: overs, battingFirst, striker, nonStriker, bowler });
  };

  return (
    <div className="animate-fade-in-up">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-4 cursor-pointer transition-colors">
        ← Back to Teams
      </button>

      <h2 className="text-xl font-black text-[var(--color-text)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
        ⚙️ Match Setup
      </h2>

      {/* Overs Selection */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">🔢 Total Overs</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {OVER_OPTIONS.map(o => (
            <button key={o} onClick={() => { setTotalOvers(o); setCustomOvers(''); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                !customOvers && totalOvers === o
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-md'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>
              {o}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-[var(--color-text-muted)]">Custom:</span>
          <input type="number" min="1" max="50" value={customOvers} onChange={e => setCustomOvers(e.target.value)}
            placeholder="e.g. 8" className="w-20 bg-[var(--color-surface-dim)] border-2 border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--color-text)] focus:border-[var(--color-primary)] transition-all" />
        </div>
      </div>

      {/* Batting First */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">🏏 Who Bats First?</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['A', teamA], ['B', teamB]].map(([key, name]) => (
            <button key={key} onClick={() => { setBattingFirst(key); setStriker(''); setNonStriker(''); setBowler(''); }}
              className={`py-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                battingFirst === key
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-md scale-[1.02]'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>
              {name || key}
            </button>
          ))}
        </div>
      </div>

      {/* Opening Batsmen */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">🏏 Opening Batsmen</h3>
        <p className="text-[10px] text-[var(--color-text-muted)] mb-3">from {battingTeam}</p>

        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-2">Striker</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {battingPlayers.map(p => (
            <button key={p} onClick={() => setStriker(p)} disabled={p === nonStriker}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                striker === p ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-md'
                  : p === nonStriker ? 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] opacity-40 cursor-not-allowed'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>
              {p}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent-green)] mb-2">Non-Striker</p>
        <div className="flex flex-wrap gap-2">
          {battingPlayers.map(p => (
            <button key={p} onClick={() => setNonStriker(p)} disabled={p === striker}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                nonStriker === p ? 'bg-gradient-to-r from-[var(--color-accent-green)] to-[var(--color-accent-green-light)] text-white shadow-md'
                  : p === striker ? 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] opacity-40 cursor-not-allowed'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Opening Bowler */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">⚾ Opening Bowler</h3>
        <p className="text-[10px] text-[var(--color-text-muted)] mb-3">from {bowlingTeam}</p>
        <div className="flex flex-wrap gap-2">
          {bowlingPlayers.map(p => (
            <button key={p} onClick={() => setBowler(p)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                bowler === p ? 'bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-blue-light)] text-white shadow-md'
                  : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button id="btn-start-match" onClick={handleStart} disabled={!canStart}
        className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 cursor-pointer mb-4 ${
          canStart ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]'
            : 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] border-2 border-[var(--color-border)] cursor-not-allowed'
        }`}>
        {canStart ? '🏏 Start Match!' : 'Select all players to continue'}
      </button>
    </div>
  );
}

/* ScoreBoard.jsx — Score display with batsman/bowler info */

export default function ScoreBoard({
  battingTeam, runs, wickets, balls, oversDisplay, runRate, extras,
  innings, scoreAnimating, firstInningsScore, target, runsNeeded, requiredRR,
  striker, nonStriker, currentBowler, batsmanStats, bowlerStats, totalOvers,
  maxWickets = 10,
}) {
  const strikerStats = batsmanStats?.[striker];
  const nonStrikerStats = batsmanStats?.[nonStriker];
  const bowlerStat = bowlerStats?.[currentBowler];
  const fmtBowlerOvers = bowlerStat ? `${Math.floor(bowlerStat.ballsBowled / 6)}.${bowlerStat.ballsBowled % 6}` : '0.0';

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 mb-4 text-center animate-fade-in-up relative overflow-hidden">
      {/* Innings Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
        {innings === 1 ? '1st Innings' : '2nd Innings'}
        {totalOvers && <span className="text-[var(--color-text-muted)]">• {totalOvers} ov</span>}
      </div>

      <p className="text-sm font-bold text-[var(--color-primary)] mb-1">{battingTeam}</p>

      {/* Main Score */}
      <div className={`text-6xl sm:text-7xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent leading-none mb-3 ${scoreAnimating ? 'animate-score-pop' : ''}`}
        style={{ fontFamily: 'var(--font-display)' }} id="score-display">
        {runs}/{wickets}
      </div>

      <p className="text-lg font-semibold text-[var(--color-text-secondary)] mb-4">
        Overs: <span className="text-[var(--color-primary)] font-extrabold">{oversDisplay}</span>
        {totalOvers && <span className="text-[var(--color-text-muted)]"> / {totalOvers}</span>}
      </p>

      {/* Stats Row */}
      <div className="flex justify-center gap-6 sm:gap-10 flex-wrap mb-5">
        <Stat label="Run Rate" value={runRate} />
        <Stat label="Extras" value={extras} />
        <Stat label="Balls" value={balls} />
      </div>

      {/* Batsman Info */}
      {(striker || nonStriker) && (
        <div className="border-t border-[var(--color-border)] pt-4 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">🏏 Batting</p>
          <div className="grid grid-cols-2 gap-2">
            {striker && strikerStats && (
              <div className="bg-[var(--color-primary)]/8 rounded-xl px-3 py-2 text-left border border-[var(--color-primary)]/15">
                <p className="text-xs font-bold text-[var(--color-primary)] truncate">{striker} *</p>
                <p className="text-base font-black text-[var(--color-text)]">
                  {strikerStats.runs} <span className="text-[10px] font-normal text-[var(--color-text-muted)]">({strikerStats.balls})</span>
                </p>
                <p className="text-[9px] text-[var(--color-text-muted)]">{strikerStats.fours}×4 {strikerStats.sixes}×6</p>
              </div>
            )}
            {nonStriker && nonStrikerStats && (
              <div className="bg-[var(--color-surface-dim)] rounded-xl px-3 py-2 text-left border border-[var(--color-border)]">
                <p className="text-xs font-bold text-[var(--color-text-secondary)] truncate">{nonStriker}</p>
                <p className="text-base font-black text-[var(--color-text)]">
                  {nonStrikerStats.runs} <span className="text-[10px] font-normal text-[var(--color-text-muted)]">({nonStrikerStats.balls})</span>
                </p>
                <p className="text-[9px] text-[var(--color-text-muted)]">{nonStrikerStats.fours}×4 {nonStrikerStats.sixes}×6</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bowler Info */}
      {currentBowler && bowlerStat && (
        <div className="border-t border-[var(--color-border)] pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">⚾ Bowling</p>
          <div className="inline-flex items-center gap-3 bg-[var(--color-accent-blue)]/8 rounded-xl px-4 py-2 border border-[var(--color-accent-blue)]/15">
            <p className="text-xs font-bold text-[var(--color-accent-blue)]">{currentBowler}</p>
            <p className="text-sm font-black text-[var(--color-text)]">{fmtBowlerOvers}-{bowlerStat.runsConceded}-{bowlerStat.wickets}</p>
          </div>
        </div>
      )}

      {/* 2nd Innings Target */}
      {innings === 2 && firstInningsScore && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Target</p>
              <p className="text-xl font-extrabold text-[var(--color-primary)]">{target}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Need</p>
              <p className={`text-xl font-extrabold ${runsNeeded <= 0 ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`}>
                {runsNeeded > 0 ? runsNeeded : '✓'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Req RR</p>
              <p className="text-xl font-extrabold text-[var(--color-accent-yellow)]">{requiredRR}</p>
            </div>
          </div>
        </div>
      )}

      {wickets >= maxWickets && (
        <div className="mt-4 py-2 px-4 bg-[var(--color-accent-red)]/10 rounded-xl text-[var(--color-accent-red)] text-sm font-bold animate-badge-pop">
          ALL OUT! 🚨
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
      <span className="text-base font-bold text-[var(--color-text)]">{value}</span>
    </div>
  );
}

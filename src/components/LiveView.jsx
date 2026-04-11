import { useEffect, useState } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue } from 'firebase/database';
import BallTimeline from './BallTimeline';
import ScorecardModal from './ScorecardModal';

export default function LiveView({ matchCode }) {
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [scorecardInnings, setScorecardInnings] = useState(null);

  useEffect(() => {
    if (!matchCode) return;
    const matchRef = ref(rtdb, `liveMatches/${matchCode.toUpperCase()}`);
    const unsub = onValue(matchRef, (snap) => {
      if (snap.exists()) {
        setData(snap.val());
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    });
    return () => unsub();
  }, [matchCode]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">🏏</div>
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-2">Match Not Found</h2>
        <p className="text-[var(--color-text-muted)] text-sm">The match code <span className="font-bold text-[var(--color-primary)]">{matchCode}</span> doesn't exist or has ended.</p>
        <a href="/" className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-500 text-white font-bold text-sm shadow-lg">Open StreetScore</a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--color-text-muted)] font-semibold text-sm">Connecting to live match...</p>
      </div>
    );
  }

  const {
    battingTeam, bowlingTeam, runs, wickets, balls, totalOvers, extras,
    innings, striker, nonStriker, currentBowler, batsmanStats, bowlerStats,
    ballLog, firstInningsData, matchResult
  } = data;

  const overs = Math.floor(balls / 6);
  const ballsInOver = balls % 6;
  const oversDisplay = `${overs}.${ballsInOver}`;
  const totalOversNum = overs + ballsInOver / 6;
  const runRate = totalOversNum > 0 ? (runs / totalOversNum).toFixed(2) : '0.00';
  const target = firstInningsData ? firstInningsData.runs + 1 : null;
  const runsNeeded = target ? target - runs : null;
  let requiredRR = null;
  if (innings === 2 && firstInningsData) {
    const ol = totalOvers - totalOversNum;
    requiredRR = ol > 0 && runsNeeded > 0 ? (runsNeeded / ol).toFixed(2) : '—';
  }

  const strikerStats = batsmanStats?.[striker];
  const nonStrikerStats = batsmanStats?.[nonStriker];
  const bowlerStat = bowlerStats?.[currentBowler];
  const fmtBowlerOvers = bowlerStat ? `${Math.floor(bowlerStat.ballsBowled / 6)}.${bowlerStat.ballsBowled % 6}` : '0.0';

  const currentInningsData = {
    team: battingTeam,
    runs,
    wickets,
    balls,
    batsmanStats,
    bowlerStats
  };

  return (
    <div className="min-h-screen pb-10 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 pt-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black bg-gradient-to-r from-[var(--color-primary)] to-indigo-500 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>StreetScore</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent-red)]/10 rounded-full border border-[var(--color-accent-red)]/20">
            <span className="w-2 h-2 bg-[var(--color-accent-red)] rounded-full animate-pulse" />
            <span className="text-xs font-bold text-[var(--color-accent-red)] uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Match Result Banner */}
        {matchResult && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/20 to-indigo-500/20 border border-[var(--color-primary)]/30 text-center">
            <p className="text-lg font-black text-[var(--color-text)]">🏆 {matchResult}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Match Completed</p>
          </div>
        )}

        {/* Score Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-4 text-center relative overflow-hidden">
          {/* Innings badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
            {innings === 1 ? '1st Innings' : '2nd Innings'}
            {totalOvers && <span className="text-[var(--color-text-muted)]">• {totalOvers} ov</span>}
          </div>

          <div className="flex items-center justify-between gap-2 mb-1 px-1">
            <p className="text-sm font-bold text-[var(--color-primary)] truncate">{battingTeam}</p>
            
            <div className="flex gap-1.5">
              {innings === 2 && firstInningsData && (
                <button
                  onClick={() => setScorecardInnings(1)}
                  className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-1.5 rounded-lg border-2 border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors active:scale-95 cursor-pointer"
                >
                  📋 1st Innings
                </button>
              )}
              <button
                onClick={() => setScorecardInnings(innings)}
                className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-1.5 rounded-lg border-2 border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors active:scale-95 cursor-pointer"
              >
                📋 {innings === 1 ? 'Scorecard' : '2nd Innings'}
              </button>
            </div>
          </div>

          <div className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent leading-none mb-3" style={{ fontFamily: 'var(--font-display)' }}>
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

          {/* 2nd innings target */}
          {innings === 2 && target && (
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
        </div>

        {/* Ball Timeline */}
        {ballLog && ballLog.length > 0 && <BallTimeline ballLog={ballLog} />}

        {/* Teams label */}
        <div className="text-center mt-4 text-xs text-[var(--color-text-muted)]">
          <span className="font-bold text-[var(--color-text-secondary)]">{battingTeam}</span>
          <span className="mx-2">vs</span>
          <span className="font-bold text-[var(--color-text-secondary)]">{bowlingTeam}</span>
        </div>

        <footer className="text-center py-6 text-[var(--color-text-muted)] text-xs">
          StreetScore © {new Date().getFullYear()} · Live View (Read Only)
        </footer>

        {/* Scorecard Modal */}
        {scorecardInnings === 1 && (
          <ScorecardModal data={innings === 1 ? currentInningsData : firstInningsData} title="1st Innings Scorecard" onClose={() => setScorecardInnings(null)} />
        )}
        {scorecardInnings === 2 && (
          <ScorecardModal data={currentInningsData} title="2nd Innings Scorecard" onClose={() => setScorecardInnings(null)} />
        )}
      </div>
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

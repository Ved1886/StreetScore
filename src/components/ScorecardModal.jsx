/* ============================================
   ScorecardModal.jsx — Full innings scorecard popup
   Shows batting + bowling tables like a real scorecard
   ============================================ */

export default function ScorecardModal({ data, title = "Scorecard", onClose }) {
  if (!data) return null;

  const { team, runs, wickets, balls, batsmanStats = {}, bowlerStats = {} } = data;
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const rr = balls > 0 ? ((runs / (balls / 6)).toFixed(2)) : '0.00';

  const batters = Object.entries(batsmanStats)
    .filter(([, s]) => s.balls > 0 || s.runs > 0)
    .sort((a, b) => b[1].runs - a[1].runs);

  const bowlers = Object.entries(bowlerStats)
    .filter(([, s]) => s.ballsBowled > 0)
    .sort((a, b) => b[1].ballsBowled - a[1].ballsBowled);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl animate-fade-in-up"
        style={{ background: 'var(--color-surface-card)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]"
          style={{ background: 'var(--color-surface-card)' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{title}</p>
            <p className="text-base font-black text-[var(--color-text)]">{team}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-[var(--color-primary)]">{runs}/{wickets}</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">({overs} Ov • RR {rr})</p>
          </div>
        </div>

        <div className="px-4 pb-6 pt-2">

          {/* ── Batting Table ── */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mt-4 mb-2">🏏 Batting</p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--color-surface-dim)' }}>
                  <th className="text-left py-2 px-3 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Batter</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">R</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">B</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">4s</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">6s</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">SR</th>
                </tr>
              </thead>
              <tbody>
                {batters.map(([name, s]) => {
                  const sr = s.balls > 0 ? ((s.runs / s.balls) * 100).toFixed(1) : '—';
                  return (
                    <tr key={name} className="border-t border-[var(--color-border)]/50 hover:bg-[var(--color-surface-dim)]/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[var(--color-text)]">{name}</span>
                        <span className={`block text-[9px] font-medium mt-0.5 ${s.isOut ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-accent-green)]'}`}>
                          {s.isOut ? '† out' : 'not out'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-[var(--color-text)] text-sm">{s.runs}</td>
                      <td className="py-2.5 px-2 text-right text-[var(--color-text-muted)]">{s.balls}</td>
                      <td className="py-2.5 px-2 text-right text-[var(--color-text-muted)]">{s.fours}</td>
                      <td className="py-2.5 px-2 text-right text-[var(--color-text-muted)]">{s.sixes}</td>
                      <td className="py-2.5 px-2 text-right font-semibold text-[var(--color-primary)]">{sr}</td>
                    </tr>
                  );
                })}
                {batters.length === 0 && (
                  <tr><td colSpan={6} className="py-4 text-center text-[var(--color-text-muted)] italic">No batting data</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Bowling Table ── */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mt-5 mb-2">⚾ Bowling</p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--color-surface-dim)' }}>
                  <th className="text-left py-2 px-3 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Bowler</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">O</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">R</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">W</th>
                  <th className="text-right py-2 px-2 text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">ECO</th>
                </tr>
              </thead>
              <tbody>
                {bowlers.map(([name, s]) => {
                  const ovBowled = `${Math.floor(s.ballsBowled / 6)}.${s.ballsBowled % 6}`;
                  const eco = s.ballsBowled > 0 ? ((s.runsConceded / (s.ballsBowled / 6)).toFixed(1)) : '—';
                  return (
                    <tr key={name} className="border-t border-[var(--color-border)]/50 hover:bg-[var(--color-surface-dim)]/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[var(--color-text)]">{name}</td>
                      <td className="py-2.5 px-2 text-right text-[var(--color-text-muted)]">{ovBowled}</td>
                      <td className="py-2.5 px-2 text-right text-[var(--color-text-muted)]">{s.runsConceded}</td>
                      <td className="py-2.5 px-2 text-right font-black text-[var(--color-accent-red)]">{s.wickets}</td>
                      <td className="py-2.5 px-2 text-right font-semibold text-[var(--color-primary)]">{eco}</td>
                    </tr>
                  );
                })}
                {bowlers.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-[var(--color-text-muted)] italic">No bowling data</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-5 w-full py-3.5 rounded-2xl font-bold text-sm border-2 border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dim)] hover:text-[var(--color-text)] transition-all cursor-pointer"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}

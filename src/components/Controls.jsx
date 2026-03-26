/* ============================================
   Controls.jsx — Scoring & action buttons
   Large tap-friendly buttons with ripple effect
   ============================================ */

import { useRef, useCallback } from 'react';

/** Trigger a CSS ripple animation on a button */
function useRipple() {
  const btnRef = useRef(null);
  const trigger = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.classList.remove('ripple-active');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('ripple-active');
    setTimeout(() => el.classList.remove('ripple-active'), 500);
  }, []);
  return [btnRef, trigger];
}

/** Individual score button */
function ScoreButton({ label, subLabel, onClick, className, id }) {
  const [ref, ripple] = useRipple();
  return (
    <button
      ref={ref}
      id={id}
      onClick={() => { ripple(); onClick(); }}
      className={`btn-ripple relative flex flex-col items-center justify-center gap-1 py-4 sm:py-5 rounded-2xl font-bold text-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 select-none ${className}`}
    >
      {label}
      {subLabel && (
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
          {subLabel}
        </span>
      )}
    </button>
  );
}

export default function Controls({
  onAddRuns,
  onWicket,
  onWide,
  onNoBall,
  onUndo,
  onReset,
  onEndInnings,
  canUndo,
  allOut,
}) {
  // Scoring button styles
  const runStyle = 'bg-gradient-to-br from-[#e8e4ff] to-[#d4cfff] text-[#5b4fc7] border-2 border-[var(--color-primary)]/15 hover:shadow-[0_6px_20px_rgba(108,92,231,0.25)] dark:from-[#2a2560] dark:to-[#1e1a50] dark:text-[#c8c2ff] dark:border-[var(--color-primary-light)]/20';
  const fourStyle = 'bg-gradient-to-br from-[#55efc4] to-[#00b894] text-white border-2 border-transparent hover:shadow-[0_6px_20px_rgba(0,184,148,0.35)]';
  const sixStyle = 'bg-gradient-to-br from-[#ffeaa7] to-[#fdcb6e] text-[#6d5200] border-2 border-transparent hover:shadow-[0_6px_20px_rgba(253,203,110,0.4)]';
  const dotStyle = 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] border-2 border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:shadow-md';
  const wicketStyle = 'bg-gradient-to-br from-[#ff7675] to-[#e17055] text-white border-2 border-transparent hover:shadow-[0_6px_20px_rgba(225,112,85,0.35)]';
  const extrasStyle = 'bg-gradient-to-br from-[#74b9ff] to-[#0984e3] text-white border-2 border-transparent hover:shadow-[0_6px_20px_rgba(9,132,227,0.3)]';

  return (
    <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in-up">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
        ⚡ Scoring
      </h3>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-3">
        <ScoreButton id="btn-dot" label="0" subLabel="Dot" onClick={() => onAddRuns(0)} className={dotStyle} />
        <ScoreButton id="btn-1" label="+1" subLabel="Run" onClick={() => onAddRuns(1)} className={runStyle} />
        <ScoreButton id="btn-2" label="+2" subLabel="Runs" onClick={() => onAddRuns(2)} className={runStyle} />
        <ScoreButton id="btn-3" label="+3" subLabel="Runs" onClick={() => onAddRuns(3)} className={runStyle} />
        <ScoreButton id="btn-4" label="4" subLabel="Four" onClick={() => onAddRuns(4)} className={fourStyle} />
        <ScoreButton id="btn-6" label="6" subLabel="Six" onClick={() => onAddRuns(6)} className={sixStyle} />
        <ScoreButton id="btn-wicket" label="W" subLabel="Wicket" onClick={onWicket} className={wicketStyle} />
        <ScoreButton id="btn-wide" label="Wd" subLabel="Wide" onClick={onWide} className={extrasStyle} />
      </div>

      {/* No Ball — spans full width as a smaller row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
        <ScoreButton id="btn-noball" label="Nb" subLabel="No Ball" onClick={onNoBall} className={`${extrasStyle} !py-3`} />
        <div /> {/* spacer */}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          id="btn-undo"
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all duration-200 cursor-pointer ${
            canUndo
              ? 'border-[var(--color-accent-blue)]/30 text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/10 hover:border-[var(--color-accent-blue)] hover:-translate-y-0.5 hover:shadow-md active:scale-95'
              : 'border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed'
          }`}
        >
          ↩️ Undo
        </button>

        <button
          id="btn-reset"
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 border-[var(--color-accent-red)]/30 text-[var(--color-accent-red)] hover:bg-[var(--color-accent-red)]/10 hover:border-[var(--color-accent-red)] hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
        >
          🔄 Reset
        </button>

        <button
          id="btn-end-innings"
          onClick={onEndInnings}
          className="col-span-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 border-[var(--color-accent-yellow)]/30 text-[#b8860b] dark:text-[var(--color-accent-yellow)] hover:bg-[var(--color-accent-yellow)]/10 hover:border-[var(--color-accent-yellow)] hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
        >
          🏁 End Innings
        </button>
      </div>

      {/* All Out Warning */}
      {allOut && (
        <div className="mt-3 text-center text-[var(--color-accent-red)] text-xs font-semibold animate-badge-pop">
          All 10 wickets fallen — consider ending the innings
        </div>
      )}
    </div>
  );
}

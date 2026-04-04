/* ============================================
   Controls.jsx — Scoring & action buttons
   Large tap-friendly buttons with ripple effect
   ============================================ */

import { useRef, useCallback, useState } from 'react';

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
  onRotateStrike,
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
  const rotateStyle = 'bg-gradient-to-br from-[#a29bfe] to-[#6c5ce7] text-white border-2 border-transparent hover:shadow-[0_6px_20px_rgba(108,92,231,0.35)] dark:from-[#6c5ce7] dark:to-[#8c7ae6]';

  const [rotateMode, setRotateMode] = useState(false);

  if (rotateMode) {
    return (
      <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in-up border-2 border-[var(--color-primary)]">
        <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-primary)] mb-4 text-center drop-shadow-sm">
          Is this a valid ball?
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <ScoreButton
            id="btn-rotate-valid"
            label="Yes"
            subLabel="Valid Ball (+1)"
            onClick={() => { setRotateMode(false); onRotateStrike(true); }}
            className="bg-[var(--color-surface-card)] border-2 border-[#00b894]/50 text-[var(--color-text)] hover:bg-[#00b894]/10"
          />
          <ScoreButton
            id="btn-rotate-invalid"
            label="No"
            subLabel="Mistake (0)"
            onClick={() => { setRotateMode(false); onRotateStrike(false); }}
            className="bg-[var(--color-surface-card)] border-2 border-[#e17055]/50 text-[var(--color-text)] hover:bg-[#e17055]/10"
          />
        </div>
        <button
          onClick={() => setRotateMode(false)}
          className="w-full py-4 rounded-xl border-2 border-[var(--color-border)] text-sm font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dim)] hover:text-[var(--color-text)] transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in-up">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
        ⚡ Scoring
      </h3>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-4">
        <ScoreButton id="btn-dot" label="0" subLabel="Dot" onClick={() => onAddRuns(0)} className={dotStyle} />
        <ScoreButton id="btn-1" label="+1" subLabel="Run" onClick={() => onAddRuns(1)} className={runStyle} />
        <ScoreButton id="btn-2" label="+2" subLabel="Runs" onClick={() => onAddRuns(2)} className={runStyle} />
        <ScoreButton id="btn-3" label="+3" subLabel="Runs" onClick={() => onAddRuns(3)} className={runStyle} />
        <ScoreButton id="btn-4" label="4" subLabel="Four" onClick={() => onAddRuns(4)} className={fourStyle} />
        <ScoreButton id="btn-6" label="6" subLabel="Six" onClick={() => onAddRuns(6)} className={sixStyle} />
        <ScoreButton id="btn-wicket" label="W" subLabel="Wicket" onClick={onWicket} className={wicketStyle} />
        <ScoreButton id="btn-rotate" label="⇄" subLabel="Rotate" onClick={() => setRotateMode(true)} className={rotateStyle} />
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

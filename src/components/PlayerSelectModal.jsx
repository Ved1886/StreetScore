/* PlayerSelectModal.jsx — Reusable modal for selecting a player */

export default function PlayerSelectModal({ title, subtitle, players, onSelect, excludeNames = [] }) {
  const available = players.filter(p => !excludeNames.includes(p));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[998] animate-fade-in-up">
      <div className="glass-card rounded-3xl p-6 max-w-sm w-[92%] animate-slide-in">
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-1 text-center">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--color-text-muted)] text-center mb-4">{subtitle}</p>
        )}

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {available.length === 0 ? (
            <p className="text-center py-4 text-sm text-[var(--color-text-muted)] italic">No players available</p>
          ) : (
            available.map((player, i) => (
              <button
                key={player}
                onClick={() => onSelect(player)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-dim)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-200 cursor-pointer active:scale-[0.98] text-left"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text)]">{player}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

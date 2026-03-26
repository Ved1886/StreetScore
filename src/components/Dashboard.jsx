/* Dashboard.jsx — Landing page with "New Match" button */

export default function Dashboard({ onNewMatch, matchCount }) {
  return (
    <div className="text-center py-16 animate-fade-in-up">
      <span className="text-7xl block mb-5 animate-logo-bounce">🏏</span>
      <h1
        className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        StreetScore
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-10 max-w-xs mx-auto">
        Track every ball, run, and wicket in real-time while you play
      </p>

      <button
        id="btn-new-match"
        onClick={onNewMatch}
        className="px-10 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.97] transition-all duration-300 cursor-pointer mb-6"
      >
        🏏 Start New Match
      </button>

      {matchCount > 0 && (
        <p className="text-xs text-[var(--color-text-muted)]">
          {matchCount} match{matchCount !== 1 ? 'es' : ''} played so far
        </p>
      )}
    </div>
  );
}

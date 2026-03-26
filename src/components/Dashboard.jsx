/* Dashboard.jsx — Landing page with "New Match" button */

export default function Dashboard({ onNewMatch, onManageTeams, matchCount }) {
  return (
    <div className="relative text-center py-12 px-6 animate-fade-in-up flex flex-col items-center justify-center min-h-[60vh]">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--color-primary)]/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
      
      <div className="relative mb-6 w-32 h-32 mx-auto rounded-[32px] overflow-hidden shadow-2xl shadow-[var(--color-primary)]/40 border-2 border-white/10 animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
        <img 
          src="/logo.png" 
          alt="StreetScore Logo" 
          className="w-full h-full object-cover scale-125" 
        />
      </div>

      <div className="inline-block px-4 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-extrabold text-[10px] tracking-widest rounded-full mb-5 border border-[var(--color-primary)]/20 uppercase">
        Street / Box Cricket Scorer
      </div>

      <h1
        className="text-5xl sm:text-6xl font-black bg-gradient-to-br from-[var(--color-primary)] via-indigo-500 to-purple-400 bg-clip-text text-transparent mb-4 tracking-[-0.03em] drop-shadow-sm"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        StreetScore
      </h1>
      
      <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-10 max-w-sm mx-auto font-medium leading-relaxed">
        The ultimate real-time cricket scorer. Play anywhere, track every ball, and settle arguments like a pro.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs mb-8">
        <button
          onClick={() => onNewMatch('standard')}
          className="relative group px-12 py-4 rounded-[20px] text-lg font-black bg-gradient-to-r from-[var(--color-primary)] to-indigo-500 text-white shadow-xl shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/60 hover:-translate-y-1 active:scale-[0.97] transition-all overflow-hidden"
        >
          <div className="absolute inset-0 translate-x-[-150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
            🌍 Standard Match
          </span>
        </button>
        <button
          onClick={() => onNewMatch('street')}
          className="relative group px-12 py-3 rounded-[20px] text-lg font-black bg-[var(--color-surface-card)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] shadow-lg hover:-translate-y-1 active:scale-[0.97] transition-all"
        >
          <span className="relative z-10 flex flex-col items-center justify-center">
            <span className="flex items-center gap-2">🚀 Street Match</span>
            <span className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">No Wide/NB Extras</span>
          </span>
        </button>

        <button
          onClick={onManageTeams}
          className="relative group px-12 py-3 rounded-[20px] text-lg font-black bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-text)] shadow-sm hover:border-[var(--color-primary)] active:scale-[0.97] transition-all"
        >
          <span className="flex items-center justify-center gap-2">👥 Manage Teams</span>
        </button>
      </div>

      {matchCount > 0 && (
        <div className="flex items-center space-x-3 bg-[var(--bg-card)] px-6 py-4 rounded-[20px] border border-[var(--color-border)] shadow-sm max-w-[200px] w-full justify-center transition-all hover:border-[var(--color-primary)]/30">
          <span className="text-2xl drop-shadow-sm">🏆</span>
          <div className="text-left">
            <p className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest">Matches</p>
            <p className="text-xl font-black text-[var(--color-text)] leading-none mt-0.5">{matchCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}

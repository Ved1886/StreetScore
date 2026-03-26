/* ============================================
   Header.jsx — App header with logo,
   dark mode toggle, and sound toggle
   ============================================ */

export default function Header({ darkMode, toggleDarkMode, soundOn, toggleSound, liveId, isViewer }) {
  return (
    <header className="flex items-center justify-between py-3 mb-2">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md overflow-hidden shadow-sm border border-[var(--color-border)]">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent leading-none">
            StreetScore
          </h1>
          {liveId && (
            <div 
              className="flex items-center gap-1.5 mt-1 cursor-pointer group hover:bg-[var(--color-primary)]/10 px-2 py-0.5 rounded transition-all"
              onClick={() => { navigator.clipboard.writeText(liveId); alert('Code copied: ' + liveId); }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
              <span className="text-xs font-black text-[var(--color-primary)] uppercase tracking-tighter">
                {isViewer ? 'Watching Live' : `LIVE ID: ${liveId}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Sound toggle */}
        <button
          id="sound-toggle"
          onClick={toggleSound}
          className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface-card)] text-sm transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-lg active:scale-90"
          title={soundOn ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>

        {/* Dark mode toggle */}
        <button
          id="theme-toggle"
          onClick={toggleDarkMode}
          className="relative w-14 h-8 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface-card)] cursor-pointer transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-lg flex items-center px-1"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div
            className={`w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-[10px] transition-transform duration-300 ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {darkMode ? '🌙' : '☀️'}
          </div>
        </button>
      </div>
    </header>
  );
}

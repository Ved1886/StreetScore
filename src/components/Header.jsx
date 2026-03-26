/* ============================================
   Header.jsx — App header with logo,
   dark mode toggle, and sound toggle
   ============================================ */

export default function Header({ darkMode, toggleDarkMode, soundOn, toggleSound }) {
  return (
    <header className="flex items-center justify-between py-3 mb-2">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <span className="text-3xl animate-logo-bounce" role="img" aria-label="cricket">
          🏏
        </span>
        <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">
          StreetScore
        </h1>
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

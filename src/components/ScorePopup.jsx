/* ============================================
   ScorePopup.jsx — Floating popup animation
   Shows "FOUR!", "SIX!", or "OUT!" in the
   center of the screen with a quick pop-fade
   ============================================ */

export default function ScorePopup({ text, type }) {
  const colorClass =
    type === 'four'
      ? 'text-[var(--color-accent-green)]'
      : type === 'six'
      ? 'text-[var(--color-accent-yellow)]'
      : 'text-[var(--color-accent-red)]';

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl sm:text-8xl font-black pointer-events-none z-50 animate-popup drop-shadow-2xl ${colorClass}`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {text}
    </div>
  );
}

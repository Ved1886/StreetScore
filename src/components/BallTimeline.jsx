/* ============================================
   BallTimeline.jsx — Ball-by-ball display
   Shows colored badges for each delivery
   with over separators (| after every 6 balls)
   ============================================ */

export default function BallTimeline({ ballLog }) {
  if (ballLog.length === 0) return null;

  // Insert over separators after every 6 legal balls
  // Wide/NoBall don't count as legal, so we track separately
  const rendered = [];
  let legalCount = 0;

  ballLog.forEach((ball, i) => {
    const isLegal = ball.type !== 'wide' && ball.type !== 'noball';

    if (isLegal) legalCount++;

    // Add over separator after 6 legal balls (but not at the start)
    if (isLegal && legalCount > 1 && (legalCount - 1) % 6 === 0) {
      rendered.push(
        <span key={`sep-${i}`} className="inline-flex items-center justify-center text-[10px] font-bold text-[var(--color-text-muted)] px-1">
          |
        </span>
      );
    }

    rendered.push(
      <span
        key={i}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all duration-200 ${getBadgeStyle(ball.type)} ${
          i === ballLog.length - 1 ? 'animate-badge-pop' : ''
        }`}
      >
        {ball.label}
      </span>
    );
  });

  return (
    <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in-up">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
        📊 This Over
      </h3>
      <div className="flex gap-1.5 flex-wrap items-center">
        {rendered}
      </div>
    </div>
  );
}

/** Return Tailwind classes for each ball type */
function getBadgeStyle(type) {
  switch (type) {
    case 'dot':
      return 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] border-[var(--color-border)]';
    case 'run':
      return 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30';
    case 'four':
      return 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] border-[var(--color-accent-green)]/30';
    case 'six':
      return 'bg-[var(--color-accent-yellow)]/20 text-[#b8860b] dark:text-[var(--color-accent-yellow)] border-[var(--color-accent-yellow)]/40';
    case 'wicket':
      return 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)] border-[var(--color-accent-red)]/30';
    case 'wide':
    case 'noball':
      return 'bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)] border-[var(--color-accent-blue)]/30';
    default:
      return 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] border-[var(--color-border)]';
  }
}

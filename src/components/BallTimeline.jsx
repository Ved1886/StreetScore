/* ============================================
   BallTimeline.jsx — Ball-by-ball display
   Shows ONE over at a time; swipe or tap arrows
   to navigate previous overs.
   ============================================ */

import { useState, useEffect, useRef } from 'react';

export default function BallTimeline({ ballLog }) {
  // ---- Split ballLog into overs ----
  // An over = 6 legal deliveries; wides/noballs are included in the same over
  const overs = [];
  let currentOver = [];
  let legalInOver = 0;

  ballLog.forEach((ball) => {
    currentOver.push(ball);
    const isLegal = ball.type !== 'wide' && ball.type !== 'noball';
    if (isLegal) legalInOver++;
    if (isLegal && legalInOver === 6) {
      overs.push(currentOver);
      currentOver = [];
      legalInOver = 0;
    }
  });
  if (currentOver.length > 0) overs.push(currentOver);

  const totalOvers = overs.length;
  const [viewIndex, setViewIndex] = useState(totalOvers - 1);

  // Keep viewIndex on the latest over when a new ball is bowled
  useEffect(() => {
    setViewIndex(totalOvers - 1);
  }, [totalOvers]);


  // ---- Swipe / drag to navigate overs ----
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  const onDragStart = (clientX) => {
    dragStartX.current = clientX;
    isDragging.current = true;
  };
  const onDragEnd = (clientX) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const dx = clientX - dragStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) setViewIndex(i => Math.max(0, i - 1));          // swipe right → older
      else        setViewIndex(i => Math.min(totalOvers - 1, i + 1)); // swipe left → newer
    }
    isDragging.current = false;
    dragStartX.current = null;
  };

  if (totalOvers === 0) return null;

  const balls = overs[viewIndex] ?? [];
  const overLabel = viewIndex === totalOvers - 1 ? 'This Over' : `Over ${viewIndex + 1}`;
  const isLatest = viewIndex === totalOvers - 1;

  return (
    <div
      className="glass-card rounded-2xl p-5 mb-4 animate-fade-in-up select-none cursor-grab active:cursor-grabbing"
      /* Touch */
      onTouchStart={e => onDragStart(e.touches[0].clientX)}
      onTouchEnd={e => onDragEnd(e.changedTouches[0].clientX)}
      /* Mouse drag */
      onMouseDown={e => onDragStart(e.clientX)}
      onMouseUp={e => onDragEnd(e.clientX)}
      onMouseLeave={() => { isDragging.current = false; dragStartX.current = null; }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
          📊 {overLabel}
        </h3>
      </div>


      {/* Ball badges for the selected over */}
      <div className="flex gap-1.5 flex-wrap items-center min-h-[2.5rem]">
        {balls.map((ball, i) => (
          <span
            key={i}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all duration-200 ${getBadgeStyle(ball.type)} ${
              isLatest && i === balls.length - 1 ? 'animate-badge-pop' : ''
            }`}
          >
            {ball.label}
          </span>
        ))}
        {balls.length === 0 && (
          <span className="text-xs text-[var(--color-text-muted)] italic">No balls yet</span>
        )}
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

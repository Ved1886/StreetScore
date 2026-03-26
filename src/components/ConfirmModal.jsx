/* ============================================
   ConfirmModal.jsx — Confirmation dialog
   Used for destructive actions like reset
   and clear history
   ============================================ */

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] animate-fade-in-up"
      onClick={onCancel}
    >
      <div
        className="glass-card rounded-3xl p-7 max-w-[340px] w-[90%] text-center animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-[var(--color-text)] mb-5 text-sm leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            id="btn-confirm-cancel"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface-dim)] text-[var(--color-text)] text-sm font-bold cursor-pointer hover:border-[var(--color-primary)] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-yes"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl border-2 border-transparent bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-red-light)] text-white text-sm font-bold cursor-pointer hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

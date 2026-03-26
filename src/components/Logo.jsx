export default function Logo({ className = '', style = {} }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={style}>
      {/* Ambient outer glow */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent-green)] blur-[10px] opacity-40 animate-pulse"></div>
      
      {/* Sleek squircle container */}
      <div className="relative w-full h-full rounded-[25%] bg-[#0b0b14] flex items-center justify-center border-[1.5px] border-white/10 shadow-2xl overflow-hidden group">
        
        {/* Sweeping glare effect on hover */}
        <div className="absolute inset-0 -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent z-20"></div>

        {/* Outer animated rings */}
        <div className="absolute inset-2 rounded-full border border-t-[var(--color-primary-light)] border-r-transparent border-b-transparent border-l-transparent animate-[spin_4s_linear_infinite] opacity-70"></div>
        <div className="absolute inset-3 rounded-full border-[1.5px] border-b-[var(--color-primary)] border-r-[var(--color-primary)] border-t-transparent border-l-transparent -rotate-45 opacity-40"></div>

        {/* Vibrant Glowing Neon Tennis Ball */}
        <div 
          className="relative w-1/2 h-1/2 rounded-full bg-gradient-to-br from-[#00b894] via-[#55efc4] to-[#fbff00] shadow-[0_0_20px_#00b894] z-10 animate-logo-bounce"
        >
          {/* Classic Tennis / Tape ball curves drawn perfectly with pure CSS */}
          <div className="absolute top-0 bottom-0 left-[-20%] w-[50%] border-[2.5px] border-[#0b0b14]/60 rounded-full border-l-transparent border-t-transparent border-b-transparent shadow-[inset_-2px_0_4px_rgba(0,0,0,0.1)]"></div>
          <div className="absolute top-0 bottom-0 right-[-20%] w-[50%] border-[2.5px] border-[#0b0b14]/60 rounded-full border-r-transparent border-t-transparent border-b-transparent shadow-[inset_2px_0_4px_rgba(0,0,0,0.1)]"></div>
        </div>
      </div>
    </div>
  );
}

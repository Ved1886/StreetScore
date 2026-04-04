import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogin({ email: userCredential.user.email, name: userCredential.user.email.split('@')[0], guest: false, uid: userCredential.user.uid });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onLogin({ email: userCredential.user.email, name: userCredential.user.email.split('@')[0], guest: false, uid: userCredential.user.uid });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up py-4">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--color-primary)]/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="glass-card w-full max-w-[400px] p-6 sm:p-10 rounded-[30px] relative overflow-hidden border border-[var(--color-border)] shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black bg-gradient-to-br from-[var(--color-primary)] via-indigo-500 to-purple-400 bg-clip-text text-transparent drop-shadow-sm mb-3" style={{ fontFamily: 'var(--font-display)' }}>
             {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            {isLogin ? 'Sign in to access your matches.' : 'Sign up to sync your scores.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@streetscore.com"
              className="w-full px-5 py-4 rounded-[20px] bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-[var(--color-text-muted)] opacity-90"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required={!isLogin}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-[20px] bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-[var(--color-text-muted)] opacity-90"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 relative group w-full py-4 rounded-[20px] text-lg font-black bg-gradient-to-r from-[var(--color-primary)] to-indigo-500 text-white shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/50 active:scale-[0.98] transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 translate-x-[-150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Processing...' : (isLogin ? '🚀 Sign In' : '✨ Sign Up')}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[var(--color-border)] pt-6">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-black text-[var(--color-primary)] hover:underline decoration-2 underline-offset-2 transition-all cursor-pointer"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        
        <button 
          type="button" 
          onClick={() => onLogin({ name: 'Guest', guest: true })} 
          className="w-full mt-5 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
        >
          Skip & continue as Guest
        </button>
      </div>
    </div>
  );
}

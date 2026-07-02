import { useActionState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

async function registerAction(prevState, formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    // Send password as confirmation as well if the field isn't present in the UI
    const password_confirmation = password; 

    const response = await api.post('/register', { 
      name, 
      email, 
      password, 
      password_confirmation 
    });

    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user_name', response.data.user.name);
    
    return { success: true, error: null, redirectTo: '/dashboard' };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.' 
    };
  }
}

function Register() {
  const navigate = useNavigate();
  
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const result = await registerAction(prevState, formData);
    if (result.success && result.redirectTo) {
      navigate(result.redirectTo);
    }
    return result;
  }, null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0e12] text-slate-800 dark:text-[#e8eaf0] flex items-center justify-center p-5 font-sans antialiased transition-colors duration-300 relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(0,0,0,0))] pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-[#13151c] border border-slate-200 dark:border-[#1e2130] rounded-2xl p-8 md:p-10 shadow-xl relative z-10">
        
        {/* Logo Icon & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4 border border-emerald-100 dark:border-emerald-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Start managing your career pipeline smartly.</p>
        </div>
  
        {state?.error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl text-center">
            {state.error}
          </div>
        )}
  
        {/* Form */}
        <form action={formAction} className="space-y-5 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              placeholder="e.g., Duta" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              placeholder="you@example.com" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              placeholder="Minimum 8 characters" 
            />
          </div>
  
          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-slate-950 font-extrabold rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-md shadow-emerald-500/10"
          >
            {isPending ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
  
        {/* Footer Link */}
        <div className="text-center mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/40">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-500 dark:text-emerald-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
  
      </div>
    </div>
  );
}

export default Register;
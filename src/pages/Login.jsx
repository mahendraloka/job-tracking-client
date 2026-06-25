import { useActionState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

// 1. Fungsi Action: Mengirim email & password ke Laravel 13
async function loginAction(prevState, formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    // Menembak endpoint Login API Laravel
    const response = await api.post('/login', { email, password });

    // Simpan token keamanan Sanctum ke penyimpanan browser
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user_name', response.data.user.name);
    
    return { success: true, error: null, redirectTo: '/dashboard' };
  } catch (err) {
    // Mengambil pesan error dari backend jika password salah atau email tidak terdaftar
    return { 
      success: false, 
      error: err.response?.data?.message || 'Email atau password salah.' 
    };
  }
}

function Login() {
  const navigate = useNavigate();

  // 2. Hook React 19 untuk memantau status pengiriman form otomatis
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const result = await loginAction(prevState, formData);
    if (result.success && result.redirectTo) {
      navigate(result.redirectTo); // Jika sukses, langsung lempar ke Dashboard
    }
    return result;
  }, null);

  return (
    <div className="min-h-screen bg-[#121318] text-[#f3f4f6] flex items-center justify-center p-5 font-sans antialiased selection:bg-emerald-500 selection:text-slate-900">
      <div className="max-w-md w-full bg-[#1a1c23] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1.5">Sign in to continue tracking your applications.</p>
        </div>
  
        {state?.error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl text-center">
            {state.error}
          </div>
        )}
  
        {/* FORM SECTION */}
        <form action={formAction} className="space-y-5 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors" 
              placeholder="you@example.com" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors" 
              placeholder="••••••••" 
            />
          </div>
  
          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full py-3 px-4 bg-emerald-400 hover:bg-emerald-300 disabled:bg-emerald-800 text-slate-950 font-bold rounded-xl transition-colors duration-200 active:scale-[0.99] cursor-pointer"
          >
            {isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
  
        {/* FOOTER LINK */}
        <div className="text-center mt-6 pt-4 border-t border-slate-800/60">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 font-bold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
  
      </div>
    </div>
  );
}

export default Login;
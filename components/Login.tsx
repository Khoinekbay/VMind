import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Loader2, AlertCircle, Ghost, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onNavigate: (page: 'register' | 'home' | 'dashboard') => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseReady = Boolean(supabase);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError('Supabase chưa được cấu hình. Hãy thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY để bật đăng nhập.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const loginInput = formData.get('email') as string; // Could be username or email
    const password = formData.get('password') as string;

    // Detect if input is an email. If not, append the fake domain.
    let email = loginInput;
    if (!loginInput.includes('@')) {
      email = `${loginInput}@v-mind.local`;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      onNavigate('dashboard');
    } catch (err: any) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    if (!supabase) {
      setError('Supabase chưa được cấu hình.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAnonymousLogin = async () => {
    if (!supabase) {
      setError('Supabase chưa được cấu hình.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || "Đăng nhập ẩn danh thất bại. Hãy đảm bảo bạn đã bật Anonymous Sign-in trên Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 dark:bg-cyber-black px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-cyber-gunmetal p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-display tracking-wider text-brand-700 dark:text-brand-400">Chào mừng trở lại</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400 font-sans">
            Đăng nhập bằng Tên đăng nhập hoặc Email
          </p>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 font-sans">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="login-input" className="sr-only">Tên đăng nhập / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="login-input"
                  name="email"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm font-sans"
                  placeholder="Tên đăng nhập"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm font-sans"
                  placeholder="Mật khẩu"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-gray-300 font-sans">
                Ghi nhớ
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 font-sans">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !supabaseReady}
              className="group relative flex w-full justify-center rounded-xl bg-brand-600 dark:bg-brand-700 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 dark:hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed font-sans"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                 {loading ? <Loader2 className="h-5 w-5 animate-spin text-brand-200" /> : <ArrowRight className="h-5 w-5 text-brand-500 dark:text-brand-300 group-hover:text-brand-400" aria-hidden="true" />}
              </span>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-cyber-gunmetal px-2 text-slate-500 dark:text-gray-400 font-sans">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-sans"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-sans"
            >
              <Github className="h-5 w-5 text-gray-900 dark:text-white" />
              GitHub
            </button>
          </div>
          
          <div className="mt-3">
             <button 
              onClick={handleAnonymousLogin}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-sans"
            >
              <Ghost className="h-5 w-5" />
              Truy cập Khách (Không cần Tài khoản)
            </button>
          </div>
        </div>
        
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-gray-400 font-sans">
           Chưa có tài khoản?{' '}
           <button onClick={() => onNavigate('register')} className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500">
             Đăng ký ngay
           </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
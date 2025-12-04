import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Loader2, AlertCircle, AtSign } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onNavigate: (page: 'login' | 'home' | 'dashboard') => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseReady = Boolean(supabase);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError('Supabase chưa được cấu hình. Hãy thêm VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY hoặc NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY để bật đăng ký.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const fullname = formData.get('fullname') as string;
    const contactEmail = formData.get('email') as string; // Optional real email

    // Validation basic
    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
      setError("Tên đăng nhập chỉ được chứa chữ cái, số, dấu chấm và gạch dưới.");
      setLoading(false);
      return;
    }

    // Create Pseudo-Email
    const fakeEmail = `${username}@v-mind.local`;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          data: {
            username: username, // Important: Store real username
            full_name: fullname,
            contact_email: contactEmail, // Store real email for admin support
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Successful signup - redirect to dashboard
        onNavigate('dashboard');
      }
    } catch (err: any) {
      if (err.message.includes("already registered")) {
        setError("Tên đăng nhập này đã có người sử dụng.");
      } else {
        setError(err.message || 'Đã có lỗi xảy ra khi đăng ký.');
      }
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 dark:bg-cyber-black px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-cyber-gunmetal p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-display tracking-wider text-brand-700 dark:text-brand-400">Tạo tài khoản V-Mind</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400 font-sans">
            Đăng ký bằng tên đăng nhập, không cần email thật
          </p>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 font-sans">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
             <div>
              <label htmlFor="fullname" className="sr-only">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm font-sans"
                  placeholder="Họ và tên hiển thị"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="sr-only">Tên đăng nhập</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  pattern="[a-zA-Z0-9_.]+"
                  title="Chữ cái không dấu, số, dấu chấm hoặc gạch dưới"
                  className="relative block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm font-sans"
                  placeholder="Tên đăng nhập (viết liền, không dấu)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-address" className="sr-only">Email (Tùy chọn)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  className="relative block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm font-sans"
                  placeholder="Email hỗ trợ (Tùy chọn - để Admin liên hệ)"
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
                  required
                  minLength={6}
                  className="relative block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm font-sans"
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                />
              </div>
            </div>
          </div>

           <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 dark:bg-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-slate-700 dark:text-gray-300 font-sans">
                  Tôi đồng ý với <a href="#" className="text-brand-600 dark:text-brand-400 hover:text-brand-500">Điều khoản dịch vụ</a>
                </label>
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
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-cyber-gunmetal px-2 text-slate-500 dark:text-gray-400 font-sans">Hoặc</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-sans"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
        </div>
        
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-gray-400 font-sans">
           Đã có tài khoản?{' '}
           <button onClick={() => onNavigate('login')} className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500">
             Đăng nhập ngay
           </button>
        </p>
      </div>
    </div>
  );
};

export default Register;